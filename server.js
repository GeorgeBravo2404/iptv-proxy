const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const FUENTE = process.env.FUENTE || 'https://example.com/player'; // <-- Cámbialo luego en Railway

let enlaceM3U8 = null;

async function actualizarEnlace() {
  try {
    const { data } = await axios.get(FUENTE, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const match = data.match(/https[^"']+\.m3u8[^"']*/);
    if (match && match[0]) {
      enlaceM3U8 = match[0];
      console.log('✅ Enlace actualizado:', enlaceM3U8);
    } else {
      console.log('⚠️ No se encontró enlace .m3u8');
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

actualizarEnlace();
setInterval(actualizarEnlace, 60 * 60 * 1000); // cada 1 hora

app.get('/mi-canal.m3u8', (req, res) => {
  if (enlaceM3U8) {
    res.redirect(enlaceM3U8);
  } else {
    res.status(503).send('Enlace aún no disponible');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
