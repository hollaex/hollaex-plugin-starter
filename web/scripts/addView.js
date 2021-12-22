const glob = require("glob");
const path = require("path");
const copydir = require('copy-dir');

const plugin = process.env.PLUGIN;
const view = process.env.WEB_VIEW || 'view';
const pluginPattern = "src/plugins/*";
const viewsPattern = `src/plugins/${plugin}/views/*`;


if (!plugin) {
  console.log('You must pass plugin argument')
  console.log('npm run add-view --plugin=PLUGIN_NAME');
} else {
  const plugins = glob.sync(pluginPattern)
    .reduce((acc, curr) => {
      const pluginName = curr.split(path.sep)[2];
      return [...acc, pluginName];
    }, [])

  if (plugins.includes(plugin)) {
    const views = glob.sync(viewsPattern)
      .reduce((acc, curr) => {
        const viewName = curr.split(path.sep)[4];
        return [...acc, viewName];
      }, []);

    if (views.includes(view)) {
      console.log('This view already exists, try another view name');
    } else {
      copydir.sync('src/templates/view', `src/plugins/${plugin}/views/${view}`);
      console.log(`A view has been successfully added to ${plugin} plugin`);
    }
  } else {
    console.log(`Plugin ${plugin} does not exist`);
  }
}