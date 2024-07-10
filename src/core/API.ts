/**
 * This file contains a API class and interfaces for API response
 */

import jsonp from 'jsonp'
import axios, { AxiosInstance } from 'axios'
import md5 from 'blueimp-md5'
import { IClosedTrade, IOpenTrade } from './interfaces/trades'
import { locale } from './i18n'

export interface ITradingHourRange {
  from: number
  to: number
}

export interface ITradingHour {
  gameType: number
  opensAt: number
  isOpen: string
  tradingHourRanges: ITradingHourRange[]
}

interface ICreateTradeResponse {
  success: boolean
  details: IOpenTrade
}

interface IPaginatedTradesResponse {
  pages: number
  rows: IClosedTrade[]
}

interface ITradesResponse {
  open: IOpenTrade[]
  closed: IPaginatedTradesResponse
  success: boolean
}

interface IPayoutRange {
  payout: number
  rebate: number
  chance?: number
}

export interface IPayout {
  gameType: number
  payoutRanges: IPayoutRange[]
  payout: number
}

export interface IInstrument {
  instrumentID: string
  tradingHours: ITradingHour[]
  opensAt: number
  isOpen: boolean
  payouts?: IPayout[]
  expiry?: string
  type: number
  precision: number
  order: number
  defaultGameType: number
  provider: string
  futureExpirationDate: any
  // trading.instruments
  name: string
  nameEnglish: string
  referencePrice: string
}

export interface IInstrumentUpdate {
  instrumentID: string
  isOpen: boolean
  payouts: IPayout[]
  tradingHours: ITradingHour[]
}

interface IGenericResponse {
  success: boolean
}

interface IWalletBonus {
  tradeable: number
  pending: number
  promotional: number
}

export interface IWalletDetails {
  availableBonus: number
  availableCash: number
  baseCurrency: number
  bonus: IWalletBonus
  bonusesInfo: any[]
  currency: string
  displayCurrency: number // may not be present
  pendingBonusDetails: any[]
  reserved: number
  userCurrency: number
}

interface ISentiment {
  up: number
  down: number
}

export interface ISignInResponse {
  accountLevel: string // "5"
  dob: string // "1988-03-02"
  email: string // "qa2@getnada.com"
  firstName: string // "asdasd"
  lastName: string // "dasdas"
  location: string // "ua"
  mobile: string // "+380 937293785"
  session: string // "202c4eecb9e2e66a23cf1e9e61ad3de3"
  success: boolean // true
  userID: string // "213902"
}

export interface IUserInfo {
  accountLevel: number // 5
  address: string // "sdfsfd"
  allowPracticeModeChange: boolean // true
  city: string // "sdfsf"
  dateOfBirth: string // "1988-03-02"
  email: string // "qa2@getnada.com"
  favAssets: string[]
  topAssets: string[]
  favIndicators: string // "aroonoscillator,aroon,ema,priceenvelopes"
  firstName: string // "asdasd"
  frozen: boolean // false
  isFacebookUser: number // 0
  isVKUser: number // 0
  lastName: string // "dasdas"
  locale: string // "en_EN"
  location: string // "ua"
  nationalID: string // ""
  phone: string // "+380 937293785"
  practiceExpirationDate: number // 0
  practiceMode: boolean // false
  practiceWalletNextResetDate: number // 0
  isDemo: boolean // guest demo
  isDemoActive: boolean // guest demo
  session: string // "5d4ee3d150b4aef035fd3ab2a8a083f3"
  showPracticeRegistration: any // null
  state: string // ""
  userID: string // "213902"
  userImage: string // "https://s3-eu-west-1.amazonaws.com/tradesmarter-cdn/tmp/user-image.png"
  zipCode: string // "23442"
}

export interface ITutorialsFormat {
  enabled: boolean
  defaultLang: string
  order: string
  sources: any // key - value
  length: any
  images: any
  wow: {
    order: string[]
  }
  titles: any
}

