// HUD - score, label, pause overlay, game-over overlay
export class GameHUD {
  constructor(container) {
    this.container = container;
    this.elements = {};
    this.currentScore = 0;
    this.currentLabel = '';
    this.overlayActive = false;
    
    this.createElements();
  }

  createElements() {
    this.elements.hud = document.createElement('div');
    this.elements.hud.className = 'game-hud';
    
    this.elements.scoreDisplay = document.createElement('div');
    this.elements.scoreDisplay.className = 'hud-score';
    this.elements.scoreDisplay.textContent = '0';
    this.elements.scoreDisplay.setAttribute('aria-live', 'polite');
    
    this.elements.labelDisplay = document.createElement('div');
    this.elements.labelDisplay.className = 'hud-label';
    this.elements.labelDisplay.textContent = '';
    
    this.elements.hud.appendChild(this.elements.scoreDisplay);
    this.elements.hud.appendChild(this.elements.labelDisplay);
    
    this.elements.overlay = document.createElement('div');
    this.elements.overlay.className = 'game-overlay';
    
    this.elements.overlayPanel = document.createElement('div');
    this.elements.overlayPanel.className = 'overlay-panel';
    
    this.elements.overlayTitle = document.createElement('h2');
    this.elements.overlayTitle.className = 'overlay-title';
    
    this.elements.overlayBody = document.createElement('p');
    this.elements.overlayBody.className = 'overlay-body';
    
    this.elements.overlayActions = document.createElement('div');
    this.elements.overlayActions.className = 'overlay-actions';
    
    this.elements.overlayPanel.appendChild(this.elements.overlayTitle);
    this.elements.overlayPanel.appendChild(this.elements.overlayBody);
    this.elements.overlayPanel.appendChild(this.elements.overlayActions);
    this.elements.overlay.appendChild(this.elements.overlayPanel);
    
    this.container.appendChild(this.elements.hud);
    this.container.appendChild(this.elements.overlay);
  }

  // Set score
  setScore(score) {
    this.currentScore = score;
    this.elements.scoreDisplay.textContent = score.toString();
  }

  // Get current score
  getScore() {
    return this.currentScore;
  }

  // Add to score
  addScore(delta) {
    this.setScore(this.currentScore + delta);
  }

  // Set label
  setLabel(text) {
    this.currentLabel = text;
    this.elements.labelDisplay.textContent = text;
  }

  // Get current label
  getLabel() {
    return this.currentLabel;
  }

  // Show overlay
  overlay({ title, body, actions = [] }) {
    this.elements.overlayTitle.textContent = title;
    this.elements.overlayBody.textContent = body;
    
    // Clear existing actions
    this.elements.overlayActions.innerHTML = '';
    
    // Add new actions
    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'game-btn' + (action.primary ? ' primary' : '');
      button.textContent = action.label;
      button.setAttribute('aria-label', action.ariaLabel || action.label);
      
      button.addEventListener('click', () => {
        if (action.callback) {
          action.callback();
        }
      });
      
      this.elements.overlayActions.appendChild(button);
    });
    
    this.elements.overlay.classList.add('active');
    this.overlayActive = true;
  }

  // Hide overlay
  hideOverlay() {
    this.elements.overlay.classList.remove('active');
    this.overlayActive = false;
  }

  // Show pause overlay
  showPause() {
    this.overlay({
      title: 'Gepauzeerd',
      body: 'Druk op ESC of klik op Doorgaan om verder te gaan.',
      actions: [
        {
          label: 'Doorgaan',
          primary: true,
          callback: () => this.hideOverlay()
        },
        {
          label: 'Afsluiten',
          callback: () => {
            this.hideOverlay();
            if (this.onExit) {
              this.onExit();
            }
          }
        }
      ]
    });
  }

  // Show game over overlay
  showGameOver(finalScore) {
    this.overlay({
      title: 'Game Over',
      body: `Je score: ${finalScore}`,
      actions: [
        {
          label: 'Opnieuw spelen',
          primary: true,
          callback: () => {
            this.hideOverlay();
            if (this.onRestart) {
              this.onRestart();
            }
          }
        },
        {
          label: 'Afsluiten',
          callback: () => {
            this.hideOverlay();
            if (this.onExit) {
              this.onExit();
            }
          }
        }
      ]
    });
  }

  // Set exit callback
  onExit(callback) {
    this.onExit = callback;
  }

  // Set restart callback
  onRestart(callback) {
    this.onRestart = callback;
  }

  // Check if overlay is active
  isOverlayActive() {
    return this.overlayActive;
  }

  // Clear HUD
  clear() {
    this.setScore(0);
    this.setLabel('');
    this.hideOverlay();
  }

  // Cleanup
  destroy() {
    if (this.elements.hud && this.elements.hud.parentNode) {
      this.elements.hud.parentNode.removeChild(this.elements.hud);
    }
    
    if (this.elements.overlay && this.elements.overlay.parentNode) {
      this.elements.overlay.parentNode.removeChild(this.elements.overlay);
    }
    
    this.elements = {};
    this.currentScore = 0;
    this.currentLabel = '';
    this.overlayActive = false;
    this.onExit = null;
    this.onRestart = null;
  }
}
