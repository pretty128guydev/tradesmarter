interface IIndicatorProps {
	[key: string]: object
}

const indicatorsProperties: IIndicatorProps = {
	sma: {
		name: 'SMA',
		type: 'sma',
		linkedTo: 'indicator-series',
		color: '#8085e9',
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	bb: {
		name: 'Bolinger Bands',
		type: 'bb',
		linkedTo: 'indicator-series',
		color: '#ac7ec7',
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	rsi: {
		name: 'RSI',
		type: 'rsi',
		linkedTo: 'indicator-series',
		color: '#7ec78c',
		secondChart: true,
		params: {
			decimals: 70,
			period: 30,
		},
		zIndex: 10,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	macd: {
		name: 'MACD',
		type: 'macd',
		linkedTo: 'indicator-series',
		color: '#c76767',
		secondChart: true,
		params: {
			shortPeriod: 12,
			longPeriod: 26,
			signalPeriod: 9,
			period: 26,
		},
		zIndex: 100,
		// cropThreshold: 200,
		// boostThreshold: 200,
		// turboThreshold: 0,
	},
	aroon: {
		name: 'Aroon',
		type: 'aroon',
		linkedTo: 'indicator-series',
		color: 'green',
		lineWidth: 1,
		aroonDown: {
			styles: {
				lineColor: 'red',
			},
		},
		secondChart: true,
		params: {
			period: 25,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	aroonoscillator: {
		type: 'aroonoscillator',
		linkedTo: 'indicator-series',
		color: 'turquoise',
		lineWidth: 1.5,
		style: {
			lineWidth: 5,
		},
		secondChart: true,
		params: {
			period: 14,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	dpo: {
		type: 'dpo',
		linkedTo: 'indicator-series',
		lineWidth: 2,
		marker: {
			enabled: false,
		},
		secondChart: true,
		params: {
			period: 20,
			index: 3,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	ema: {
		type: 'ema',
		linkedTo: 'indicator-series',
		params: {
			period: 50,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	dema: {
		type: 'dema',
		linkedTo: 'indicator-series',
		params: {
			period: 50,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	tema: {
		type: 'tema',
		linkedTo: 'indicator-series',
		params: {
			period: 50,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	trix: {
		type: 'trix',
		linkedTo: 'main-series',
		secondChart: true,
		params: {
			index: 3,
			period: 9,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	apo: {
		type: 'apo',
		linkedTo: 'indicator-series',
		color: 'grey',
		lineWidth: 2,
		secondChart: true,
		params: {
			periods: [10, 20],
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	ppo: {
		type: 'ppo',
		linkedTo: 'indicator-series',
		color: '#001e84',
		lineWidth: 2,
		secondChart: true,
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	roc: {
		type: 'roc',
		linkedTo: 'indicator-series',
		lineWidth: 2,
		secondChart: true,
		params: {
			period: 50,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	wma: {
		type: 'wma',
		linkedTo: 'indicator-series',
		params: {
			period: 50,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	linearRegression: {
		type: 'linearRegression',
		linkedTo: 'indicator-series',
		zIndex: -1,
		params: {
			period: 100,
		},
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	linearRegressionSlope: {
		type: 'linearRegressionSlope',
		linkedTo: 'indicator-series',
		zIndex: -1,
		secondChart: true,
		params: {
			period: 20,
		},
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	linearRegressionIntercept: {
		type: 'linearRegressionIntercept',
		linkedTo: 'indicator-series',
		zIndex: -1,
		secondChart: true,
		params: {
			period: 50,
		},
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	linearRegressionAngle: {
		type: 'linearRegressionAngle',
		linkedTo: 'indicator-series',
		zIndex: -1,
		secondChart: true,
		params: {
			period: 20,
		},
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	abands: {
		type: 'abands',
		linkedTo: 'indicator-series',
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	ao: {
		type: 'ao',
		secondChart: true,
		greaterBarColor: '#00cc66',
		lowerBarColor: '#FF5E5E',
		linkedTo: 'indicator-series',
		showInLegend: true,
		zIndex: 10,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	atr: {
		type: 'atr',
		linkedTo: 'indicator-series',
		secondChart: true,
		params: {
			period: 50,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	cci: {
		type: 'cci',
		linkedTo: 'indicator-series',
		secondChart: true,
		params: {
			period: 50,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	ikh: {
		type: 'ikh',
		linkedTo: 'indicator-series',
		tenkanLine: {
			styles: {
				lineColor: 'lightblue',
			},
		},
		kijunLine: {
			styles: {
				lineColor: 'darkred',
			},
		},
		chikouLine: {
			styles: {
				lineColor: 'lightgreen',
			},
		},
		senkouSpanA: {
			styles: {
				lineColor: 'green',
			},
		},
		senkouSpanB: {
			styles: {
				lineColor: 'red',
			},
		},
		senkouSpan: {
			color: 'rgba(0, 255, 0, 0.3)',
			styles: {
				fill: 'rgba(0, 0, 255, 0.1)',
			},
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	momentum: {
		type: 'momentum',
		linkedTo: 'indicator-series',
		secondChart: true,
		params: {
			period: 14,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	pivotpoints: {
		type: 'pivotpoints',
		linkedTo: 'indicator-series',
		zIndex: 0,
		lineWidth: 1,
		dataLabels: {
			overflow: 'none',
			crop: false,
			y: 4,
			style: {
				fontSize: 9,
			},
		},
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	pc: {
		type: 'pc',
		linkedTo: 'indicator-series',
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	priceenvelopes: {
		type: 'priceenvelopes',
		linkedTo: 'indicator-series',
		secondChart: true,
		zIndex: 10,
		params: {
			index: 0,
			period: 20,
			topBand: 0.1,
			bottomBand: 0.1,
		},
		// threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	psar: {
		type: 'psar',
		linkedTo: 'indicator-series',
		params: {
			index: 4,
		},
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	stochastic: {
		linkedTo: 'indicator-series',
		secondChart: true,
		type: 'stochastic',
		zIndex: 10,
		params: {
			index: 0,
			period: 14,
			periods: [14, 3],
		},
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
	williamsr: {
		type: 'williamsr',
		linkedTo: 'indicator-series',
		secondChart: true,
		color: 'green',
		lineWidth: 1.5,
		marker: {
			enabled: false,
		},
		params: {
			period: 14,
		},
		zones: [
			{
				value: -80,
				color: 'green',
			},
			{
				value: -20,
				color: '#bbb',
			},
		],
		zIndex: 10,
		threshold: null,
		cropThreshold: 2000,
		turboThreshold: 0,
	},
}

export default indicatorsProperties
