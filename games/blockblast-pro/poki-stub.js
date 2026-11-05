// Minimal PokiSDK stub — the game was built for Poki but we host it ourselves.
// Implements every method the bundle calls, with no network access.
(function () {
  'use strict';
  function noop() {}
  window.PokiSDK = {
    init: function () { return Promise.resolve(); },
    initWithVideoHB: function () { return Promise.resolve(); },
    gameLoadingStart: noop,
    gameLoadingProgress: noop,
    gameLoadingFinished: noop,
    gameLoadingStop: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    commercialBreak: function () { return Promise.resolve(); },
    rewardedBreak: function () { return Promise.resolve(false); },
    happyTime: function () { return Promise.resolve(); },
    customEvent: noop,
    gameEvent: noop,
    roundEnd: noop,
    captureError: noop,
    setDebug: noop,
    getURLParam: function () { return null; },
    shareableURL: function () { return Promise.resolve(window.location.href); },
    displayAd: function () { return Promise.resolve(false); },
    requestAd: function () { return Promise.resolve(false); },
    destroy: noop
  };
})();
