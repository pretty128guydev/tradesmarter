import Cookies from 'js-cookie'

enum CookiesKeys {
  userLanguage = 'userLanguage',
}

class UserCookies {
  public static setLanguage = (language: string) =>
    Cookies.set(CookiesKeys.userLanguage, language)
  public static getLanguage = () => Cookies.get(CookiesKeys.userLanguage)
}

export default UserCookies
