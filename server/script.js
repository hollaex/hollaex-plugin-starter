'use strict';

/**
 * Please refer to the hollaex plugin documentation for a deatiled overview on plugins
 * https://docs.hollaex.com/how-tos/develop-plugins
*/

const {
	/**
     * Add public meta, meta, and installed libraries that are set in config.json
	 * For more information, go to https://docs.hollaex.com/how-tos/develop-plugins/basic-tutorial-hello-exchange-plugin#step-2-add-updatable-values-in-public_meta-and-meta
	 *
	 * Example:
	 *
	 *  meta 				// Hollaex tools library
	 * 	publicMeta 			// Winston logger instance
	 * 	installedLibraries 	// Express app instance
	*/

	/**
     * Add any additional libraries here.
     * For more information, go to https://docs.hollaex.com/how-tos/develop-plugins/basic-tutorial-hello-exchange-plugin#step-3-add-the-necessary-third-party-libraries-to-prescript
	 *
	 * Example:
	 *
	 *  app 			// Hollaex tools library
	 * 	loggerPlugin 	// Winston logger instance
	 * 	toolsLib 		// Express app instance
	*/
} = this;

const init = async () => {
	/**
     * Add logic here for initializing plugin.
	 * For example, you can check to see if all required public_meta and meta values are configured.
	 *
	 * Example:
	 *
	 *  if (!lodash.isString(meta.secret.value)) {
			throw new Error(`Meta value ${secret} must be a string`);
		}
	*/
};

init()
	.then(() => {
		/**
		 * If initialization passes, add your plugin logic here
		 * For more info go to https://docs.hollaex.com/how-tos/develop-plugins/basic-tutorial-hello-exchange-plugin#step-4-set-script-as-the-javascript-es6+-code-for-the-plugin
		 *
		 * Example:
		 *
		 *	Express API endpoint
		 * 	app.get('/plugins/plugin-template/health', async (req, res) => {
				try {
					return res.json({ status: 'ok' });
				} catch (err) {
					loggerPlugin.error(
						req.uuid,
						'GET /plugins/plugin-template/health',
						err.message
					);

					return res.status(400).json({ message: err.message })
				}
			});
		*/
	})
	.catch((err) => {
		/**
		 * If initilization fails, the error message will be logged and the plugin logic won't run
		 *
		 * Example:
		 *
		 *  loggerPlugin.error(
				'TEMPLATE PLUGIN err during initialization',
				err.message
			);
		*/
	});