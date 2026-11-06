const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve static files from root directory
app.use(express.static(__dirname));

// Route handling
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/charleston', (req, res) => {
  res.sendFile(path.join(__dirname, 'charleston.html'));
});

// Fallback to index.html for unrecognized routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Thursday Tile Society server listening on http://${HOST}:${PORT}`);
});
