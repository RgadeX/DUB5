// Canvas handling - DPR scaling, resize observer, letterbox
export class GameCanvas {
  constructor(container, logicalWidth, logicalHeight) {
    this.container = container;
    this.logicalWidth = logicalWidth;
    this.logicalHeight = logicalHeight;
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.dpr = window.devicePixelRatio || 1;
    this.letterbox = { top: 0, left: 0, right: 0, bottom: 0 };
    
    this.setupCanvas();
    this.setupResizeObserver();
  }

  setupCanvas() {
    this.container.appendChild(this.canvas);
    this.resize();
  }

  resize() {
    const containerRect = this.container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Calculate scale to fit logical dimensions into container
    const scaleX = containerWidth / this.logicalWidth;
    const scaleY = containerHeight / this.logicalHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate actual canvas size (maintain aspect ratio)
    const canvasWidth = this.logicalWidth * scale;
    const canvasHeight = this.logicalHeight * scale;
    
    // Calculate letterbox
    this.letterbox.left = (containerWidth - canvasWidth) / 2;
    this.letterbox.top = (containerHeight - canvasHeight) / 2;
    this.letterbox.right = this.letterbox.left;
    this.letterbox.bottom = this.letterbox.top;
    
    // Set canvas CSS size
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;
    this.canvas.style.marginLeft = `${this.letterbox.left}px`;
    this.canvas.style.marginTop = `${this.letterbox.top}px`;
    
    // Set canvas actual size (DPR-scaled)
    this.canvas.width = canvasWidth * this.dpr;
    this.canvas.height = canvasHeight * this.dpr;
    
    // Scale context
    this.ctx.scale(this.dpr * scale, this.dpr * scale);
    
    // Store scale for game logic
    this.scale = scale;
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    
    this.resizeObserver.observe(this.container);
  }

  // Get logical dimensions
  get width() {
    return this.logicalWidth;
  }

  get height() {
    return this.logicalHeight;
  }

  // Get context
  getContext() {
    return this.ctx;
  }

  // Get letterbox info
  getLetterbox() {
    return { ...this.letterbox };
  }

  // Convert screen coordinates to logical coordinates
  screenToLogical(screenX, screenY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (screenX - rect.left) / this.scale;
    const y = (screenY - rect.top) / this.scale;
    return { x, y };
  }

  // Clear canvas
  clear() {
    this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
  }

  // Cleanup
  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
