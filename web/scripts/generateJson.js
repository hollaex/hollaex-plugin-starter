const fs = require("fs");
const path = require("path");
const glob = require("glob");
const beautify = require("json-beautify");
const merge = require("lodash.merge");
const mkdirp = require('mkdirp');

const plugin = process.env.PLUGIN;

const PLUGINS_PATH = 'https://bitholla.s3.ap-northeast-2.amazonaws.com/scripts/plugins';
const pluginsPattern = plugin ? `src/plugins/${plugin}` : "src/plugins/*";
const viewPattern = "views/**/index.js";
const stringsFileName = "strings.json";
const iconsFileName = "icons.json";
const viewFileName = "view.json";

const saveFile = (output, content) => {
  fs.writeFileSync(output, beautify(content, null, 4, 100));
}

const readFile = (pathname) => {
  try {
    const contents = fs.readFileSync(pathname, "utf-8")
    return JSON.parse(contents);
  } catch(err) {
    console.log(err);
    return {};
  }
}

const getBundlePath = (pathname) => {
  const dir = pathname.split(path.sep);
  const pluginName = dir[2];
  const bundleName = `${dir[2]}__${dir[4]}`;

  if(process.env.NODE_ENV === "development") {
    return `http://localhost:8080/${bundleName}.js`
  }

  const configFile = `../${pluginName}/config.json`;
  const { version = 0 } = fs.existsSync(configFile) ? readFile(configFile) : {};

  return `${PLUGINS_PATH}/${pluginName}/v${version}/${bundleName}.js`
}

const plugins = glob.sync(pluginsPattern);

if (!fs.existsSync('json')) {
  mkdirp.sync('json')
}

plugins.forEach(pluginPath => {
  const pluginName = pluginPath.split(path.sep)[2]
  const assetsPath = `src/plugins/${pluginName}/assets`
  const pluginPattern = `src/plugins/${pluginName}/${viewPattern}`;

  let assetsAdded = false;
  const assets = {
    strings: readFile(`${assetsPath}/${stringsFileName}`),
    icons: readFile(`${assetsPath}/${iconsFileName}`),
  };

  const webViews = glob.sync(pluginPattern, { noglobstar: true })
    .reduce((acc, curr) => {
      const view = readFile(`${path.dirname(curr)}/${viewFileName}`);
      const generatedView = {
        src: getBundlePath(curr),
        ...(assetsAdded ? {} : { meta: { ...assets }}),
      };

      // development
      // const webView = merge({}, view, generatedView);
      const webView = merge({}, generatedView, view);

      assetsAdded = true;

      return [...acc, webView]
    }, []);

  const plugin = {
    web_view: webViews
  }

  saveFile(`json/${pluginName}.json`, plugin);
})