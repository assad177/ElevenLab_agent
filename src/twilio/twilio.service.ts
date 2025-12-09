import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import { Server } from 'http';
import WebSocket from 'ws';
import { decode as mulawDecode, encode as mulawEncode } from 'mulaw-js';

interface QueuedAudio {
  type: 'input_audio_buffer.append';
  audio: string;
}

interface TwilioWebSocket extends WebSocket {
  streamSid?: string;
  pingInterval?: NodeJS.Timeout;
  cleanupDone?: boolean;
}

@Injectable()
export class TwilioService implements OnModuleInit {
  private wss: WebSocketServer;
  private elevenConnections = new Map<TwilioWebSocket, WebSocket>();
  private queues = new Map<TwilioWebSocket, QueuedAudio[]>();
  private elevenReady = new Map<TwilioWebSocket, boolean>();

  onModuleInit() {
    console.log('🚀 Twilio Service initialized');

    const agentId = 'agent_7201kbbzrwrnetv86dxckseqangd';
    const apiKey = 'sk_084d3b8180a91bb56ba4410bfd4c843310f46e7327d0d2e2';

    if (!agentId || !apiKey) console.error('❌ Missing ElevenLabs credentials');
    else console.log('✅ ElevenLabs credentials loaded');
  }

  initServer(server: Server) {
    console.log('🔌 Initializing Twilio WebSocket server');
    this.wss = new WebSocketServer({ noServer: true });

    this.wss.on('connection', (ws: TwilioWebSocket) => {
      console.log('📞 Twilio connected');

      const agentId = 'agent_7201kbbzrwrnetv86dxckseqangd';
      const apiKey = 'sk_084d3b8180a91bb56ba4410bfd4c843310f46e7327d0d2e2';

      const eleven = new WebSocket(
        `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`,
        { headers: { 'xi-api-key': apiKey } }
      );

      this.elevenConnections.set(ws, eleven);
      this.queues.set(ws, []);
      this.elevenReady.set(ws, false);
      ws.cleanupDone = false;

      eleven.on('open', () => {
        console.log('✅ ElevenLabs WebSocket opened');
        eleven.send(JSON.stringify({
          type: 'conversation_start',
          audio_format: { sample_rate: 8000, channels: 1 }
        }));
      });

      eleven.on('message', (data: Buffer) => {
        try {
          const msg = JSON.parse(data.toString());

          if (msg.type === 'conversation_initiation_metadata') {
            this.elevenReady.set(ws, true);
            const queue = this.queues.get(ws) || [];
            queue.forEach(audio => eleven.send(JSON.stringify(audio)));
            this.queues.set(ws, []);
          } else if (msg.type === 'audio') {
            if (!ws.streamSid || ws.readyState !== WebSocket.OPEN) return;
            const pcm = Buffer.from(msg.audio_event?.audio_base_64 || '', 'base64');
            const mulawAudio = mulawEncode(pcm);

            ws.send(JSON.stringify({
              event: 'media',
              streamSid: ws.streamSid,
              media: { payload: Buffer.from(mulawAudio).toString('base64') }
            }));
          } else if (msg.type === 'ping') {
            eleven.send(JSON.stringify({ type: 'pong', event_id: msg.ping_event?.event_id }));
          }
        } catch (err) { console.error('❌ ElevenLabs parse error:', err); }
      });

      ws.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          const eleven = this.elevenConnections.get(ws);
          if (!eleven) return;

          switch (msg.event) {
            case 'start':
              ws.streamSid = msg.start?.streamSid;
              break;
            case 'media':
              if (!msg.media?.payload) return;
              const mulaw = Buffer.from(msg.media.payload, 'base64');
              const pcmSamples = mulawDecode(mulaw);
              const audioChunk: QueuedAudio = {
                type: 'input_audio_buffer.append',
                audio: Buffer.from(pcmSamples).toString('base64')
              };

              if (this.elevenReady.get(ws) && eleven.readyState === WebSocket.OPEN) {
                eleven.send(JSON.stringify(audioChunk));
              } else {
                const q = this.queues.get(ws) || [];
                if (q.length < 50) q.push(audioChunk);
                this.queues.set(ws, q);
              }
              break;
            case 'stop':
              if (eleven.readyState === WebSocket.OPEN) {
                eleven.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
                eleven.send(JSON.stringify({ type: 'response.create' }));
              }
              break;
          }
        } catch (err) { console.error('❌ Twilio parse error:', err); }
      });

      ws.on('close', () => this.cleanup(ws));
      ws.on('error', (err) => console.error('❌ Twilio WS error:', err.message));

      ws.pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.ping();
        if (eleven.readyState === WebSocket.OPEN) eleven.send(JSON.stringify({ type: 'ping' }));
      }, 30000);
    });

    server.on('upgrade', (req, socket, head) => {
      if (req.url === '/voice') {
        this.wss.handleUpgrade(req, socket, head, (ws) =>
          this.wss.emit('connection', ws as TwilioWebSocket, req)
        );
      } else socket.destroy();
    });

    console.log('🔉 WebSocket listening on /voice');
  }

  private cleanup(ws: TwilioWebSocket) {
    if (ws.cleanupDone) return;
    ws.cleanupDone = true;

    if (ws.pingInterval) clearInterval(ws.pingInterval);

    const eleven = this.elevenConnections.get(ws);
    if (eleven && eleven.readyState === WebSocket.OPEN) eleven.close(1000, 'Twilio disconnected');

    this.elevenConnections.delete(ws);
    this.queues.delete(ws);
    this.elevenReady.delete(ws);
  }
}
