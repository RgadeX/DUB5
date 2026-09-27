# DUB5 — Offline-First Game Portal

Een Progressive Web App (PWA) die een curatie set van HTML5 games, tools en studiemateriaal host. Na het eerste beurt draait de volledige ervaring — inclusief elke game — vanaf de lokale cache van het apparaat.

## 🚀 Lokale Ontwikkeling

### Benodigdheden
- Node.js (of een statische server)
- Modern browser (Chrome 90+, Firefox 90+, Safari 15+)

### Starten

**Optie 1: Met Node.js (aanbevolen)**
```bash
# Install dependencies
npm install

# Start development server op port 3000
npm start
```

**Optie 2: Met Python**
```bash
python -m http.server 3000
```

**Optie 3: Met PHP**
```bash
php -S localhost:3000
```

Open dan http://localhost:3000 in je browser.

## 📱 Deployen naar Vercel

### 1. GitHub Setup

```bash
# Initialiseren van git repository
git init
git add .
git commit -m "Initial commit"

# GitHub repository aanmaken en pushen
git remote add origin https://github.com/your-username/dub5.git
git branch -M main
git push -u origin main
```

### 2. Vercel Deployment

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deployen
vercel
```

**Via Vercel Dashboard:**
1. Ga naar [vercel.com](https://vercel.com)
2. Klik "New Project"
3. Import je GitHub repository
4. Vercel detecteert automatisch dat het een statische site is
5. Klik "Deploy"

### 3. Vercel Configuratie

Het project bevat al een `vercel.json` bestand met:
- Service worker headers (belangrijk voor updates)
- Security headers
- Correcte routing voor SPA

## 📋 Project Structuur

```
/
├── index.html              # Hoofd pagina
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service worker
├── offline.html            # Offline fallback pagina
├── vercel.json             # Vercel configuratie
├── package.json            # NPM scripts
├── css/                    # Stylesheets
│   ├── tokens.css          # Design tokens
│   ├── base.css            # Reset & body
│   ├── shell.css           # Topbar, container, footer
│   ├── cards.css           # Nav cards, badges
│   └── game.css            # Game HUD chrome
├── js/                     # Core JavaScript
│   ├── app.js              # Bootstrap & router
│   ├── registry.js         # Game manifest
│   ├── starfield.js        # Canvas background
│   ├── intro.js            # Load animation
│   ├── sw-register.js      # Service worker registratie
│   ├── offline-manager.js  # Bulk offline download
│   └── build-hash.js       # Cache versioning
├── engine/                 # Game engine
│   ├── loop.js             # Fixed-timestep loop
│   ├── input.js            # Input handling
│   ├── canvas.js           # Canvas management
│   ├── storage.js          # Namespaced storage
│   ├── audio.js            # WebAudio synth
│   ├── rng.js              # Seeded PRNG
│   ├── hud.js              # Score & overlays
│   └── game-host.js        # Game lifecycle
├── games/                  # Game modules
│   └── snake/
│       └── index.js         # Snake game
└── assets/                 # Statische assets
    ├── icons/              # PWA icons
    └── fonts/              # Self-hosted fonts
```

## 🎮 Features

### Offline-First
- **Service Worker**: Cache strategieën voor verschillende soorten content
- **Bulk Download**: "Alles offline opslaan" knop voor volledige offline toegang
- **Graceful Degradation**: Offline fallback pagina

### Game Engine
- **Fixed-timestep loop**: Consistente gameplay op alle apparaten
- **Input handling**: Keyboard, touch, en gamepad support
- **Canvas management**: DPR scaling en letterboxing
- **Audio systeem**: WebAudio synth (geen externe bestanden)
- **Storage**: Namespaced localStorage met LRU eviction

### PWA Features
- **Installable**: Kan geïnstalleerd worden als app
- **Theme Colors**: Aangepaste browser chrome
- **Responsive**: Werkt op desktop, tablet, en mobiel
- **Fast**: < 60KB app shell, < 40KB per game

## 🏫 School WiFi Compatibiliteit

DUB5 is speciaal ontworpen om te werken op school WiFi netwerken die games blokkeren:

1. **Geen externe afhankelijkheden**: Alles wordt lokaal geserveerd
2. **Volledige offline modus**: Na één keer downloaden werkt alles zonder internet
3. **Geen CDN calls**: Geen requests naar cdn.jsdelivr.net, fonts.googleapis.com, etc.
4. **Lokaal gehoste fonts**: DM Serif Display wordt lokaal geserveerd
5. **Service Worker caching**: Alle content wordt lokaal opgeslagen

### Installatie voor Schoolgebruik

Voor gebruik op school moeten studenten:

1. De pagina **thuis of op mobiele data** openen
2. Tik op **"Alles offline opslaan"**
3. Tik op **"Installeren"** in de adresbalk
4. Open het app-icoon op school — alles werkt zonder internet

## 🔧 Ontwikkeling

### Nieuwe Game Toevoegen

1. Maak een nieuwe map in `games/your-game/`
2. Maak `index.js` met game implementatie
3. Voeg toe aan `js/registry.js`
4. Update service worker cache lijst indien nodig

### Game Contract

Elke game moet exporteren:
```js
export default {
  id: 'game-id',
  title: 'Game Title',
  description: 'Game description',
  category: 'games',
  icon: 'icon-name',
  tags: ['arcade', 'keyboard'],
  minPlayers: 1,
  
  async mount(root, ctx) {
    // ctx bevat: canvas, input, audio, storage, hud, loop, rng, exit
    // Return { destroy(), pause(), resume() }
  }
};
```

## 🧪 Testing

### Offline Testing
1. Open DevTools → Network
2. Zet op "Offline"
3. Refresh de pagina
4. Alles moet blijven werken

### PWA Testing
1. Open DevTools → Application
2. Check "Service Workers" is geregistreerd
3. Check "Manifest" is geldig
4. Test installatie prompt

### Lighthouse Audit
```bash
# Install Lighthouse CLI
npm i -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

Doelstellingen:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- PWA: Installable

## 📊 Performance Budgets

| Metric | Budget |
|--------|--------|
| App shell (gzipped) | ≤ 60 KB |
| Single game (gzipped) | ≤ 40 KB |
| Total precache | ≤ 300 KB |
| Time to interactive | ≤ 1.5 s |
| Frame budget | 16.6 ms (60 FPS) |

## 🔐 Security

- **CSP Friendly**: Geen `eval()`, geen remote script injection
- **No Secrets**: Geen API keys of tokens in de code
- **HTTPS Only**: Service workers vereisen HTTPS of localhost
- **Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection

## 🐛 Probleemoplossing

### Service Worker werkt niet
- Zorg dat je over HTTPS of localhost draait
- Check browser console voor errors
- Verwijder oude caches in DevTools

### Game laadt niet
- Check console voor import errors
- Verifieer dat game module correct exporteert
- Test network tab voor failed requests

### Offline modus werkt niet
- Controleer dat service worker is geregistreerd
- Test met DevTools Network tab op "Offline"
- Check cache storage in DevTools

## 📝 License

© 2026 DUB5. Alle rechten voorbehouden.

## 🤝 Bijdragen

Bijdragen zijn welkom! Volg deze stappen:
1. Fork de repository
2. Maak een feature branch
3. Commit je changes
4. Push naar de branch
5. Open een Pull Request

## 📞 Support

Voor vragen of problemen:
- Open een issue op GitHub
- Check de FAQ in de app
- Lees de gidsen sectie

---

**Built with ❤️ for students, by students**
