# Getting Started

1. Install dependencies:

	```bash
	npm install
	cd web/ && npm install
	```
	
2. Decide about the plugin type:

| Type |  |
| ------ | ------ |
| page | adds a new page with customizable access from the side and top menus |
| verification-tab | adds a new verification tab to the user verification page |
| fiat-wallet | adds a deposit and withdraw page for a fiat currency |
| kyc | adds KYC tab to the user verification page |
| bank | adds bank verification tab to the user verification page |

3. Run `npm run add-plugin --plugin=<PLUGIN_NAME> --type=<PLUGIN_TYPE>` to initialize a plugin template.

4. Disable CORS on your browser.

5. Once the plugin is initialized, run the following commands simultaneously:

    * Run `npm start --plugin=<PLUGIN_NAME>` on the plugins starter kit web dir.
    <br> 
    * Run `npm run dev:plugin --plugin=<PLUGIN_NAME>` on the Hollaex kit web dir,

6. Refresh the page to see the changes.