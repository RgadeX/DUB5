// Stub for the GameAnalytics SDK — the game was built with analytics,
// but we host it ourselves: all calls are no-ops, nothing is sent anywhere.
(function () {
  'use strict';
  var noop = function () {};
  window.GameAnalytics = {
    initialize: noop,
    startSession: noop,
    endSession: noop,
    addDesignEvent: noop,
    addBusinessEvent: noop,
    addProgressionEvent: noop,
    addResourceEvent: noop,
    addErrorEvent: noop,
    addRemoteConfigsListener: noop,
    configureAvailableCustomDimensions: noop,
    configureAvailableResourceCurrencies: noop,
    configureAvailableResourceItemTypes: noop,
    configureBuild: noop,
    configureGameEngineVersion: noop,
    configureSdkGameEngineVersion: noop,
    configureUserId: noop,
    getRemoteConfigsContentAsString: function () { return ''; },
    getRemoteConfigsValueAsString: function () { return ''; },
    isRemoteConfigsReady: function () { return false; },
    setCustomDimension: noop,
    setEnabledEventSubmission: noop,
    setEnabledInfoLog: noop,
    setEnabledManualSessionHandling: noop,
    setEnabledVerboseLog: noop
  };
})();
