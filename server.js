const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5093;

// Block learning-related folders that are kept locally but not served
const BLOCKED_PATHS = [
  '/term-learner',
  '/term-learner-main',
  '/stellar-term-learner',
  '/light-learning-platform',
  '/light-learning-platform-standalone'
];
app.use((req, res, next) => {
  if (BLOCKED_PATHS.some((p) => req.path === p || req.path.startsWith(p + '/'))) {
    return res.status(404).send('Not found');
  }
  next();
});

// Serve static files from root
app.use(express.static(__dirname));

// Research API routes
app.get('/api/blogs', (req, res) => {
  try {
    const indexPath = path.join(__dirname, 'content', 'research', 'index.json');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const indexData = JSON.parse(indexContent);
    res.json(indexData);
  } catch (error) {
    console.error('Error loading blogs index:', error);
    res.status(500).json({ error: 'Failed to load blog content' });
  }
});

app.get('/api/blogs/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const indexPath = path.join(__dirname, 'content', 'research', 'index.json');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const indexData = JSON.parse(indexContent);

    const postMeta = indexData.posts.find((p) => p.slug === slug);
    if (!postMeta) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const postPath = path.join(__dirname, 'content', 'research', 'posts', `${postMeta.id}.json`);
    const postContent = fs.readFileSync(postPath, 'utf-8');
    const postData = JSON.parse(postContent);
    res.json(postData);
  } catch (error) {
    console.error('Error loading blog post:', error);
    res.status(500).json({ error: 'Failed to load blog post' });
  }
});

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

app.get('/liquid-soccer', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'liquid-soccer', 'index.html'));
});

// Serve static assets for liquid-soccer
app.use('/liquid-soccer', express.static(path.join(__dirname, 'games', 'liquid-soccer')));

app.get('/stacktris', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'stacktris', 'index.html'));
});

// Serve static assets for stacktris
app.use('/stacktris', express.static(path.join(__dirname, 'games', 'stacktris')));

app.get('/block-blast', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'blockblast-pro', 'index.html'));
});

// Serve static assets for block-blast (Defold game files)
app.use('/block-blast', express.static(path.join(__dirname, 'games', 'blockblast-pro')));

app.get('/subway-surfers', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'subway-surfers', 'index.html'));
});

// Serve static assets for subway-surfers (mirrored web build)
app.use('/subway-surfers', express.static(path.join(__dirname, 'games', 'subway-surfers')));

app.get('/geometry-dash', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'geometry-dash', 'index.html'));
});

// Serve static assets for geometry-dash (full WASM port + payload)
app.use('/geometry-dash', express.static(path.join(__dirname, 'games', 'geometry-dash')));

// The GD port requests its fonts from the site root
app.use('/fonts', express.static(path.join(__dirname, 'games', 'geometry-dash', 'fonts')));

app.get('/cijferkaart', (req, res) => {
  res.sendFile(path.join(__dirname, 'cijferkaart', 'index.html'));
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

app.get('/woordenlijst', (req, res) => {
  res.sendFile(path.join(__dirname, 'woordenlijst', 'index.html'));
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
  res.sendFile(path.join(__dirname, 'blogs', 'index.html'));
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

// Blogs routes
app.get('/blogs', (req, res) => {
  res.sendFile(path.join(__dirname, 'blogs', 'index.html'));
});

app.get('/blogs/', (req, res) => {
  res.sendFile(path.join(__dirname, 'blogs', 'index.html'));
});

app.get('/blogs/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'blogs', 'post.html'));
});

// Content format documentation
app.get('/blogs/content-format', (req, res) => {
  res.download(path.join(__dirname, 'content', 'research', 'CONTENT-FORMAT.md'));
});

// Mario games routes
app.get('/nsmbw-web-port', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'nsmbw-web-port', 'index.html'));
});

app.get('/SM64-PC-Port-WebGL', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'SM64-PC-Port-WebGL', 'index.html'));
});

// New original game routes
app.get('/minecraft', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'minecraft', 'index.html'));
});

app.get('/skate3', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'skate3', 'index.html'));
});

app.get('/gta-vice-city', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'gta-vice-city', 'index.html'));
});

app.get('/simpsons-hit-and-run', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'simpsons-hit-and-run', 'index.html'));
});

app.get('/skate-rust', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'skate-rust', 'index.html'));
});

app.get('/cs-surf', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'cs-surf', 'index.html'));
});

app.get('/halo-ce', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'halo-ce', 'index.html'));
});

app.get('/halo-ce-mobile', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'halo-ce-mobile', 'index.html'));
});

app.get('/pes6', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'pes6', 'index.html'));
});

app.get('/bo1-zombies', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'bo1-zombies', 'index.html'));
});

app.get('/moon-zombies', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'moon-zombies', 'index.html'));
});

app.get('/kino-der-toten', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'kino-der-toten', 'index.html'));
});

app.get('/bo3-cheese-cube', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'bo3-cheese-cube', 'index.html'));
});

app.get('/bo2', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'bo2', 'index.html'));
});

app.get('/mw2', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'mw2', 'index.html'));
});

app.get('/gta5', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'gta5', 'index.html'));
});

// Serve static assets for showcase (must be before the route)
app.use('/showcase', express.static(path.join(__dirname, 'showcase')));

app.get('/showcase', (req, res) => {
  res.sendFile(path.join(__dirname, 'showcase', 'index.html'));
});

// SPA fallback - serve index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DUB5 running at http://localhost:${PORT}`);
  console.log(`Games: /snake, /minesweeper, /blockblast, /rekenmachine, /2048, /tetris, /memory, /flappy, /pong, /sudoku, /gnomelauncher, /breakout, /baseball, /liquid-soccer, /stacktris, /block-blast, /subway-surfers, /geometry-dash, /nsmbw-web-port, /SM64-PC-Port-WebGL, /minecraft, /skate3, /gta-vice-city, /simpsons-hit-and-run, /skate-rust, /cs-surf, /halo-ce, /halo-ce-mobile, /pes6, /bo1-zombies, /moon-zombies, /kino-der-toten, /bo3-cheese-cube, /bo2, /mw2, /gta5, /cijferkaart`);
  console.log(`Tools: /tools, /kleurenkiezer, /qr-generator, /wachtwoord, /tekst, /eenheden, /numworks, /cijferkaart`);
  console.log(`Study: /biologie, /study-tools, /leerplatform, /woordenlijst, /flashcards, /oefentoetsen, /samenvattingen`);
  console.log(`Hacks: /blooket-hacks, /alle-hacks, /kahoot-hacks, /quizlet-hacks, /gimkit-hacks`);
  console.log(`Guides: /blogs, /handleidingen, /how-to, /installatie, /tips, /faq, /problemen`);
  console.log(`Gallery: /gallery`);
  console.log(`Blogs: /blogs, /blogs/content-format`);
  console.log(`Showcase: /showcase`);
});
