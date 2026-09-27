// Offline Manager - Handles bulk offline download and caching
export class OfflineManager {
  constructor() {
    this.isDownloading = false;
    this.progress = 0;
    this.totalGames = 0;
    this.cachedGames = 0;
  }

  // Get all game URLs from registry
  getGameUrls() {
    // This would be expanded to dynamically get all game URLs
    return [
      '/games/snake/index.js',
      // Add more games as they are implemented
    ];
  }

  // Check if all games are cached
  async isFullyCached() {
    try {
      const cache = await caches.open('dub5-v1.0.0.001');
      const gameUrls = this.getGameUrls();
      
      for (const url of gameUrls) {
        const cached = await cache.match(url);
        if (!cached) return false;
      }
      
      return true;
    } catch (e) {
      console.error('Error checking cache:', e);
      return false;
    }
  }

  // Cache all games with concurrency limit
  async cacheAllGames(onProgress) {
    if (this.isDownloading) return;
    
    this.isDownloading = true;
    const gameUrls = this.getGameUrls();
    this.totalGames = gameUrls.length;
    this.cachedGames = 0;
    
    const CONCURRENCY_LIMIT = 4;
    const cache = await caches.open('dub5-v1.0.0.001');
    
    // Process games in batches
    for (let i = 0; i < gameUrls.length; i += CONCURRENCY_LIMIT) {
      const batch = gameUrls.slice(i, i + CONCURRENCY_LIMIT);
      
      await Promise.all(batch.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            this.cachedGames++;
            if (onProgress) {
              onProgress(this.cachedGames, this.totalGames);
            }
          }
        } catch (e) {
          console.error('Failed to cache:', url, e);
        }
      }));
    }
    
    this.isDownloading = false;
    
    // Request persistent storage
    if (navigator.storage?.persist) {
      try {
        await navigator.storage.persist();
      } catch (e) {
        console.error('Failed to request persistent storage:', e);
      }
    }
    
    // Save completion flag
    try {
      localStorage.setItem('dub5:offline:complete', '1');
      localStorage.setItem('dub5:offline:version', '1');
    } catch (e) {
      console.error('Failed to save offline flag:', e);
    }
  }

  // Get download progress
  getProgress() {
    return {
      isDownloading: this.isDownloading,
      progress: this.totalGames > 0 ? (this.cachedGames / this.totalGames) * 100 : 0,
      cached: this.cachedGames,
      total: this.totalGames
    };
  }

  // Check if offline download was completed
  wasOfflineDownloadCompleted() {
    try {
      return localStorage.getItem('dub5:offline:complete') === '1';
    } catch (e) {
      return false;
    }
  }
}

// Create global instance
const offlineManager = new OfflineManager();
export default offlineManager;
