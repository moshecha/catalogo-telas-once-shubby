// webhook.js en raiz

require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const SECRET = process.env.WEBHOOK_SECRET;
const PROJECT_DIR = process.env.PROJECT_DIR;
const PM2_NAME = process.env.PM2_NAME;

// Necesitamos el cuerpo RAW para verificar la firma correctamente
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

function verifySignature(req) {
  const sig = req.headers['x-hub-signature-256'] || '';
  if (!sig || !SECRET) return false;
  const hmac = 'sha256=' + crypto.createHmac('sha256', SECRET).update(req.rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(sig));
  } catch (e) {
    return false;
  }
}

app.post('/webhook', (req, res) => {
  if (!verifySignature(req)) {
    console.log("Webhook: firma inválida");
    return res.status(401).send('Invalid signature');
  }
  // Opcional: comprobar que es push y al branch que quieras: req.body.ref === 'refs/heads/main'
  console.log("Webhook recibido, actualizando repo...");
  const cmd = `
    cd ${PROJECT_DIR} &&
    git fetch --all &&
    git reset --hard origin/main &&
    npm ci --only=production || npm install --production &&
    pm2 reload ${PM2_NAME} || pm2 start npm --name "${PM2_NAME}" -- start
  `;
  exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error("Error al actualizar:", err);
      console.error(stderr);
      return;
    }
    console.log(stdout);
  });
  res.status(200).send('OK');
});

const PORT = process.env.WEBHOOK_PORT || 3001;
app.listen(PORT, () => console.log(`Webhook escuchando en puerto ${PORT}`));
