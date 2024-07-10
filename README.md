# Options6
This project is frontend for options trading, responsive for displaying market data, manipulating orders. Options6 allows whitelabel functionality based on manipulating redux *registry* object which contains URL/colors/locales. This project communicates with *old* backend using REST API, subscribes to trading data stream via lightstream.

## Documentation
* [redux store](https://github.com/Tradesmarter/options6/blob/main/docs/STATE.md)
* [widgets](https://github.com/Tradesmarter/options6/blob/main/docs/WIDGETS.md)
* [development process state](https://github.com/Tradesmarter/options6/blob/main/docs/DEVFLOW.md)
* [themes](https://github.com/Tradesmarter/options6/blob/main/docs/THEMES.md)
* [positions](https://github.com/Tradesmarter/options6/blob/main/docs/POSITIONS.md)


## Run
* (step 1) Select one of the options:
    * [Vagrant](https://github.com/Tradesmarter/vagrant)
    * [Staging env](https://staging3.tradesmarter.com/)
    * [Options docker fe](https://github.com/Tradesmarter/TradingOptionsDockerFe)
    * ... or just clone react app and run locally with staging backend
* (step 2) Run locally
    * yarn
    * In case you want to use staging as a backend:
        * Edit [src/core/createAPI.ts](https://github.com/Tradesmarter/options6/blob/main/src/core/createAPI.ts#L8) and change to http://options-staging2.tradesmarter.com/
    * yarn start
    * Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
* (step 2) Run locally on subdomain
    * setup DNS alias in /etc/hosts trading.tradesmarter.com to 127.0.0.1
    * yarn start:80
### Build
* yarn build
* Compiled result will be in /build folder
### Test
* yarn test

## Configure
* Configure API endpoints src/core/endpoint.ts (if necessary), by default it points to http://options.tradesmarter.com in development mode and to window.location.host url in production mode.

## Dependencies
* [options-trading](https://github.com/Tradesmarter/options-trading) 

## Translations
We are using transifex provider, but .po solution is provider agnostic, so you can pick any provider, but .po files should follow gettext format.

* Use the same scheme with po files - download file and place it into ./translations folder
* Run command, where LANG= equals language code like 'ru', 'es':
```
LANG=ru yarn translations:convert
```
* This will create .po.json in /src/core/translations, system will catch it automatically once you select it
* Please rebuild production build using ```yarn build``` command
## Extend
* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
* [React-MD](https://react-md.dev/)
