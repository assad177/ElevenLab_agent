// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server } from 'ws';
// import WebSocket from 'ws';

// @WebSocketGateway({
//   cors: true,
//   path: '/voice', // Twilio stream connect karega
//   transport: ['websocket'],
// })
// export class TwilioGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   handleConnection(client: WebSocket) {
//     console.log('📞 Twilio connected');

//     // Twilio handshake
//     client.send(
//       JSON.stringify({
//         event: 'connected',
//         protocol: 'audio',
//         version: 1,
//       }),
//     );

//     // Twilio messages receive karna
//     client.on('message', (rawData) => {
//       try {
//         const msg = JSON.parse(rawData.toString());

//         switch (msg.event) {
//           case 'start':
//             console.log('🎤 Stream started');
//             console.log('StreamSid:', msg.start?.streamSid);
//             console.log('MediaFormat:', msg.start?.mediaFormat);
//             break;

//           case 'media':
//             const base64Audio = msg.media.payload;
//             // TODO: yahan AI service ya audio processing karein
//             console.log('🎧 Audio chunk received:', base64Audio.length, 'bytes');
//             break;

//           case 'stop':
//             console.log('⏹️ Stream stopped');
//             break;

//           default:
//             console.log('📨 Twilio Message:', msg.event);
//         }
//       } catch (err) {
//         console.error('❌ Error parsing Twilio message:', err);
//       }
//     });

//     client.on('close', () => {
//       console.log('🔌 Twilio disconnected');
//     });

//     client.on('error', (err) => {
//       console.error('❌ Twilio WebSocket error:', err);
//     });
//   }

//   handleDisconnect(client: WebSocket) {
//     console.log('🔌 Twilio disconnected (Gateway)');
//   }
// }
