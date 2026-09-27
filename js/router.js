// Simple client-side router for DUB5
const Router = {
  routes: {},
  
  register(path, handler) {
    this.routes[path] = handler;
  },
  
  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  },
  
  handleRoute() {
    const path = window.location.pathname;
    const handler = this.routes[path] || this.routes['/'];
    
    if (handler) {
      handler();
    } else {
      // Check if it's a game route
      const gameMatch = path.match(/^\/([^\/]+)$/);
      if (gameMatch) {
        const gameId = gameMatch[1];
        this.loadGame(gameId);
      } else {
        this.loadHome();
      }
    }
  },
  
  loadHome() {
    // Hide game container, show main content
    const gameContainer = document.getElementById('game-container');
    const mainContent = document.querySelector('main');
    
    if (gameContainer) gameContainer.classList.remove('active');
    if (mainContent) mainContent.style.display = 'block';
  },
  
  loadGame(gameId) {
    // Hide main content, show game container
    const gameContainer = document.getElementById('game-container');
    const mainContent = document.querySelector('main');
    
    if (mainContent) mainContent.style.display = 'none';
    if (gameContainer) gameContainer.classList.add('active');
    
    // Load the game
    import(`./games/${gameId}/index.js`)
      .then(module => {
        const { GameHost } = await import('../engine/game-host.js');
        const host = new GameHost(gameContainer, gameId);
        host.mount(module.default, 800, 600);
      })
      .catch(err => {
        console.error('Failed to load game:', err);
        this.navigate('/');
      });
  },
  
  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    this.handleRoute();
  }
};

// Initialize router
Router.init();

// Export for use in other modules
export default Router;
