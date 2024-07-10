/**
 * Implements getting default stake when change instrument or gameType
 */
import { isEmpty } from 'lodash'
import { ICurrency, IRegistry, IWalletDetails } from './API'

/**
 * Return object key by value
 */
const getKeyByValue = (object: any, value: any) =>
  Object.keys(object).find((key) => object[key] === value)

/**
 * baseCurrency is string
 */
const getDefaultStake = (
  gameType: number,
  registry: IRegistry,
  wallet: IWalletDetails
) => {
  const {
    currenciesInfo,
    investmentDefaults: { highLow, sixtySeconds, optionsCfd },
    partnerConfig: { baseCurrency },
  } = registry
  let investmentDefault = 0
  switch (gameType) {
    case 12:
      investmentDefault = Number(optionsCfd)
      break
    case 1:
      investmentDefault = Number(highLow)
      break
    case 2:
      investmentDefault = Number(sixtySeconds)
      break
    default:
      investmentDefault = Number(highLow)
  }

  const currency = Object.values(currenciesInfo).find(
    (currency: ICurrency) =>
      currency.currencyName.toLocaleUpperCase() ===
      baseCurrency.toLocaleUpperCase()
  )
  const currencyId = getKeyByValue(currenciesInfo, currency)

  if (currency) {
    if (!isEmpty(wallet) && currencyId !== wallet.currency) {
      investmentDefault = investmentDefault / currency.conversionRate
    }
  }

  return investmentDefault
}

export { getDefaultStake }
