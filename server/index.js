const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const https = require('https');
const fs = require('fs');
const { SpheronClient, ProtocolEnum } = require("@spheron/storage");

dotenv.config();

const app = express();
const HTTPS_PORT = process.env.HTTPS_PORT || 8080;
const SPHERON_TOKEN = process.env.SPHERON_TOKEN;

app.use(cors());

app.get("/initiate-upload", async (req, res, next) => {
  try {
    const bucketName = "facefable0";
    const protocol = ProtocolEnum.IPFS;

    const client = new SpheronClient({
      token: SPHERON_TOKEN,
    });

    const { uploadToken } = await client.createSingleUploadToken({
      name: bucketName,
      protocol,
    });

    res.status(200).json({
      uploadToken,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// HTTPS options
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/fleek0.rowant.co/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/fleek0.rowant.co/fullchain.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/fleek0.rowant.co/chain.pem')
};

// Create HTTPS server
const httpsServer = https.createServer(options, app);

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
});
