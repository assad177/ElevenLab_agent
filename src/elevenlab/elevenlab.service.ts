import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { config } from 'dotenv';
config();

@Injectable()
export class ElevenLabService {
  private apiKey = process.env.ELEVEN_LAB_API_KEY!;
  private agentId = process.env.AGENT_ID!;
  private agentPhoneNumberId = process.env.phone_no_id;

  async callStudent(toNumber: string) {
    try {
      const url = 'https://api.elevenlabs.io/v1/convai/twilio/outbound-call';

      const body = {
        agent_id: this.agentId,
        agent_phone_number_id: this.agentPhoneNumberId,
        to_number: toNumber,
        // voice: process.env.ELEVEN_VOICE_ID,
        webhook_url: `${process.env.BACKEND_URL}/elevenlab/elevenlabs/webhook`,
        // custom_metadata: {
        //   receiverNumber: toNumber,
        // },
      };

      const response = await axios.post(url, body, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      console.log('Call initiated:', response.data);
      return {
        success: true,
        callId: response.data.call_id,
        conversationId: response.data.conversation_id,
        message: `Call initiated to ${toNumber}`,
        // recievernumber: response.data.recievernumber,
      };
    } catch (error: any) {
      console.error(
        'Error initiating call:',
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  }



//   async connectCallToAgent(callSid: string) {
//   try {
//     const url = 'https://api.elevenlabs.io/v1/convai/twilio/inbound-call';

//     const body = {
//       agent_id: this.agentId,
//       call_sid: callSid,
//       webhook_url: `${process.env.BACKEND_URL}/elevenlab/elevenlabs/webhook`,
//     };

//     console.log('🔗 Connecting to agent:', callSid);

//     const response = await axios.post(url, body, {
//       headers: {
//         'xi-api-key': this.apiKey,
//         'Content-Type': 'application/json',
//       },
//     });

//     console.log('✅ Connected:', response.data.conversation_id);

//     return {
//       success: true,
//       conversationId: response.data.conversation_id,
//     };

//   } catch (error: any) {
//     console.error('❌ Error connecting:', error.response?.data || error.message);
//     return {
//       success: false,
//       error: error.response?.data?.detail || error.message,
//     };
//   }
// }

  async getCallSummary(conversationId: string) {
    const url = `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`;

    const response = await axios.get(url, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    });

    return response.data;
  }
}
