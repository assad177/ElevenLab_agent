import { Body, Controller, Req, Res, Post } from '@nestjs/common';
import { ElevenLabService } from './elevenlab.service';

@Controller('elevenlab')
export class ElevenlabController {
  constructor(private elevenlab: ElevenLabService) {}

  @Post('call')
  async initiateCall(@Body() body: { phone: string }) {
    console.log('Received call request for phone:', body.phone);
    return await this.elevenlab.callStudent(body.phone);
  }

@Post('incoming-call')
async handleWebhooks(@Req() req, @Res() res) {
  const callSid = req.body.CallSid;
  const from = req.body.From;

  console.log('📞 Incoming call:', callSid, 'from:', from);
  
  
  const backendUrl = process.env.BACKEND_URL;

  
  const wsUrl = `ws://134.199.166.202:3000/voice`;

  console.log('🔗 WebSocket URL:', wsUrl);
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}"/>
  </Connect>
</Response>`;

  res.type('text/xml').send(twiml);
  console.log('✅ Response sent');
}


  @Post('elevenlabs/webhook')
  async handleWebhook(@Body() body: any) {
    const conversationId = body.conversation_id;
    console.log('Received webhook for conversation ID:', conversationId);
    const summary = await this.elevenlab.getCallSummary(conversationId);

    const transcriptSummary =
      summary.analysis?.transcript_summary || 'No summary available';
    const callTitle = summary.analysis?.call_summary_title || 'No title';
    // const phonenumber =
    //   summary.custom_metadata?.receiverNumber || 'Unknown number';
    // console.log('Call received by number:', phonenumber);

    console.log('Call title:', callTitle, 'Call summary', transcriptSummary);
    return { status: 'ok', callTitle, transcriptSummary };
  }
}
