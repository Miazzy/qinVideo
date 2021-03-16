const CracoLessPlugin = require("craco-less");
const path = require("path");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true,
          },
        },
        modifyLessRule(lessRule) {
          lessRule.test = /global\.less$/;
          return lessRule;
        },
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        cssLoaderOptions: {
          modules: {
            localIdentName: "[local]_[hash:base64:5]",
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://code.qinmei.org:7001",
        secure: false,
        changeOrigin: true,
      },
    },
    port: 2333,
  },
};