export interface ILeftPanel {
  videos: ITutorialsFormat
  news: {
    url: string
    enabled: boolean
  }
  cryptoNews: {
    url: string
    enabled: boolean
  }
  videoNews: {
    url: string
    enabled: boolean
  }
  dailyAnalysis: {
    url: string
    enabled: boolean
  }
  dashboard: {
    cards: any
    enabled: boolean
  }
  leaderboard: {
    enabled: boolean
  }
  allowSocial: number
  socialWidgetUrl: string // ":"https:\/\/widgets.tradesmarter.com\/[[[language-code]]]\/widget\/activity?numberOfRows=7&disableLink=1&css=https:\/\/trading.tradesmarter.com\/app-angular-platform\/css\/themes\/dark-black-theme\/custom-widgets-dark-black-theme.css",
  signalsSrc: string // ":"https:\/\/binarymag.info\/informer\/v2-show.php?module=1&gamma=23",
  showAutochartist: boolean // ":false,
  autochartistUrl: string // ":"https:\/\/bo.autochartist.com\/boV3\/index.jsp",
  assetAcSymbols: any
}

interface IRegistryCDNUrls {
  assets: string
  toppicks: string
  shortgames: string
}

export interface ITradeOperationsConfig {
  timeout: string // "30"
  sellbackInstruments: string[] // "1", "11", "212"
  sellbackDeadPeriod: string // "30"
  doubleupInstruments: string[] // "1", "11", "212"
}

export interface ICurrency {
  currencyName: string
  currencySymbol: string
  conversionRate: number
  precision: number
}

export interface IInvestmentLimits {
  minStake: string
  maxStake: string
  minStake60sec: number
  maxStake60sec: string
  minStakeLongTerm: string
  maxStakeLongTerm: number
  defaultStake: string
  defaultStake60sec: string
  defaultStakeLongTerm: string
}

interface IInvestmentDefaults {
  financialPanel: any
  highLow: string
  sixtySeconds: string
  optionsCfd: any
}

export interface IRegistry {
  alias: string
  cdnUrls: IRegistryCDNUrls
  currenciesInfo: { [key: number]: ICurrency } // {1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}, 6: {…}, 7: {…}, 8: {…}, 9: {…}, 10: {…}, 11: {…}, 12: {…}, 13: {…}, 14: {…}, 15: {…}, 16: {…}, 17: {…}, 18: {…}}
  customLogoUrlLink: string // "http://www.tradesmarter.com"
  env: string
  investmentDefaults: IInvestmentDefaults
  investmentLimits: IInvestmentLimits
  investmentOptions: string[]
  lang: string // "en"
  langs: any // {en: {…}, de: {…}, es: {…}, fr: {…}, it: {…}, …}
  loggedIn: boolean
  longTermGames: string[] // (13) ["18", "1", "25", "26", "3", "6", "14", "155", "15", "4", "5", "2", "139"]
  lsHost: string // "feed-staging.tradesmarter.com"
  lsPort: number // 443
  partnerConfig: any
  practiceExpirationDate: number
  shortGames: string[] // ["18", "7", "139", "57", "111", "117", "115", "125", "96", "1", "25", "243", "114", "3", "6", "14", "129", "120", "118", "121", "119", "27", "116", "155", "15", "97", "95", "122", "5", "246"]
  siteID: string
  termsLink: string // "http://trading.tradesmarter.com/en/terms"
  time: number // 1603185522000
  tradeOperationsConfig: ITradeOperationsConfig
  types: any // {Currencies: "1", Stocks: "2", Commodities: "3", Indices: "4", Crypto: "6"}
  uriBase: string // ""
  url: string // "http://staging3.tradesmarter.com"
  urlBaseNonSecure: string // "http://staging3.tradesmarter.com"
  urlBaseSecure: string // "https://staging3.tradesmarter.com"
  userAccountLevel: number // 0
  userCurrency: number // 1
  userFullName: string // " "
  userImage: null
  theme: any
}

/**
 * Server will accept trade which compatible with this interface
 */
interface IAcceptableTrade {
  distance: string
  payout: string
  rebate: string
  stake: number
  instrumentID: string
  userCurrencyStake: number
  gameType: number
  expiry: any
  opensAs: number
  direction: number
  openAsTradeID: string
}

export interface ICandle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

export interface IChartResponse {
  aggs: ICandle[]
  count: number // 1000
  from: number // 1606361309
  instrumentId: number // 1
  limit: number // 1000
  period: string // "1m"
  to: number // 1606481309
}

export interface ICfdOptionsProduct {
  expiry: number
  price: string
  publish_date: number
}

