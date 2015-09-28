System.register([], function (_export) {
  /**
   * Simple Assertion function
   * @param  {anything} test    Anything that will evaluate to true of false.
   * @param  {string} message The error message to send if `test` is false
   */
  "use strict";

  function kotoAssert(test, message) {
    if (test) {
      return;
    }
    throw new Error("[koto] " + message);
  }

  return {
    setters: [],
    execute: function () {
      _export("default", kotoAssert);
    }
  };
});
//# sourceMappingURL=assert.js.map