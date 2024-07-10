import { ChartType } from '../components/ChartContainer/ChartLibraryConfig'

/**
 * Implements a wrapper over localStorage
 * why? LocalStorage is available only in browser,
 * so in future having one place to save/load preferences will save much time
 * like if react-native than use AsyncStorage
 */
enum StorageKeys {
  language = 'userLanguage', // backward compability with old platform
  chartType = 'wow.chartType',
  typeOfChart = 'typeOfChart',
  lastInstrumentID = 'wow.lastInstrumentID',
  chartIndicators = 'wow.chart_indicators',
  oneClickTrade = 'oneClickTrade',
  localTheme = 'localTheme',
  soundConfig = 'soundConfig',
}

class UserStorage {
  public static getLanguage = (): string | null => {
    try {
      return localStorage.getItem(StorageKeys.language)
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setLanguage = (language: string): void => {
    try {
      localStorage.setItem(StorageKeys.language, language)
    } catch (err) {
      console.warn(err)
    }
  }

  public static resetLanguage = (): void => {
    try {
      localStorage.removeItem(StorageKeys.language)
    } catch (err) {
      console.warn(err)
    }
  }

  public static getChartType = (): ChartType | null => {
    try {
      return localStorage.getItem(StorageKeys.chartType) as ChartType
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setChartType = (chartType: ChartType): void => {
    try {
      localStorage.setItem(StorageKeys.chartType, chartType)
    } catch (err) {
      console.warn(err)
    }
  }

  public static setTypeOfChart = (typeOfChart: string): void => {
    try {
      localStorage.setItem(StorageKeys.typeOfChart, typeOfChart)
    } catch (err) {
      console.warn(err)
    }
  }

  public static getTypeOfChart = (): string | null => {
    try {
      return localStorage.getItem(StorageKeys.typeOfChart)
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setFavouriteIndicators = (indicators: any[]): void => {
    try {
      localStorage.setItem(
        StorageKeys.chartIndicators,
        JSON.stringify(indicators)
      )
    } catch (err) {
      console.warn(err)
    }
  }

  public static getFavouriteIndicators = (): any[] => {
    try {
      const value = localStorage.getItem(StorageKeys.chartIndicators)
      return value ? JSON.parse(value) : []
    } catch (err) {
      console.warn(err)
      return []
    }
  }

  public static getOneClickTrade = (): boolean | null => {
    try {
      const value = localStorage.getItem(StorageKeys.oneClickTrade)
      return (value ? JSON.parse(value) : null) as boolean
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setOneClickTrade = (state: boolean): void => {
    try {
      localStorage.setItem(StorageKeys.oneClickTrade, String(state))
    } catch (err) {
      console.warn(err)
    }
  }

  public static getLocalTheme = (): any | null => {
    try {
      const value = localStorage.getItem(StorageKeys.localTheme)
      return (value ? JSON.parse(value) : null) as any
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setLocalTheme = (theme: string): void => {
    try {
      localStorage.setItem(StorageKeys.localTheme, String(theme))
    } catch (err) {
      console.warn(err)
    }
  }

  public static getSoundConfig = (): any | null => {
    try {
      return localStorage.getItem(StorageKeys.soundConfig)
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setSoundConfig = (onOff: string): void => {
    try {
      localStorage.setItem(StorageKeys.soundConfig, onOff)
    } catch (err) {
      console.warn(err)
    }
  }
}

export default UserStorage