export interface ICfdOptionsInstrument {
  [key: number]: ICfdOptionsProduct
}

interface ISellbackAmountSuccessResponse {
  success: boolean
  amount: number
}

class API {
  instance: AxiosInstance
  backend: string
  lang: string = ''

  constructor(backend: string) {
    this.lang = locale
    let params: any = { lang: this.lang }

    let headers: any[] = []
    if (this.isCookiesExposed()) {
      params = {
        ...params,
        'wrapped-cookie': btoa(this.getExposedCookies()),
      }
    }

    this.backend = backend
    this.instance = axios.create({
      baseURL: backend,
      params,
      headers,
    })
  }

  /**
   * https://simple-trader.matbet258.com/?noheader=true&lang=tr&PHPSESSID=&userID=95&username=VendorTesting&accountLevel=0
   */
  private isCookiesExposed = (): boolean => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    return urlSearchParams.has('PHPSESSID')
  }

  /**
   * Convert cookies to array like headers
   * @returns
   */
  private getExposedCookies = (): string => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    return [
      `PHPSESSID=${urlSearchParams.get('PHPSESSID')}`,
      `userID=${urlSearchParams.get('userID')}`,
      `username=${urlSearchParams.get('username')}`,
      `accountLevel=${urlSearchParams.get('accountLevel')}`,
    ].join('; ')
  }

  /**
   * Primary request for fetching brand-level data
   */
  getRegistry = async (): Promise<IRegistry | null> => {
    const url = '/ajax/index/get-registry'
    const { data } = await this.instance.get(url, {
      timeout: 10000,
    })

    data.registry.lang = this.lang

    if (data.success) {
      return data.registry as IRegistry
    }
    return null
  }
  /**
   * Fetch advanced aka get-instruments
   */
  fetchInstruments = async (): Promise<IInstrument[]> => {
    const url = '/ajax/instrument/get-instruments'
    const { data } = await this.instance.get(url)

    if (data.success) {
      return data.instruments as IInstrument[]
    }
    return []
  }

  /**
   * Fetch instrument history
   * No error/success state
   */
  fetchInstrumentHistory = async (
    instruments: string,
    wow: boolean,
    period: number,
    points: number
  ): Promise<any> => {
    const url = '/ajax/instrument/history'
    const params = {
      instruments: `[${instruments}]`,
      wow,
      period,
      points,
    }
    const { data } = await this.instance.get(url, { params })
    return data
  }

  /**
   * Fetch sentiment for instrument
   * @param instrumentID
   */
  fetchInstrumentSentiment = async (
    instrumentID: number | string
  ): Promise<ISentiment | null> => {
    const url = '/ajax/instrument/sentiment'
    const params = {
      instrumentID,
    }
    const { data } = await this.instance.get(url, { params })
    if (data.success) {
      return data.sentiment as ISentiment
    }
    return null
  }

  /**
   * Attempt to sign in
   * Provide raw password to this function and salt will be passed to the backend
   * @param email - email
   * @param raw_password - raw password
   */
  signIn = async (
    email: string,
    raw_password: string
  ): Promise<ISignInResponse | any> => {
    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', md5(raw_password))

      const url = '/ajax/index/sign-in'
      const { data } = await this.instance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (data.success) {
        return data as ISignInResponse
      }
      return { error: data.message }
    } catch (err) {
      console.warn(err)
      return { error: 'network' }
    }
  }

  /**
   * Perform sign out on backend
   */
  signOut = async (): Promise<IGenericResponse | any> => {
    try {
      const url = '/ajax/index/sign-out'
      const { data } = await this.instance.post(url)
      return !!data.success
    } catch (err) {
      console.warn(err)
      return false
    }
  }

  /**
   * Fetch instruments array from CDN using data in registry
   * @param assetsUrl
   * @param timestamp
   */
  fetchCDNInstruments = async (
    assetsUrl: string,
    timestamp: number
  ): Promise<IInstrumentUpdate[] | null> => {
    try {
      const url = `${assetsUrl}/${timestamp}.json`
      const { data } = await axios.get(url)

      return data as IInstrumentUpdate[]
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  /**
   * Fetch wallet balances and other details
   */
  fetchWalletDetails = async (): Promise<IWalletDetails | null> => {
    try {
      /**
       * todo: move to user
       */
      const url = '/ajax/user/get-wallet-details'
      const params = {
        bonuses: 1,
      }
      const { data } = await this.instance.get(url, { params })
      if (data.success) {
        return data.wallet as IWalletDetails
      }
      return null
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  /**
   * Fetch open positions
   */
  fetchTrades = async (params = {}): Promise<ITradesResponse | any> => {
    try {
      const url = '/ajax/user/trades'
      const { data } = await this.instance.get(url, { params })

      return data
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  /**
   * Fetch user info
   */
  fetchUserInfo = async (): Promise<IUserInfo | null> => {
    try {
      const url = '/ajax/user/get-user-info'
      const { data } = await this.instance.get(url)

      return data.userInfo as IUserInfo
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  /**
   * Convert options to formData and send to server
   * @param options
   */
  createTrade = async (options: IAcceptableTrade | any): Promise<any> => {
    try {
      const url = '/ajax/user/trade?bundleWalletDetails=1&bundleTrades=1'
      const fData = new FormData()
      Object.keys(options as any).forEach((key: string) => {
        fData.append(key, (options as any)[key])
      })
      const { data } = await this.instance.post(url, fData)
      return data as ICreateTradeResponse
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  /**
   * Implements a cancelable trade right after submit
   * @param tradeID
   */
  cancelTimedTrade = async (tradeID: number): Promise<any> => {
    try {
      const url = '/ajax/user/cancel-trade-timed'
      const fData = new FormData()
      fData.append('id', String(tradeID))
      const { data } = await this.instance.post(url, fData)
      return data
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  /**
   * Activate or deactivate practice mode
   * @param activate
   */
  practiceMode = async (activate: boolean): Promise<any | null> => {
    try {
      const url = `/ajax/user/practice-mode`
      const params = {
        activate,
      }
      const { data } = await this.instance.get(url, { params })
      return data as any
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  /**
   * Add instrument to favorites
   * Don't use this method
   * @param instrumentIDs
   */
  setFavorites = async (instrumentIDs: string[]): Promise<IGenericResponse> => {
    try {
      const url = `/ajax/user/set-favorites}`
      const params = {
        instrumentIDs: instrumentIDs.join(','),
      }
      const { data } = await this.instance.get(url, { params })

      return data as IGenericResponse
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * Add or remove instrument from favorites
   * @param instrumentID
   * @param unstar
   */
  starInstrument = async (
    instrumentID: string,
    unstar: boolean
  ): Promise<IGenericResponse> => {
    try {
      const url = `/ajax/user/star`
      const params = {
        instrumentID,
        unstar,
      }
      const { data } = await this.instance.get(url, { params })

      return data as IGenericResponse
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  topInstrument = async (
    instrumentID: string,
    unset: boolean
  ): Promise<IGenericResponse> => {
    try {
      const url = `/ajax/user/set-user-top-asset`

      const params = {
        instrumentID,
        unset,
      }

      const { data } = await this.instance.get(url, { params })

      return data as IGenericResponse
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * User session event, happends every 60 second to figure out if user is logged in
   */
  ping = async (): Promise<IGenericResponse> => {
    try {
      const url = '/ajax/index/ping'
      const params = {
        json: '',
      }
      const { data } = await this.instance.post(url, { params })

      return data as IGenericResponse
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * Fetch candles for chart
   * Returns candles or null
   */
  chartHistory = async (
    instrumentId: any,
    period: any = '1m',
    limit: number = 1000,
    source?: any,
    toTimestamp?: number
  ): Promise<IChartResponse | null> => {
    try {
      const url = `/ajax/instrument/chart-history`
      const params: any = {
        instrumentId,
        period,
        limit,
        to: undefined,
      }
      let options: any = {
        params,
      }

      if (source) {
        options.cancelToken = source.token
      }

      if (toTimestamp) {
        params.to = new Date(toTimestamp * 1000).toISOString()
      }

      const { data } = await this.instance.get(url, options)

      return data
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  /**
   * Call server to get sellback amount
   * @param trade - id of trade
   */
  getSellbackAmount = async (
    trade: string
  ): Promise<ISellbackAmountSuccessResponse | any> => {
    try {
      const url = '/ajax/user/get-sellback-amount'
      const fData = new FormData()
      fData.append('trade', trade)

      const { data } = await this.instance.post(url, fData)
      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * Call a server to do a sellback
   * @param trade - trade
   * @param sellbackAmount - amount of sellback from previous request
   * @param positionStake - amount of position
   */
  sellback = async (
    trade: string,
    sellbackAmount: number,
    positionStake: number
  ): Promise<any> => {
    try {
      const url = '/ajax/user/sellback'
      const fData = new FormData()
      fData.append('trade', trade)
      fData.append('amount', String(sellbackAmount))
      fData.append('stake', String(positionStake))

      const { data } = await this.instance.post(url, fData)
      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * Select wallet on backend
   * @param bonusWallet
   */
  selectBonusForVolume = async (bonusWallet: any) => {
    try {
      const { bonusID, typeID } = bonusWallet
      const fData = { bonusID, typeID }
      const url = '/ajax/user/select-bonus-for-volume'
      const { data } = await this.instance.post(url, fData)

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }
  /**
   * Guest-demo request
   */
  createDemoAccount = async (demoAccountID: string) => {
    try {
      const url = '/ajax/index/create-demo-account'
      const params = {
        demoAccountID,
      }
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * password reset
   */
  resetPasswordAccount = async (email: string): Promise<any> => {
    try {
      const fData = new FormData()
      const url = '/ajax/index/reset-password'
      fData.append('email', email)
      const { data } = await this.instance.post(url, fData)

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * Get theme data
   */
  getTheme = async (theme: string): Promise<any> => {
    try {
      const url = '/ajax/index/get-theme'
      const params = {
        themeSet: theme,
      }
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * get json file from url
   * @param url
   * @param params
   */
  getJson = async (url: string, params: any) => {
    try {
      const { data } = await axios.get(`${url}.json`, { params })
      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  /**
   * get Daily Analysis
   * @param instrument
   * @param date as YYYYMMDD
   */
  fetchDailyAnalysis = async (instrument: string, date: number) => {
    const url = '/ajax/instrument/daily-analysis'
    const params = { instrument, date }

    try {
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  fetchDashboard = async (timezoneOffset: number) => {
    const url = '/ajax/user/get-wallet-stats'
    const params = { timezoneOffset }

    try {
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  fetchOptionPrices = async (instrumentID: string) => {
    const url = '/ajax/instrument/get-option-prices'
    const params = { instrumentID }
    try {
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  fetchRecentlyTraded = async (platformID: string, siteID: number) => {
    const url = '/ajax/instrument/get-recently-traded-assets'
    const params = { platformID, siteID }

    try {
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  closeTrades = async (trades: number[][], oneClickCloseTrade: boolean) => {
    const url = '/ajax/user/close-trades'
    const params: Record<string, any> = { trades }

    if (oneClickCloseTrade) params.oneClickCloseTrade = true

    try {
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  fetchTopChangingAssets = async () => {
    const url = '/ajax/instrument/get-top-changing-assets'

    try {
      const { data } = await this.instance.get(url)

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  getUserGeoLocation = () => {
    const url = 'https://geoip.tradesmarter.com/json'
    const opt = {
      timeout: 10000,
    }

    return new Promise((resolve, reject) =>
      jsonp(url, opt, (err, data) => {
        if (err) {
          reject(err.message)
        } else {
          resolve(data.country.toLowerCase() as string)
        }
      })
    )
  }

  /**
   * Fetch Leader Board
   */
  fetchLeaderBoard = async (period: any) => {
    try {
      const url = `/ajax/user/get-gain-leaders?period=${period}`
      const resp = await this.instance.get(url)
      return resp.data
    } catch (err) {
      console.log(
        'Debug ~ file: API.ts ~ line 966 ~ fetchLeaderBoard= ~ err',
        err
      )
      return []
    }
  }

  fetchRecentTrades = async (instrumentID: string) => {
    const url = '/ajax/user/get-global-open-trades'
    const params = { instrumentID }
    try {
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }

  fetchDistances = async (instrumentID: string) => {
    const url = '/ajax/instrument/get-distances'
    const params = { instrumentID }
    try {
      const { data } = await this.instance.get(url, { params })

      return data as any
    } catch (err) {
      console.warn(err)
      return { success: false }
    }
  }
}

export default API
