const glob = require("glob");
const path = require("path");
const copydir = require('copy-dir');
const mkdirp = require('mkdirp');

const plugin = process.env.PLUGIN;
const pluginPattern = "src/plugins/*";

if (!plugin) {
  console.log('You must pass plugin argument')
  console.log('npm run add-plugin --plugin=PLUGIN_NAME');
} else {
  const plugins = glob.sync(pluginPattern)
    .reduce((acc, curr) => {
      const pluginName = curr.split(path.sep)[2];
      return [...acc, pluginName];
    }, [])

  if (plugins.includes(plugin)) {
    console.log('This plugin already exists, try another plugin name');
  } else {
    mkdirp(`src/plugins/${plugin}/views`)
      .then(() => {
        copydir.sync('src/templates/view', `src/plugins/${plugin}/views/view`);
        copydir.sync('src/templates/assets', `src/plugins/${plugin}/assets`);
        console.log('Plugin has been added successfully');
      })
  }
}