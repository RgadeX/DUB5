// Recursive static mirror of a game directory.
// Usage: node tools/mirror-game.js <baseUrl> <outDir>
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BASE = process.argv[2].replace(/\/$/, '');
const OUT = process.argv[3];
const baseOrigin = new URL(BASE).origin;
const seen = new Set();
const queue = [BASE + '/index.html'];
const TEXT_EXT = /\.(html?|js|mjs|css|json|webmanifest|txt|xml|svg|map)$/i;
const SKIP_EXT = /\.(png|jpe?g|webp|avif|gif|mp3|ogg|wav|m4a|mp4|webm|woff2?|ttf|otf|wasm|data|bin|glb|gltf|zip|unityweb|pck|arsc)$/i;
let downloaded = 0, failed = 0, totalBytes = 0;

function outPathFor(url) {
  const u = new URL(url);
  let p = decodeURIComponent(u.pathname);
  if (p.endsWith('/')) p += 'index.html';
  return path.join(OUT, p);
}

function extractUrls(text) {
  const urls = new Set();
  // quoted strings that look like paths
  const re = /["'`](\.{0,2}\/[^"'`\s]+|assets\/[^"'`\s]+|bundles\/[^"'`\s]+|[^"'`\s]+\.(?:js|css|html?|json|webmanifest|png|jpe?g|webp|avif|gif|mp3|ogg|wav|m4a|mp4|webm|woff2?|ttf|otf|wasm|data|bin|glb|gltf|zip|unityweb|pck|arsc|svg))[^"'`\s]*["'`]/gi;
  let m;
  while ((m = re.exec(text))) {
    let v = m[1];
    if (/^(https?:|data:|blob:|javascript:|mailto:|#|\/\/)/i.test(v)) {
      if (v.startsWith('//')) v = 'https:' + v;
      else continue;
    }
    try {
      const abs = new URL(v, BASE + '/').href.split('#')[0];
      if (new URL(abs).origin === baseOrigin) urls.add(abs);
    } catch (e) {}
  }
  // also catch import("...") style already covered; catch fetch('/x') patterns
  const re2 = /(?:fetch|import|src|href)\s*\(?\s*["'`]([^"'`]+)["'`]/g;
  while ((m = re2.exec(text))) {
    try {
      const abs = new URL(m[1], BASE + '/').href.split('#')[0];
      if (new URL(abs).origin === baseOrigin) urls.add(abs);
    } catch (e) {}
  }
  return [...urls];
}

async function fetchOne(url) {
  if (seen.has(url)) return;
  seen.add(url);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://poki.com/' }
    });
    if (!res.ok) { failed++; console.log('FAIL', res.status, url); return; }
    const buf = Buffer.from(await res.arrayBuffer());
    totalBytes += buf.length;
    const dest = outPathFor(url);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    downloaded++;
    if (downloaded % 50 === 0) console.log(`... ${downloaded} files, ${(totalBytes/1e6).toFixed(1)}MB`);
    const ext = path.extname(new URL(url).pathname);
    if (TEXT_EXT.test(ext) || (!ext && TEXT_EXT.test(url))) {
      const text = buf.toString('utf8');
      for (const u of extractUrls(text)) if (!seen.has(u)) queue.push(u);
    }
  } catch (e) {
    failed++;
    console.log('ERR', url, e.message);
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  // seed: also grab modulepreload/script/css/img refs from index-orig if present
  const idxPath = path.join(OUT, 'index-orig.html');
  if (fs.existsSync(idxPath)) {
    const t = fs.readFileSync(idxPath, 'utf8');
    for (const u of extractUrls(t)) if (!seen.has(u)) queue.push(u);
  }
  const CONC = 12;
  while (queue.length) {
    const batch = queue.splice(0, CONC);
    await Promise.all(batch.map(fetchOne));
  }
  console.log(`DONE: ${downloaded} files, ${failed} failed, ${(totalBytes/1e6).toFixed(1)}MB -> ${OUT}`);
})();
