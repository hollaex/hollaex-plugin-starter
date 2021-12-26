const glob = require("glob");
const path = require("path");
const copydir = require('copy-dir');
const mkdirp = require('mkdirp');

const plugin = process.env.PLUGIN;
const type = process.env.TYPE ? process.env.TYPE.toLowerCase() : '';
const pluginPattern = "src/plugins/*";

const PLUGIN_TYPES = {
  RAW: 'raw',
  PAGE: 'page',
  VERIFICATION_TAB: 'verification-tab',
  FIAT_WALLET: 'fiat-wallet',
  KYC: 'kyc',
  BANK: 'bank',
}

if (!plugin) {
  console.log('You must pass plugin argument');
  console.log('npm run add-plugin --plugin=PLUGIN_NAME --type=PLUGIN_TYPE');
} else if (!type) {
  console.log('You must pass type argument');
  console.log('npm run add-plugin --plugin=PLUGIN_NAME --type=PLUGIN_TYPE');
} else {
  const plugins = glob.sync(pluginPattern)
    .reduce((acc, curr) => {
      const pluginName = curr.split(path.sep)[2];
      return [...acc, pluginName];
    }, [])

  if (plugins.includes(plugin)) {
    console.log('This plugin already exists, try another plugin name');
  } else {
    switch (type) {
      case PLUGIN_TYPES.RAW:
        return (
          mkdirp(`src/plugins/${plugin}/views`)
            .then(() => {
              copydir.sync('src/templates/view', `src/plugins/${plugin}/views/view`);
              copydir.sync('src/templates/assets', `src/plugins/${plugin}/assets`);
              console.log('Plugin has been added successfully');
            })
        );
      case PLUGIN_TYPES.PAGE:
        return (
          mkdirp(`src/plugins/${plugin}`)
            .then(() => {
              copydir.sync('src/templates/new-page', `src/plugins/${plugin}`);
              console.log('Plugin has been added successfully');
            })
        );
      case PLUGIN_TYPES.VERIFICATION_TAB:
        return (
          mkdirp(`src/plugins/${plugin}`)
            .then(() => {
              copydir.sync('src/templates/verification-tab', `src/plugins/${plugin}`);
              console.log('Plugin has been added successfully');
            })
        );
      case PLUGIN_TYPES.FIAT_WALLET:
        return (
          mkdirp(`src/plugins/${plugin}`)
            .then(() => {
              copydir.sync('src/templates/fiat-wallet', `src/plugins/${plugin}`);
              console.log('Plugin has been added successfully');
            })
        );
      case PLUGIN_TYPES.KYC:
        return (
          mkdirp(`src/plugins/${plugin}`)
            .then(() => {
              copydir.sync('src/templates/kyc-verification', `src/plugins/${plugin}`);
              console.log('Plugin has been added successfully');
            })
        );
      case PLUGIN_TYPES.BANK:
        return (
          mkdirp(`src/plugins/${plugin}`)
            .then(() => {
              copydir.sync('src/templates/bank-verification', `src/plugins/${plugin}`);
              console.log('Plugin has been added successfully');
            })
        );
      default:
        return (
          console.log(`type ${type} does not exist, try another type. See doc for supported plugin types.`)
        );
    }
  }
}