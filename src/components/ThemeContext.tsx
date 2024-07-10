/**
 * Implements a theme provider
 * defaultTheme - js object contains styles/colors
 */
import React from 'react'
import { connect } from 'react-redux'

export const defaultTheme = {
	background: '#06141f', // background color
	panelBackground: '#141f2c', // panel color
	panelBorder: '#263346', // panel border
	modalBackground: '#1e2836', // modal background
	listBackgroundActive: '#1c2837',
	listBackgroundNormal: '#0f1721',
	sidebarBorder: '#38424d',
	sidebarElementActive: '#1d2834',
	sidebarLabelText: '#8b9097',
	sidebarDisabled: '#8191a5',
	payout: '#75f986',
	primary: '#75f986', // green button
	primaryText: '#ffffff', // captions
	primaryTextContrast: '#031420', // text
	secondary: '#ff0062', // red button
	secondaryText: '#8491a3', // sub captions,
	secondarySubText: '#e0e1e2', // navbar user name
	textfieldBackground: '#0d1722', // input background
	textfieldText: '#9fabbd', // input text,
	expiryGroupBackground: '#152434', // background of expiry group
	assetsSelector: '#06141F', // background of asset selector
	tradebox: {
		background: '#06141f',
		fieldBackground: '#06141f',
		widgetBackground: '#1d2834',
		expiryBackground: '#06141f',
		highText: '#75f986',
		lowText: '#ff0062',
		highlowDepressedTextColor: '#031420',
		highActive: '#75f986',
		highNormal: '#1d6b45',
		highHover:
			'linear-gradient(to bottom, rgba(117, 249, 134, 0.8), #3d9f5d 53%, #1d6b45)',
		highDepressed: '#1d6b45',
		lowActive: '#ff0062',
		lowNormal: '#61253a',
		lowHover:
			'linear-gradient(to bottom, rgba(255, 0, 98, 0.8), #a6154c 49%, #61253a)',
		lowDepressed: '#61253a',
		btnDisabled: '#1d6b45',
		btnDisabledText: 'rgba(3, 20, 32, 0.8)',
		btnNormal: '#75f986',
		btnNormalText: '#031420',
		investmentButton: '#031420',
		marketPrice: '#031420',
		oneClickTradeText: '#A2A2A2',
	},
	chart: {
		xAxis: {
			gridLineColor: '#263346',
			lineColor: '#263346',
		},
		crosshair: {
			color: '#FFFFFF',
		},
		yAxis: {
			gridLineColor: '#263346',
			lineColor: '#263346',
		},
		series: {
			markerFillColor: '#FFFFFF',
		},
		plotOptions: {
			line: {
				color: '#75f986',
			},
			area: {
				color: '#75f986',
				linearGradientUp: 'rgba(117, 249, 134, 0.5)',
				linearGradientDown: 'rgba(117, 249, 134, 0)',
			},
			ohlc: {
				color: '#75f986',
			},
			candlestick: {
				color: '#ff3364',
				lineColor: '#ff3364',
				upColor: '#75f986',
				upLineColor: '#75f986',
			},
			flags: {
				backgroundColor: '#1d2834',
				closedColor: '#FFFFFF',
				breakEvenColor: '#FFFFFF',
			},
		},
		tooltip: {
			backgroundColor: '#06141f',
			color: '#ffffff',
		},
		navigator: {
			seriesLineColor: '#75f986',
			outlineColor: 'transparent',
			maskFill: '#141f2c',
		},
		pulseMarker: {
			color: '#75f986',
		},
		priceLine: {
			color: '#75f986',
		},
		expiryLine: {
			color: '#FFFFFF',
		},
		deadPeriodLine: {
			color: '#FFFFFF',
		},
		quoteBand: {
			upGradient0: 'rgba(117, 249, 134, 0)',
			upGradient1: 'rgba(117, 249, 134, 0.2)',
			downGradient0: 'rgba(255, 51, 100, 0)',
			downGradient1: 'rgba(255, 51, 100, 0.2)',
		},
		countDown: {
			filledColorUp: '#75f986',
			filledColorMiddle: '#ffda47',
			filledColorDown: '#ff0062',
			normalColor: 'transparent',
			textColor: '#75f986',
			backgroundColor: '#06141f',
		},
		tradeInfo: {
			high: {
				backgroundColor: 'rgba(9, 50, 30, 0.6)',
				textColor: '#75f986',
				highlight: '#1d6b45',
				sellBackColor: '#75f986',
			},
			low: {
				backgroundColor: 'rgba(70, 23, 40, 0.7)',
				textColor: '#ff0062',
				highlight: '#61253a',
				sellBackColor: '#ff0062',
			},
		},
		balloon: {
			high: {
				backgroundColor: '#06141f',
				textColor: '#75f986',
			},
			low: {
				backgroundColor: '#06141f',
				textColor: '#ff0062',
			},
		},
		indicators: {
			sma: '#90ed7d',
			bb: '#434348',
			rsi: '#90ed7d',
			macd: '#f7a35c',
			aroon: '#8085e9',
			aroonoscillator: '#f15c80',
			dpo: '#e4d354',
			ema: '#2b908f',
			dema: '#f45b5b',
			tema: '#91e8e1',
			trix: '#7cb5ec',
			apo: '#434348',
			ppo: '#90ed7d',
			roc: '#f7a35c',
			wma: '#8085e9',
			linearRegression: '#f15c80',
			linearRegressionSlope: '#e4d354',
			linearRegressionIntercept: '#e4d354',
			linearRegressionAngle: '#2b908f',
			abands: '#f45b5b',
			ao: '#91e8e1',
			atr: '#7cb5ec',
			cci: '#434348',
			momentum: '#f7a35c',
			pivotpoints: '#2b908f',
			pc: '#f45b5b',
			priceenvelopes: '#90ed7d',
			psar: '#8085e9',
		},
		plotBorderColor: '#1d2834',
	},
	leftPanel: {
		itemBackground: '#06141F',
		textColor: '#66707A',
	},
}

/**
 * Default provider/consumer pair
 */
const { Provider, Consumer } = React.createContext(defaultTheme)
/**
 * Entry component
 */
class ThemeContextRaw extends React.Component<any, any> {
	constructor(props: any) {
		super(props)
		this.state = {
			theme: defaultTheme,
		}
	}

	/**
	 * Update state from redux store
	 * @param props
	 * @param state
	 */
	static getDerivedStateFromProps = (props: any, state: any) => {
		return { theme: props.theme }
	}

	render() {
		return (
			<Provider value={this.state.theme}>{this.props.children}</Provider>
		)
	}
}
const ThemeContextProvider = connect((state: any) => ({ theme: state.theme }))(
	ThemeContextRaw
)

export { ThemeContextProvider, Consumer as ThemeContextConsumer }
/**
 * Compability API for useContext
 */
const ThemeContext = {
	Provider: ThemeContextProvider,
	Consumer,
}
export default ThemeContext
