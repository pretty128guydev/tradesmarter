/* eslint-disable react-hooks/rules-of-hooks */

import UserCookies from './UserCookies'
import UserStorage from './UserStorage'
import { langFromURL } from './i18n'
import { addLocale, useLocale } from 'ttag'
import { LocaleDate } from './localeFormatDate'
import { store } from '../store'
import { actionConnect } from '../actions/registry'
import { updateApiLang } from './createAPI'

/**
 * Setup language into cookies and localStorage
 * ... reload a platform
 * @param selectedLang
 */
export const onLanguageSelect = (selectedLang: string) => {
  UserCookies.setLanguage(selectedLang)
  UserStorage.setLanguage(selectedLang)
  /**
   * If there are language in URL than update URL
   */
  if (langFromURL) {
    const urlSearchParams = new URLSearchParams(window.location.search)
    urlSearchParams.set('lang', selectedLang)
    window.location.search = urlSearchParams.toString()
  } else {
    // window.location.reload()
    try {
      const translationsObj = require(`./translations/${selectedLang}.po.json`)
      addLocale(selectedLang, translationsObj)
      useLocale(selectedLang)
      LocaleDate.setLocale(selectedLang)
      updateApiLang(selectedLang)
      store.dispatch(actionConnect())
    } catch (e) {
      console.warn(
        `missing locale: ${selectedLang}, falling back to english locale`
      )
      const translationsObj = require(`./translations/en.po.json`)
      addLocale('en', translationsObj)
      useLocale('en')
      LocaleDate.setLocale('en')
      updateApiLang('en')
      store.dispatch(actionConnect())
    }
  }
}
