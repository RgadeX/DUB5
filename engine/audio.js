// WebAudio synth - no external audio files
export class GameAudio {
  constructor() {
    this.audioContext = null;
    this.muted = false;
    this.masterGain = null;
    this.initialized = false;
  }

  // Initialize audio context (must be called after user gesture)
  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.muted ? 0 : 0.3;
      this.initialized = true;
    } catch (e) {
      console.warn('WebAudio not supported:', e);
    }
  }

  // Ensure audio context is initialized
  ensureInitialized() {
    if (!this.initialized) {
      this.init();
    }
    
    // Resume if suspended (browser policy)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Simple beep tone
  beep(frequency = 440, duration = 100, type = 'sine') {
    if (this.muted) return;
    
    this.ensureInitialized();
    
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.warn('Beep failed:', e);
    }
  }

  // White noise burst
  noise(duration = 100) {
    if (this.muted) return;
    
    this.ensureInitialized();
    
    if (!this.audioContext) return;
    
    try {
      const bufferSize = this.audioContext.sampleRate * duration / 1000;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      noise.buffer = buffer;
      
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      noise.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      noise.start(this.audioContext.currentTime);
    } catch (e) {
      console.warn('Noise failed:', e);
    }
  }

  // Play a sequence of tones
  playSequence(notes, tempo = 200) {
    if (this.muted) return;
    
    this.ensureInitialized();
    
    if (!this.audioContext) return;
    
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.beep(note.freq, note.dur || tempo, note.type || 'sine');
      }, index * tempo);
    });
  }

  // Set muted state
  setMuted(muted) {
    this.muted = muted;
    
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        muted ? 0 : 0.3,
        this.audioContext.currentTime
      );
    }
  }

  // Toggle mute
  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // Get current mute state
  isMuted() {
    return this.muted;
  }

  // Cleanup
  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.initialized = false;
  }
}
