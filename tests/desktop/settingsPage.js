const config = require('config');
const expect = require('chai').expect;
const storage = require('../../server/src/models/storage');

const page = require('../utils/pageObject');
const { settings, home } = page;

const url = config.get('client.urls');

describe('Settings page without settings', function() {
  beforeEach(function(done) {
    storage.deleteSettings().then(done);
  });

  beforeEach(function() {
    return this.browser.url(url.settings).waitForExist(settings.block, 2000);
  });

  it('Settings page is loaded', function() {
    return this.browser.assertExist(settings.block);
  });

  it('Inputs are empty by default', function() {
    return this.browser
      .assertValue(settings.repoNameInput, '')
      .assertValue(settings.buildCommandInput, '')
      .assertValue(settings.mainBranchInput, '')
      .assertValue(settings.periodInput, '');
  });

  it('Cannot send form without required fields', function() {
    return this.browser
      .setValue(settings.repoNameInput, '')
      .click(settings.submit)
      .assertNotExist(settings.loader, 'Should not show loader')
      .assertExist(settings.errorMessage, 'Should display form error message');
  });

  it('Cannot save incorrect the settings', function() {
    const ciSettings = {
      repoName: 'artuom130/shri-hw-asyncs',
      buildCommand: 'npm run build',
      mainBranch: 'master',
      period: 0,
    };

    return this.browser
      .setValue(settings.repoNameInput, ciSettings.repoName)
      .setValue(settings.buildCommandInput, ciSettings.buildCommand)
      .setValue(settings.mainBranchInput, ciSettings.mainBranch)
      .click(settings.submit)
      .assertDisabled(settings.submit, 'Buttons are not disabled while sending')
      .assertExist(settings.loader, 'Loader is not shown while sending')
      .waitForExist(settings.loader, 20000, true)
      .assertExist(page.errorModal, 'Error shoul be shown')
      .click(page.errorModalCloseButton);
  });

  it('Can save correct the settings', function() {
    const ciSettings = {
      repoName: 'artuom130/shri-hw-async',
      buildCommand: 'npm run build',
      mainBranch: 'master',
      period: 0,
    };

    return this.browser
      .setValue(settings.repoNameInput, ciSettings.repoName)
      .setValue(settings.buildCommandInput, ciSettings.buildCommand)
      .setValue(settings.mainBranchInput, ciSettings.mainBranch)
      .click(settings.submit)
      .assertDisabled(settings.submit, 'Buttons are not disabled while sending')
      .assertExist(settings.loader, 'Loader is not shown while sending')
      .waitForExist(settings.loader, 20000, true)
      .assertNotExist(page.errorModal, 'Error shoul not be shown');
  });
});

describe('Settings page with settings', function() {
  const ciSettings = {
    repoName: 'artuom130/shri-hw-async',
    buildCommand: 'npm run build',
    mainBranch: 'master',
    period: 0,
  };
  beforeEach(function(done) {
    storage.setSettings(ciSettings).then(done);
  });

  beforeEach(function() {
    return this.browser.url(url.settings).waitForExist(settings.block);
  });

  it('Settings page is loaded', function() {
    return this.browser.assertExist(settings.block);
  });

  it('Inputs filled with specified values', function() {
    return this.browser
      .assertValue(settings.repoNameInput, ciSettings.repoName)
      .assertValue(settings.buildCommandInput, ciSettings.buildCommand)
      .assertValue(settings.mainBranchInput, ciSettings.mainBranch);
  });

  it('Can update settings', function() {
    return this.browser
      .click(settings.repoNameClear)
      .assertValue(settings.repoNameInput, '')
      .setValue(settings.repoNameInput, 'artuom130/isItReal')
      .click(settings.submit)
      .assertDisabled(settings.submit, 'Buttons are not disabled while sending')
      .assertExist(settings.loader, 'Loader is not shown while sending')
      .waitForExist(settings.loader, 20000, true)
      .assertNotExist(page.errorModal, 'Error shoul not be shown')
      .click(settings.cancel)
      .waitForExist(home.history)
      .assertText(page.header, 'artuom130/isItReal', 'Should show updated repository name');
  });
});
