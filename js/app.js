import { registry, getByCategory } from './registry.js';
import { GameHost } from '../engine/game-host.js';
import offlineManager from './offline-manager.js';

// Icon SVGs (inline, no external requests) - matching the new design
const icons = {
  snake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19h9a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8"/><circle cx="18.6" cy="7" r="1.7"/></svg>`,
  calculator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2.5" width="16" height="19" rx="3.5"/><rect x="7.5" y="6" width="9" height="3.5" rx="1.2"/><path d="M8.2 13.5h.01M12 13.5h.01M15.8 13.5h.01M8.2 17.2h.01M12 17.2h.01M15.8 17.2h.01"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3Z"/><circle cx="7.4" cy="11.2" r="1.05" fill="currentColor" stroke="none"/><circle cx="10" cy="7.4" r="1.05" fill="currentColor" stroke="none"/><circle cx="14.6" cy="7.4" r="1.05" fill="currentColor" stroke="none"/></svg>`,
  qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><path d="M14 14h3.2v3.2H14zM20.5 14v2M14.5 20.5h3M20.5 19v2"/></svg>`,
  flashcard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  quiz: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.3 9.3a2.8 2.8 0 0 1 5.4.9c0 1.9-2.7 2.4-2.7 4"/><circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  guide: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z"/><path d="M14 2.5V7.5H19"/><path d="M8.5 12h7M8.5 16h5"/></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.3 9.3a2.8 2.8 0 0 1 5.4.9c0 1.9-2.7 2.4-2.7 4"/><circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`
};

// View state
let currentView = 'all'; // 'all' or 'sections'

// Game host for launching games
let gameHost = null;
let gameContainer = null;

// Categories matching the new design
const CATEGORIES = [
  { id: 'games', label: 'Games' },
  { id: 'tools', label: 'Tools' },
  { id: 'study', label: 'Studie & Leren' },
  { id: 'guides', label: 'Gidsen & Blog' }
];

// Initialize app
function init() {
  renderCards();
  setupTopbar();
  setupKeyboard();
  setupViewSwitch();
}

// Render cards based on current view
function renderCards() {
  const content = document.getElementById('content');
  
  if (currentView === 'all') {
    // Show all items in a single grid
    content.innerHTML = '<div class="nav-grid">' +
      registry.map((item, i) => createCardHTML(item, i)).join('') +
      '</div>';
  } else {
    // Show categorized sections
    content.innerHTML = CATEGORIES.map(cat => {
      const items = getByCategory(cat.id);
      if (!items.length) return '';
      
      return '<section class="cat-section" data-cat="' + cat.id + '" id="' + cat.id + '">' +
        '<div class="section-head">' +
          '<span class="section-pill">' +
            '<span class="section-dot"></span>' +
            '<h3>' + cat.label + '</h3>' +
            '<span class="section-count">' + items.length + '</span>' +
          '</span>' +
        '</div>' +
        '<div class="nav-grid">' +
          items.map((item, i) => createCardHTML(item, i)).join('') +
        '</div>' +
      '</section>';
    }).join('');
  }
  
  bindCardGlow();
}

// Create card HTML matching the new design
function createCardHTML(item, index) {
  const iconSVG = icons[item.icon] || icons.help;
  const badgeHTML = item.isNew ? '<span class="badge">Nieuw</span>' : '';
  
  // For games, add data attribute for click handling
  const isGame = item.category === 'games';
  
  return '<a class="nav-button" data-cat="' + item.category + '" href="#' + item.id + '"' +
    ' style="--i:' + index + '" data-id="' + item.id + '" data-game="' + isGame + '">' +
      '<span class="nav-button-glow"></span>' +
      '<span class="icon-chip">' + iconSVG + '</span>' +
      '<span class="nav-button-title">' + item.title + '</span>' +
      '<span class="nav-button-desc">' + item.description + '</span>' +
      badgeHTML +
      icons.arrow +
    '</a>';
}

// Card glow effect (cursor follow) and game launching
function bindCardGlow() {
  document.querySelectorAll('.nav-button').forEach(button => {
    const glow = button.querySelector('.nav-button-glow');
    if (!glow) return;

    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.background =
        'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.16) 0%, transparent 60%)';
    });

    button.addEventListener('mouseleave', () => {
      glow.style.background = '';
    });

    // Handle game launches
    button.addEventListener('click', (e) => {
      const isGame = button.dataset.game === 'true';
      if (isGame) {
        e.preventDefault();
        const gameId = button.dataset.id;
        launchGame(gameId);
      }
    });
  });
}

