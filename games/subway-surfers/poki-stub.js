// Minimal PokiSDK stub — the game was built for Poki but we host it ourselves.
// Implements every method the bundle calls, with no network access.
(function () {
  'use strict';
  function noop() {}
  const base = {
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
    measure: noop,
    displayAd: function () { return Promise.resolve(false); },
    requestAd: function () { return Promise.resolve(false); },
    destroy: noop
  };
  // Catch-all: any method the bundle calls that we didn't define resolves
  // successfully instead of throwing.
  window.PokiSDK = new Proxy(base, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === 'string') {
        return function () { return Promise.resolve(); };
      }
      return undefined;
    }
  });
})();
