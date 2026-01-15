module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      ['module-resolver', {
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@styles': './src/styles',
          '@constants': './src/constants',
          '@hooks': './src/hooks',
          '@database': './src/database'
        }
      }]
    ]
  };
};