const express = require('express');
const app = express();
const PORT = 5173;

app.get('/', (req, res) => res.send('✅ Serveur Express WSL OK'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur sur http://0.0.0.0:${PORT}`);
});
