// Game host - mounts modules, handles lifecycle, visibility pause, Escape → exit
import { GameLoop } from './loop.js';
import { InputHandler } from './input.js';
import { GameCanvas } from './canvas.js';
import { GameStorage } from './storage.js';
import { GameAudio } from './audio.js';
import { GameRNG } from './rng.js';
import { GameHUD } from './hud.js';

export class GameHost {
  constructor(container, gameId) {
    this.container = container;
    this.gameId = gameId;
    this.currentGame = null;
    this.gameInstance = null;
    
    // Engine components
    this.loop = new GameLoop();
    this.input = new InputHandler();
    this.canvas = null;
    this.storage = new GameStorage(gameId);
    this.audio = new GameAudio();
    this.rng = new GameRNG();
    this.hud = new GameHUD(container);
    
    // State
    this.isMounted = false;
    this.isPaused = false;
    
    this.setupExitHandler();
    this.setupVisibilityHandler();
  }

  // Mount a game module
  async mount(gameModule, logicalWidth = 800, logicalHeight = 600) {
    if (this.isMounted) {
      await this.unmount();
    }
    
    this.currentGame = gameModule;
    
    // Create canvas
    this.canvas = new GameCanvas(this.container, logicalWidth, logicalHeight);
    
    // Build context object
    const ctx = {
      canvas: this.canvas,
      input: this.input,
      audio: this.audio,
      storage: this.storage,
      hud: this.hud,
      loop: this.loop,
      rng: this.rng,
      exit: () => this.exit()
    };
    
    // Mount game
    try {
      this.gameInstance = await gameModule.mount(this.container, ctx);
      this.isMounted = true;
      
      // Setup HUD callbacks
      this.hud.onExit(() => this.exit());
      this.hud.onRestart(() => this.restart());
      
      return this.gameInstance;
    } catch (e) {
      console.error('Failed to mount game:', e);
      this.cleanup();
      throw e;
    }
  }

  // Unmount current game
  async unmount() {
    if (!this.isMounted || !this.gameInstance) return;
    
    // Stop loop
    this.loop.stop();
    
    // Destroy game instance
    if (this.gameInstance.destroy) {
      try {
        await this.gameInstance.destroy();
      } catch (e) {
        console.error('Error destroying game instance:', e);
      }
    }
    
    // Cleanup
    this.cleanup();
    
    this.isMounted = false;
    this.gameInstance = null;
    this.currentGame = null;
  }

  // Cleanup engine components
  cleanup() {
    if (this.canvas) {
      this.canvas.destroy();
      this.canvas = null;
    }
    
    this.input.destroy();
    this.hud.destroy();
    this.audio.destroy();
  }

  // Exit game
  exit() {
    if (this.exitCallback) {
      this.exitCallback();
    }
  }

  // Restart game
  async restart() {
    if (!this.currentGame) return;
    
    await this.unmount();
    await this.mount(this.currentGame);
  }

  // Pause game
  pause() {
    if (!this.isMounted) return;
    
    this.isPaused = true;
    this.loop.pause();
    
    if (this.gameInstance && this.gameInstance.pause) {
      this.gameInstance.pause();
    }
    
    this.hud.showPause();
  }

  // Resume game
  resume() {
    if (!this.isMounted) return;
    
    this.isPaused = false;
    this.hud.hideOverlay();
    
    if (this.gameInstance && this.gameInstance.resume) {
      this.gameInstance.resume();
    }
    
    this.loop.resume();
  }

  // Setup exit handler (Escape key)
  setupExitHandler() {
    this.input.on('Escape', () => {
      if (this.isMounted) {
        if (this.isPaused) {
          this.resume();
        } else {
          this.pause();
        }
      }
    });
  }

  // Setup visibility handler (pause on tab blur)
  setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isMounted && !this.isPaused) {
        this.pause();
      }
    });
  }

  // Set exit callback
  onExit(callback) {
    this.exitCallback = callback;
  }

  // Check if game is mounted
  isGameMounted() {
    return this.isMounted;
  }

  // Check if game is paused
  isGamePaused() {
    return this.isPaused;
  }

  // Get current game instance
  getGameInstance() {
    return this.gameInstance;
  }
}