// Setup topbar scroll effect
function setupTopbar() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;

  let ticking = false;

  function update() {
    const y = window.scrollY || window.pageYOffset || 0;
    topbar.classList.toggle('is-scrolled', y > 24);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();

  // Setup nav links for smooth scroll + view switch
  const navLinks = document.querySelectorAll('[data-nav]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.dataset.nav;

      if (currentView !== 'sections') setView('sections');

      requestAnimationFrame(() => {
        const el = document.querySelector('.cat-section[data-cat="' + cat + '"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
}

// Setup keyboard navigation
function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    // C key toggles view
    if (e.key !== 'c' && e.key !== 'C') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    setView(currentView === 'all' ? 'sections' : 'all');
  });
}

// Setup view switch (matching new design)
function setupViewSwitch() {
  const viewSwitch = document.getElementById('viewSwitch');
  const switchThumb = document.getElementById('switchThumb');
  
  if (!viewSwitch || !switchThumb) return;

  function positionThumb() {
    const active = viewSwitch.querySelector('button.is-active');
    if (!active) return;

    const wrapRect = viewSwitch.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();

    switchThumb.style.width = btnRect.width + 'px';
    switchThumb.style.transform = 'translateX(' + (btnRect.left - wrapRect.left - 4) + 'px)';
  }

  function setView(view) {
    if (view === currentView) return;

    currentView = view;
    viewSwitch.dataset.active = view;
    
    viewSwitch.querySelectorAll('button').forEach(btn => {
      const active = btn.dataset.view === view;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    renderCards();
    positionThumb();
  }

  viewSwitch.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  window.addEventListener('resize', positionThumb);
  
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(positionThumb);
  }

  // Initial positioning
  requestAnimationFrame(positionThumb);
  
  // Expose setView globally for keyboard handler
  window.setView = setView;
}

// Start app
init();

// Setup offline download functionality
async function setupOfflineDownload() {
  const offlineSection = document.getElementById('offline-section');
  const offlineBtn = document.getElementById('offline-btn');
  
  if (!offlineSection || !offlineBtn) return;
  
  // Check if already completed
  if (offlineManager.wasOfflineDownloadCompleted()) {
    offlineBtn.innerHTML = `
      <span class="icon-chip" style="background: #34d399; color: var(--bg-3);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span class="nav-button-title">Offline beschikbaar</span>
    `;
    offlineBtn.style.pointerEvents = 'none';
  }
  
  // Show the section
  offlineSection.style.display = 'block';
  
  // Handle download click
  offlineBtn.addEventListener('click', async () => {
    if (offlineManager.getProgress().isDownloading) return;
    
    offlineBtn.disabled = true;
    offlineBtn.innerHTML = `
      <span class="icon-chip" style="background: var(--accent-games); color: var(--bg-3);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
          <path d="M12 2v4M12 18v2M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </span>
      <span class="nav-button-title">Bezig met downloaden...</span>
    `;
    
    await offlineManager.cacheAllGames((cached, total) => {
      const progress = Math.round((cached / total) * 100);
      offlineBtn.innerHTML = `
        <span class="icon-chip" style="background: var(--accent-games); color: var(--bg-3);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
            <path d="M12 2v4M12 18v2M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </span>
        <span class="nav-button-title">Offline opslaan · ${cached}/${total}</span>
      `;
    });
    
    offlineBtn.innerHTML = `
      <span class="icon-chip" style="background: #34d399; color: var(--bg-3);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span class="nav-button-title">Offline beschikbaar</span>
    `;
    offlineBtn.style.pointerEvents = 'none';
  });
}

// Add spinning animation
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinStyle);

// Initialize offline download setup
setupOfflineDownload();

// Game launching functionality
async function launchGame(gameId) {
  // Check if game is currently running
  if (gameHost && gameHost.isGameMounted()) {
    await gameHost.unmount();
  }
  
  // Get or create game container
  gameContainer = document.getElementById('game-container');
  if (!gameContainer) {
    gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    document.body.appendChild(gameContainer);
  }
  
  // Show game container
  gameContainer.classList.add('active');
  
  // Initialize game host
  gameHost = new GameHost(gameContainer, gameId);
  
  // Load game module
  try {
    const gameModule = await import(`./games/${gameId}/index.js`);
    await gameHost.mount(gameModule.default, 800, 600);
    
    // Setup exit handler
    gameHost.onExit(() => {
      closeGame();
    });
  } catch (error) {
    console.error('Failed to load game:', error);
    closeGame();
  }
}

function closeGame() {
  if (gameHost) {
    gameHost.unmount();
    gameHost = null;
  }
  
  if (gameContainer) {
    gameContainer.classList.remove('active');
  }
}

// Expose launchGame globally
window.launchGame = launchGame;
