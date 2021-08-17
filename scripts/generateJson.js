const fs = require("fs");
const path = require("path");
const glob = require("glob");
const beautify = require("json-beautify");
const merge = require("lodash.merge");

const pluginPattern = "src/plugins/*";
const viewPattern = "views/**/index.js";
const stringsFileName = "strings.json";
const iconsFileName = "icons.json";
const viewFileName = "view.json";

const saveFile = (output, content) => {
  fs.writeFileSync(output, beautify(content, null, 4, 100));
}

const readFile = (pathname) => {
  const contents = fs.readFileSync(pathname, "utf-8")
  return JSON.parse(contents);
}

const getBundleName = (pathname) => {
  const dir = pathname.split(path.sep);
  const bundleName = `${dir[2]}_${dir[4]}`;
  return `${bundleName}.js`
}

const getViewName = (pathname) => {
  const dir = pathname.split(path.sep);
  return dir[4]
}

const modifyNestedKeys = (object, pathname) => {
  const viewName = getViewName(pathname)
  const result = {};
  Object.entries(object).forEach(([key, value]) => {
    result[key] = globalize(value, viewName)
  })

  return result;
}

const globalize = (object, name) => {
  const globalObject = {}
  Object.entries(object).forEach(([key, value]) => {
    globalObject[`${name}_${key}`] = value;
  })
  return globalObject;
}

const plugins = glob.sync(pluginPattern);
plugins.forEach(pluginPath => {
  const pluginName = pluginPath.split(path.sep)[2]
  const pluginPattern = `src/plugins/${pluginName}/${viewPattern}`;

  const webViews = glob.sync(pluginPattern, { noglobstar: true })
    .reduce((acc, curr) => {
      const view = readFile(`${path.dirname(curr)}/${viewFileName}`);
      const generatedView = {
        src: getBundleName(curr),
        meta: {
          strings: modifyNestedKeys(readFile(`${path.dirname(curr)}/${stringsFileName}`), curr),
          icons: modifyNestedKeys(readFile(`${path.dirname(curr)}/${iconsFileName}`), curr)
        }
      };

      const webView = merge({}, view, generatedView);

      return [...acc, webView]
    }, []);

  const plugin = {
    web_view: webViews
  }

  saveFile(`json/${pluginName}.json`, plugin);
})