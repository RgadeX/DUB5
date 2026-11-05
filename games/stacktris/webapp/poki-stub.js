// Minimal PokiSDK stub — the game was built for Poki but we host it ourselves.
// Implements every method source_min.js/index.js call, with no network access.
(function () {
  'use strict';
  window.PokiSDK = {
    init: function () { return Promise.resolve(); },
    initWithVideoHB: function () { return Promise.resolve(); },
    gameLoadingStart: function () {},
    gameLoadingFinished: function () {},
    gameplayStart: function () {},
    gameplayStop: function () {},
    commercialBreak: function () { return Promise.resolve(); },
    rewardedBreak: function () { return Promise.resolve(false); },
    happyTime: function () { return Promise.resolve(); },
    customEvent: function () {},
    destroy: function () {},
    setDebug: function () {},
    gameEvent: function () {},
    roundEnd: function () {},
    displayAd: function () { return Promise.resolve(false); },
    requestAd: function () { return Promise.resolve(false); }
  };
})();
