const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mkdirp = require('mkdirp');

const bundlesPattern = "web/dist/**.js";

const bundles = glob.sync(bundlesPattern);
bundles.forEach((pathname) => {
  const bundleName = path.basename(pathname, '.js');
  const [pluginName, viewName] = bundleName.split('__');
  if (viewName) {
    const destinationPath = `${pluginName}/${bundleName}.js`;
    const hasDirName = !!glob.sync(pluginName).length
    if (!hasDirName) {
      mkdirp.sync(pluginName);
    }
    fs.copyFileSync(pathname, destinationPath);
  }
})