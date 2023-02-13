module.exports = { // pm2 start process.config.js
  apps: [
    {
      name: 'gateway',
      script: './server/gateway.js',
      watch: true,
    },
    // {
    //   name: 'messanger',
    //   script: './server/messanger.js',
    //   watch: true,
    // },
    {
      name: 'websocket',
      script: './server/websocket.js',
      watch: true,
    },
    {
      name: 'auth',
      script: './server/auth.js',
      watch: true,
    },
    {
      name: 'listing',
      script: './server/listing.js',
      watch: true,
    },
    {
      name: 'inquiry',
      script: './server/inquiry.js',
      watch: true,
    },
    {
      name: 'react',
      script: 'npm start',
      watch: false,
    }
  ],
};