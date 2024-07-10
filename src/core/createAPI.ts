import API from './API'

/**
 * Initialize API module once and pass down everywhere
 * If we have zoid object xprops than force to connect to xprops.host
 * otherwise - use requested host
 */
const endpoint = (window as any).xprops
  ? (window as any).xprops.apiHost
  : process.env.NODE_ENV === 'development'
  ? 'https://simple-trader.tradesmarter.co'
  : `https://${window.location.host}`

let api = new API(endpoint)

const updateApiLang = (lang: string) => {
  api.instance.defaults.params['lang'] = lang
}

export { api, updateApiLang }
