module.exports = {
  apps: [
    {
      name: 'elevenlab',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        ELEVEN_LAB_API_KEY: 'sk_084d3b8180a91bb56ba4410bfd4c843310f46e7327d0d2e2',
        ELEVEN_VOICE_ID: 'rU18Fk3uSDhmg5Xh41o4',
        AGENT_ID: 'agent_7201kbbzrwrnetv86dxckseqangd',
        AGENT_PHONE_NUMBER_ID: 'YOUR_AGENT_PHONE_NUMBER_ID',
        BACKEND_URL: 'http://134.199.166.202:3000',
        WS_URL: 'wss://134.199.166.202:3000/voice',
      },
    },
  ],
};
