var appRoot = require('app-root-path');
var path = require("path");

class WebpackManager {
  constructor(config={}) {
    config = Object.assign({}, {
      env: "development",
      rootDir: appRoot.path,
      configDir: path.resolve(appRoot.path, "src/config"),
      buildDir: path.resolve(appRoot.path, "dist")
    }, config )

    this.config = config
  }

  isProduction() {
    return this.config.env == "production"
  }

  getWebpackMode() {
    if(this.config.env=="production") return "production"
    return "development";
  }

  getAppConfig() {
    const configModuleDir = path.resolve(this.config.configDir + '/module/')
    let appConfig = require(configModuleDir + "/default.js");
    // console.log(appConfig)
    switch (this.config.env) {
      case "production":
        appConfig = require(configModuleDir + "/production.js");
        break;
      case "staging":
        appConfig = require(configModuleDir + "/staging.js");
        break;
      default:
    }

    return appConfig;
  }
}

module.exports = WebpackManager