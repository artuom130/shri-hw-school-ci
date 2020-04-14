module.exports = {
  root: '.page',
  header: '.header__heading',
  loader: '.page__content .loader',
  errorModal: '.error-modal',
  errorModalCloseButton: '.error-modal .button[type=button]',

  home: {
    runBuild: '.button[type=button].header__control',
    getStarted: '.get-started',
    getStartedButton: '.get-started__button',
    history: '.build-history',
    historyCard: '.build-history__card',
  },
  buildModal: {
    block: '.build-modal',
    submit: '.build-modal .button_action.button[type=submit]',
    cancel: '.build-modal .button[type=button]',
    input: 'input#commitHash',
    loader: '.build-modal .loader',
  },
  settings: {
    block: '.settings',
    loader: '.settings .loader',
    form: '.form',
    repoNameInput: '#repoName',
    buildCommandInput: '#buildCommand',
    mainBranchInput: '#mainBranch',
    periodInput: '#period',
    repoNameClear: '#repoName + .input__clear-btn',
    submit: '.settings .form__submit-group .button_action.button[type=submit]',
    cancel: '.settings .form__submit-group a.button',
    errorMessage: '.form__error',
  },
  details: {
    block: '.details',
    commitHash: '.details .card-ci-run__commit-info-elem .icon-text__secondary-text',
  },
};
