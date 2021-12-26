const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mkdirp = require('mkdirp');


const jsonsPattern = "web/json/**.json";

const jsons = glob.sync(jsonsPattern);
jsons.forEach((pathname) => {
  const fileName = path.basename(pathname, '.json');
  const destinationPath = `${fileName}/web_view.json`;
  const hasDirName = !!glob.sync(fileName).length
  if (!hasDirName) {
    mkdirp.sync(fileName);
  }
  fs.copyFileSync(pathname, destinationPath);
})