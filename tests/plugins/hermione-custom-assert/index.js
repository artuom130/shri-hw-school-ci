const assert = require('assert');

module.exports = (hermione, opts) => {
  hermione.on(hermione.events.NEW_BROWSER, (browser) => {
    browser.addCommand('assertExist', (selector, msg) => {
      return browser.isExisting(selector).then((v) => assert.ok(v, msg));
    });
    browser.addCommand('assertNotExist', (selector, msg) => {
      return browser.isExisting(selector).then((v) => assert.strictEqual(v, false, msg));
    });
    browser.addCommand('assertEnabled', (selector, msg) => {
      return browser.isEnabled(selector).then((v) => assert.ok(v, msg));
    });
    browser.addCommand('assertDisabled', (selector, msg) => {
      return browser.isEnabled(selector).then((v) => assert.strictEqual(v, false, msg));
    });
    browser.addCommand('assertText', (selector, text, msg) => {
      return browser.getText(selector).then((v) => assert.equal(v, text, msg));
    });
    browser.addCommand('assertValue', (selector, text, msg) => {
      return browser.getValue(selector).then((v) => assert.equal(v, text, msg));
    });
  });
};
