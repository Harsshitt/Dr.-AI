// Backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// simple health check
app.get('/', (req, res) => {
  res.send('Dr.AI backend is running');
});

// example POST route (placeholder for later OpenAI/chat routes)
app.post('/api/chat', (req, res) => {
  // placeholder: echo request body for now
  return res.json({ ok: true, received: req.body || null });
});

app.listen(PORT, () => {
  console.log(`Dr.AI backend listening on http://localhost:${PORT}`);
});