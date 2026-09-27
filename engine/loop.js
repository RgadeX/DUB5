// Fixed-timestep game loop with requestAnimationFrame
export class GameLoop {
  constructor() {
    this.callback = null;
    this.running = false;
    this.paused = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDelta = 1000 / 60; // 60 FPS fixed timestep
    this.maxDelta = 100; // Prevent spiral of death
    this.rafId = null;
  }

  start(callback) {
    if (this.running) return;
    
    this.callback = callback;
    this.running = true;
    this.paused = false;
    this.lastTime = performance.now();
    this.accumulator = 0;
    
    this.rafId = requestAnimationFrame((time) => this.tick(time));
  }

  stop() {
    this.running = false;
    this.paused = false;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    this.callback = null;
  }

  pause() {
    if (!this.running) return;
    this.paused = true;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (!this.running || !this.paused) return;
    this.paused = false;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.rafId = requestAnimationFrame((time) => this.tick(time));
  }

  tick(currentTime) {
    if (!this.running || this.paused) return;

    let frameDelta = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap delta to prevent spiral of death
    if (frameDelta > this.maxDelta) {
      frameDelta = this.maxDelta;
    }

    this.accumulator += frameDelta;

    // Fixed timestep update
    while (this.accumulator >= this.fixedDelta) {
      if (this.callback) {
        this.callback(this.fixedDelta);
      }
      this.accumulator -= this.fixedDelta;
    }

    // Schedule next frame
    this.rafId = requestAnimationFrame((time) => this.tick(time));
  }

  isRunning() {
    return this.running;
  }

  isPaused() {
    return this.paused;
  }
}
