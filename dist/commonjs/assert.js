/**
 * Simple Assertion function
 * @param  {anything} test    Anything that will evaluate to true of false.
 * @param  {string} message The error message to send if `test` is false
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function kotoAssert(test, message) {
  if (test) {
    return;
  }
  throw new Error("[koto] " + message);
}

exports["default"] = kotoAssert;
module.exports = exports["default"];
//# sourceMappingURL=assert.js.map