export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'app-factory',
        'dapp-factory',
        'agent-factory',
        'plugin-factory',
        'miniapp-pipeline',
        'website-pipeline',
        'cli',
        'core',
        'docs',
        'ci',
        'deps',
      ],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
  },
};
