module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
    //plugins: ['transform-remove-console'],
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
  };
};
