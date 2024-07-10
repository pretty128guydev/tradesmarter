import { enGB, tr, ru, th, zhCN } from 'date-fns/locale'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import format from 'date-fns/format'

export class LocaleDate {
  static params = {}

  static setLocale = (lang: string) => {
    let locale

    switch (lang) {
      case 'en':
        locale = enGB
        break
      case 'tr':
        locale = tr
        break
      case 'ru':
        locale = ru
        break
      case 'th':
        locale = th
        break
      case 'zh-cn':
      case 'zh-tw':
      case 'zh_TW':
      case 'zh_CN':
        locale = zhCN
        break
      default:
        locale = enGB
    }

    LocaleDate.params = { locale }
  }

  static formatDistanceStrict = (time: number, target: number, props = {}) => {
    const params = {
      ...props,
      ...LocaleDate.params,
    }
    return formatDistanceStrict(time, target, params)
  }

  static format = (date: Date | number, formatting: string) =>
    format(date, formatting, LocaleDate.params)
}
