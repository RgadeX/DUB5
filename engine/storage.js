// Namespaced localStorage with error handling and LRU eviction
export class GameStorage {
  constructor(gameId) {
    this.gameId = gameId;
    this.prefix = `dub5:${gameId}:`;
    this.lruKey = 'dub5:lru';
    this.maxKeys = 50; // Maximum keys per game
  }

  // Get value with fallback
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(this.prefix + key);
      if (value === null) return fallback;
      
      // Update LRU
      this.updateLRU(key);
      
      return JSON.parse(value);
    } catch (e) {
      // Safari private mode or quota exceeded
      return fallback;
    }
  }

  // Set value
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      
      // Update LRU
      this.updateLRU(key);
      
      // Check if we need to evict
      this.evictIfNeeded();
      
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // Try to evict and retry
        if (this.evictLRU()) {
          try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            this.updateLRU(key);
            return true;
          } catch (retryError) {
            return false;
          }
        }
      }
      return false;
    }
  }

  // Remove value
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      this.removeFromLRU(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Clear all game data
  clear() {
    try {
      const keys = this.getGameKeys();
      for (const key of keys) {
        localStorage.removeItem(this.prefix + key);
      }
      this.clearLRU();
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get all keys for this game
  getGameKeys() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
      return keys;
    } catch (e) {
      return [];
    }
  }

  // LRU tracking
  getLRU() {
    try {
      const data = localStorage.getItem(this.lruKey);
      if (!data) return {};
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }

  setLRU(lru) {
    try {
      localStorage.setItem(this.lruKey, JSON.stringify(lru));
      return true;
    } catch (e) {
      return false;
    }
  }

  updateLRU(key) {
    const lru = this.getLRU();
    const fullKey = this.prefix + key;
    lru[fullKey] = Date.now();
    this.setLRU(lru);
  }

  removeFromLRU(key) {
    const lru = this.getLRU();
    const fullKey = this.prefix + key;
    delete lru[fullKey];
    this.setLRU(lru);
  }

  clearLRU() {
    const lru = this.getLRU();
    for (const key of Object.keys(lru)) {
      if (key.startsWith(this.prefix)) {
        delete lru[key];
      }
    }
    this.setLRU(lru);
  }

  // Evict least recently used key
  evictLRU() {
    const lru = this.getLRU();
    const gameKeys = Object.keys(lru).filter(key => key.startsWith(this.prefix));
    
    if (gameKeys.length === 0) return false;
    
    // Find oldest key
    let oldestKey = null;
    let oldestTime = Infinity;
    
    for (const key of gameKeys) {
      if (lru[key] < oldestTime) {
        oldestTime = lru[key];
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      try {
        localStorage.removeItem(oldestKey);
        delete lru[oldestKey];
        this.setLRU(lru);
        return true;
      } catch (e) {
        return false;
      }
    }
    
    return false;
  }

  // Check if we need to evict
  evictIfNeeded() {
    const keys = this.getGameKeys();
    if (keys.length >= this.maxKeys) {
      this.evictLRU();
    }
  }
}
