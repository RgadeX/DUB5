/* UI Settings - Shared settings across all DUB5 pages */
(function initUISettings() {
  // Toggle for showing/hiding subtitles on all pages
  window.DUB5_UI_SETTINGS = {
    showSubtitles: false
  };

  // Apply subtitle visibility immediately
  function applySubtitleVisibility() {
    const subtitles = document.querySelectorAll('.page-subline, .game-subline');
    subtitles.forEach(subtitle => {
      subtitle.style.display = window.DUB5_UI_SETTINGS.showSubtitles ? '' : 'none';
    });
  }

  // Apply on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySubtitleVisibility);
  } else {
    applySubtitleVisibility();
  }

  // Make toggle function available globally
  window.toggleSubtitles = function() {
    window.DUB5_UI_SETTINGS.showSubtitles = !window.DUB5_UI_SETTINGS.showSubtitles;
    applySubtitleVisibility();
    return window.DUB5_UI_SETTINGS.showSubtitles;
  };
})();
