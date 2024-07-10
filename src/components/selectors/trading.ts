import { ProductType } from '../../reducers/trading'

export const isCfdOptionsVisible = (state: any): boolean =>
  state.registry.data.optionCfdGames?.length > 0

export const isAboveBelowVisible = (state: any): boolean =>
  state.registry.data.aboveBelowGames?.length > 0

export const isCfdOptionsProductType = (state: any): boolean =>
  state.trading.selectedProductType === ProductType.cfdOptions

export const isAboveBelowProductType = (state: any): boolean =>
  state.trading.selectedProductType === ProductType.aboveBelow

export const getProductTypes = (
  country: string,
  enabledPlatformTypes: string[],
  platformTypeDisableCountries: any,
  isLoggedIn: boolean
) => {
  const { options, options_cfd } = platformTypeDisableCountries
  let productTypes = [
    ProductType.highLow,
    ProductType.cfdOptions,
    ProductType.aboveBelow,
  ]

  if (isLoggedIn) {
    return productTypes
  }

  const isDisabledOptions = enabledPlatformTypes
    ? !enabledPlatformTypes.includes('options')
    : options.split(',').includes(country)

  const isDisabledCfd = enabledPlatformTypes
    ? !enabledPlatformTypes.includes('options_cfd')
    : options_cfd.split(',').includes(country)

  if (isDisabledOptions) {
    productTypes = productTypes.filter((i) => i !== ProductType.highLow)
  }

  if (isDisabledCfd) {
    productTypes = productTypes.filter((i) => i !== ProductType.cfdOptions)
  }

  return productTypes
}
