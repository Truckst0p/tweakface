const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { SpheronClient, ProtocolEnum } = require("@spheron/storage");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;
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

var https = require('https');
var fs = require('fs');
var options = {
     key: fs.readFileSync('/etc/letsencrypt/live/fleek0.rowant.co/privkey.pem'),
     cert: fs.readFileSync('/etc/letsencrypt/live/fleek0.rowant.co/fullchain.pem'),
     ca: fs.readFileSync('/etc/letsencrypt/live/fleek0.rowant.co/chain.pem')
}
var server = https.createServer(options, handlerFunction);
server.listen(8080, '127.0.0.1');

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
