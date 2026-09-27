// Input handling - keyboard, touch, and gamepad
export class InputHandler {
  constructor() {
    this.keyHandlers = new Map();
    this.touchHandlers = new Map();
    this.gamepadIndex = null;
    this.gamepadThreshold = 0.5;
    this.gamepadPollInterval = null;
    
    this.setupKeyboard();
    this.setupTouch();
    this.setupGamepad();
  }

  // Keyboard handling
  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      const handler = this.keyHandlers.get(e.key);
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    });
  }

  on(key, callback) {
    this.keyHandlers.set(key, callback);
  }

  off(key) {
    this.keyHandlers.delete(key);
  }

  clearKeyboard() {
    this.keyHandlers.clear();
  }

  // Touch handling
  setupTouch() {
    this.touchZones = [];
    
    document.addEventListener('touchstart', (e) => {
      for (const touch of e.changedTouches) {
        this.handleTouch(touch.clientX, touch.clientY, 'start');
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      for (const touch of e.changedTouches) {
        this.handleTouch(touch.clientX, touch.clientY, 'move');
      }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      for (const touch of e.changedTouches) {
        this.handleTouch(touch.clientX, touch.clientY, 'end');
      }
    }, { passive: false });
  }

  addTouchZone(x, y, width, height, callback) {
    this.touchZones.push({ x, y, width, height, callback });
  }

  clearTouchZones() {
    this.touchZones = [];
  }

  handleTouch(x, y, type) {
    for (const zone of this.touchZones) {
      if (x >= zone.x && x <= zone.x + zone.width &&
          y >= zone.y && y <= zone.y + zone.height) {
        zone.callback(type, x, y);
      }
    }
  }

  touch() {
    return {
      x: 0,
      y: 0,
      active: false
    };
  }

  // Gamepad handling
  setupGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadIndex = e.gamepad.index;
      this.startGamepadPoll();
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      if (e.gamepad.index === this.gamepadIndex) {
        this.gamepadIndex = null;
        this.stopGamepadPoll();
      }
    });
  }

  startGamepadPoll() {
    if (this.gamepadPollInterval) return;
    
    this.gamepadPollInterval = setInterval(() => {
      this.pollGamepad();
    }, 16); // ~60 FPS
  }

  stopGamepadPoll() {
    if (this.gamepadPollInterval) {
      clearInterval(this.gamepadPollInterval);
      this.gamepadPollInterval = null;
    }
  }

  pollGamepad() {
    if (this.gamepadIndex === null) return;
    
    const gamepad = navigator.getGamepads()[this.gamepadIndex];
    if (!gamepad) return;

    // Handle buttons
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const button = gamepad.buttons[i];
      if (button.pressed) {
        const handler = this.keyHandlers.get(`gamepad:${i}`);
        if (handler) {
          handler({ type: 'gamepad', button: i });
        }
      }
    }

    // Handle axes (for movement)
    const axisHandler = this.keyHandlers.get('gamepad:axis');
    if (axisHandler) {
      axisHandler({
        leftX: gamepad.axes[0],
        leftY: gamepad.axes[1],
        rightX: gamepad.axes[2],
        rightY: gamepad.axes[3]
      });
    }
  }

  axis() {
    if (this.gamepadIndex === null) {
      return { leftX: 0, leftY: 0, rightX: 0, rightY: 0 };
    }
    
    const gamepad = navigator.getGamepads()[this.gamepadIndex];
    if (!gamepad) {
      return { leftX: 0, leftY: 0, rightX: 0, rightY: 0 };
    }

    return {
      leftX: gamepad.axes[0],
      leftY: gamepad.axes[1],
      rightX: gamepad.axes[2],
      rightY: gamepad.axes[3]
    };
  }

  // Cleanup
  destroy() {
    this.clearKeyboard();
    this.clearTouchZones();
    this.stopGamepadPoll();
  }
}
