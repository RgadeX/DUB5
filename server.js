const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5088;

// Serve static files from root
app.use(express.static(__dirname));

// Custom routes for games
app.get('/snake', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'snake', 'index.html'));
});

app.get('/minesweeper', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'minesweeper', 'index.html'));
});

app.get('/blockblast', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'blockblast', 'index.html'));
});

app.get('/rekenmachine', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'rekenmachine', 'index.html'));
});

app.get('/2048', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', '2048', 'index.html'));
});

app.get('/tetris', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'tetris', 'index.html'));
});

app.get('/memory', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'memory', 'index.html'));
});

app.get('/flappy', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'flappy', 'index.html'));
});

app.get('/pong', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'pong', 'index.html'));
});

app.get('/sudoku', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'sudoku', 'index.html'));
});

app.get('/gnomelauncher', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'gnomelauncher', 'index.html'));
});

app.get('/breakout', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'breakout', 'index.html'));
});

app.get('/baseball', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'baseball', 'index.html'));
});

// Tools routes
app.get('/tools', (req, res) => {
  res.sendFile(path.join(__dirname, 'tools', 'index.html'));
});

app.get('/kleurenkiezer', (req, res) => {
  res.sendFile(path.join(__dirname, 'kleurenkiezer', 'index.html'));
});

app.get('/qr-generator', (req, res) => {
  res.sendFile(path.join(__dirname, 'qr-generator', 'index.html'));
});

app.get('/wachtwoord', (req, res) => {
  res.sendFile(path.join(__dirname, 'wachtwoord', 'index.html'));
});

app.get('/tekst', (req, res) => {
  res.sendFile(path.join(__dirname, 'tekst', 'index.html'));
});

app.get('/eenheden', (req, res) => {
  res.sendFile(path.join(__dirname, 'eenheden', 'index.html'));
});

app.get('/numworks', (req, res) => {
  res.sendFile(path.join(__dirname, 'numworks', 'index.html'));
});

// Study routes
app.get('/biologie', (req, res) => {
  res.sendFile(path.join(__dirname, 'biologie', 'index.html'));
});

app.get('/study-tools', (req, res) => {
  res.sendFile(path.join(__dirname, 'study-tools', 'index.html'));
});

app.get('/leerplatform', (req, res) => {
  res.sendFile(path.join(__dirname, 'leerplatform', 'index.html'));
});

app.get('/woordenlijst', (req, res) => {
  res.sendFile(path.join(__dirname, 'woordenlijst', 'index.html'));
});

app.get('/flashcards', (req, res) => {
  res.sendFile(path.join(__dirname, 'flashcards', 'index.html'));
});

app.get('/oefentoetsen', (req, res) => {
  res.sendFile(path.join(__dirname, 'oefentoetsen', 'index.html'));
});

app.get('/samenvattingen', (req, res) => {
  res.sendFile(path.join(__dirname, 'samenvattingen', 'index.html'));
});

// Hacks routes
app.get('/blooket-hacks', (req, res) => {
  res.sendFile(path.join(__dirname, 'blooket-hacks', 'index.html'));
});

app.get('/alle-hacks', (req, res) => {
  res.sendFile(path.join(__dirname, 'alle-hacks', 'index.html'));
});

app.get('/kahoot-hacks', (req, res) => {
  res.sendFile(path.join(__dirname, 'kahoot-hacks', 'index.html'));
});

app.get('/quizlet-hacks', (req, res) => {
  res.sendFile(path.join(__dirname, 'quizlet-hacks', 'index.html'));
});

app.get('/gimkit-hacks', (req, res) => {
  res.sendFile(path.join(__dirname, 'gimkit-hacks', 'index.html'));
});

// Guides routes
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog', 'index.html'));
});

app.get('/handleidingen', (req, res) => {
  res.sendFile(path.join(__dirname, 'handleidingen', 'index.html'));
});

app.get('/how-to', (req, res) => {
  res.sendFile(path.join(__dirname, 'how-to', 'index.html'));
});

app.get('/installatie', (req, res) => {
  res.sendFile(path.join(__dirname, 'installatie', 'index.html'));
});

app.get('/tips', (req, res) => {
  res.sendFile(path.join(__dirname, 'tips', 'index.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'faq', 'index.html'));
});

app.get('/problemen', (req, res) => {
  res.sendFile(path.join(__dirname, 'problemen', 'index.html'));
});

// Gallery route
app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'gallery', 'index.html'));
});

// SPA fallback - serve index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DUB5 running at http://localhost:${PORT}`);
  console.log(`Games: /snake, /minesweeper, /blockblast, /rekenmachine, /2048, /tetris, /memory, /flappy, /pong, /sudoku, /gnomelauncher, /breakout, /baseball`);
  console.log(`Tools: /tools, /kleurenkiezer, /qr-generator, /wachtwoord, /tekst, /eenheden, /numworks`);
  console.log(`Study: /biologie, /study-tools, /leerplatform, /woordenlijst, /flashcards, /oefentoetsen, /samenvattingen`);
  console.log(`Hacks: /blooket-hacks, /alle-hacks, /kahoot-hacks, /quizlet-hacks, /gimkit-hacks`);
  console.log(`Guides: /blog, /handleidingen, /how-to, /installatie, /tips, /faq, /problemen`);
  console.log(`Gallery: /gallery`);
});
