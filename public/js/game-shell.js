/* =========================================================
   GAME SHELL - Shared functionality for all original game pages
   ========================================================= */

// Fullscreen functionality
(function initFullscreen() {
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const gameShell = document.querySelector('.game-shell');

  if (fullscreenBtn && gameShell) {
    fullscreenBtn.addEventListener('click', function () {
      if (!document.fullscreenElement) {
        gameShell.requestFullscreen().catch(function (err) {
          console.log('Fullscreen error:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }
})();

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function (error) {
      console.log('Service Worker registration failed:', error);
    });
  });
}

