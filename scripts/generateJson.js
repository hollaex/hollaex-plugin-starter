const fs = require("fs");
const path = require("path");
const glob = require("glob");
const beautify = require("json-beautify");
const merge = require("lodash.merge");

const pattern = "src/views/**/index.js";
const stringsFileName = "strings.json";
const iconsFileName = "icons.json";
const viewFileName = "view.json";
const outputFile = "plugin.json";

const saveFile = (output, content) => {
  fs.writeFileSync(output, beautify(content, null, 4, 100));
}

const readFile = (pathname) => {
  const contents = fs.readFileSync(pathname, "utf-8")
  return JSON.parse(contents);
}

const getBundleName = (pathname) => {
  const bundleName = path.basename(path.dirname(pathname));
  return `${bundleName}.js`
}

const webViews = glob.sync(pattern)
  .reduce((acc, curr) => {
  const view = readFile(`${path.dirname(curr)}/${viewFileName}`);

  const generatedView = {
    src: getBundleName(curr),
    meta: {
      strings: readFile(`${path.dirname(curr)}/${stringsFileName}`),
      icons: readFile(`${path.dirname(curr)}/${iconsFileName}`)
    }
  };

  const webView = merge({}, view, generatedView);

 return [...acc, webView]
  }, []);

const plugin = {
  webView: webViews
}

saveFile(outputFile, plugin);