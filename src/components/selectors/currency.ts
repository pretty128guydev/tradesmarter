import { createSelector } from 'reselect'
import { formatCurrencyFn } from '../../core/currency'

const wallets = (state: any) => state.wallets
const currencies = (state: any) => state.registry.data.currenciesInfo
const partnerConfig = (state: any) => state.registry.data.partnerConfig
const userInfo = (state: any) => state.account.userInfo
const isGuestDemo = createSelector(userInfo, (userInfo: any) =>
	userInfo ? userInfo.isDemo && userInfo.isDemoActive : false
)
/**
 * Create a function that prioritzes baseCurrency before displayCurrency for guestDemo
 * issue: displayCurrency is not set for guestDemo
 */
const currencyAttributeNameFn = createSelector(isGuestDemo, (demo: boolean) => {
	return (wallets: any) => {
		return demo
			? wallets.baseCurrency || wallets.displayCurrency
			: wallets.displayCurrency || wallets.baseCurrency
	}
})

const getWalletCurrencySymbol = createSelector(
	wallets,
	currencies,
	partnerConfig,
	currencyAttributeNameFn,
	(wallets: any, currencies: any, partnerConfig: any, walletsFn: any) =>
		wallets
			? currencies[walletsFn(wallets)].currencySymbol
			: currencies[partnerConfig.baseCurrency]
			? currencies[partnerConfig.baseCurrency].currencySymbol
			: '$'
)

/**
 * Return precision as number
 * wallets object may not contain displayCurrency
 */
const getCurrencyPrecision = createSelector(
	wallets,
	currencies,
	partnerConfig,
	currencyAttributeNameFn,
	(wallets: any, currencies: any, partnerConfig: any, walletsFn: any) =>
		wallets
			? currencies[walletsFn(wallets)].precision
			: currencies[partnerConfig.baseCurrency]
			? currencies[partnerConfig.baseCurrency].precision
			: '2'
)

/**
 * Returns a function that formats currency in wallet format
 * Use this function from props
 * @param value
 */
const formatCurrency = createSelector(
	getWalletCurrencySymbol,
	getCurrencyPrecision,
	(symbol: any, precision: number) => {
		return (value: number) => {
			return formatCurrencyFn(value, {
				currencySymbol: symbol,
				precision,
			} as any)
		}
	}
)
/**
 * Currency as string
 */
const formatStringCurrency = createSelector(
	getWalletCurrencySymbol,
	(symbol: any) => {
		return (value: string | number) => {
			return `${symbol} ${value}`
		}
	}
)
/**
 * Returns a function that formats currency in wallet format
 * Use this function from props
 * @param value
 */
const formatCurrencyById = createSelector(currencies, (currencies: any) => {
	return (value: string | number, currency: number): string => {
		const currencyObject = currencies[currency]
		if (value === '') {
			return ''
		}
		if (typeof value === 'string') {
			return formatCurrencyFn(parseFloat(value), currencyObject)
		}
		if (!Number.isNaN(value)) {
			return formatCurrencyFn(value, currencyObject)
		}
		return String(value)
	}
})

export {
	getWalletCurrencySymbol,
	formatCurrency,
	formatStringCurrency,
	formatCurrencyById,
	getCurrencyPrecision,
}
