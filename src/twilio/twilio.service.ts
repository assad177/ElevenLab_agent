import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { identity } from 'rxjs';
import { ElevenLabService } from 'src/eleven-lab/eleven-lab.service';
import { jwt } from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

config();

@Injectable()
export class TwilioService {
  // constructor(private elevenLabService: ElevenLabService) {}

  generateToken(identity: string) {
    const AccessToken = jwt.AccessToken;
    const VoiceGrant = jwt.AccessToken.VoiceGrant;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY_SID!,
      process.env.TWILIO_API_KEY_SECRET!,
      {
        identity: identity,
        region: 'au1', // ✅ This line MUST be there
      },
    );

    token.addGrant(
      new VoiceGrant({
        outgoingApplicationSid: process.env.TWIML_APP_SID,
        incomingAllow: true,
      }),
    );
    console.log(token);
    return { token: token.toJwt() };
  }

  async makeCall(number: string, res) {
    const twiml = new VoiceResponse();

    twiml.dial({ callerId: process.env.TWILIO_PHONE_NUMBER }, number);
    console.log(number);
    res.type('text/xml');
    res.send(twiml.toString());
  }
}
