enum ChartPlotBands {
	quote = 'quote-band',
}

const quoteBand = (
	from: number,
	to: number,
	linearY2: any,
	linearY1: any,
	direction: number,
	takeProfitBuyBandStartColor: string,
	takeProfitSellBandStartColor: string,
	takeProfitBuyBandEndColor: string,
	takeProfitSellBandEndColor: string,
	isCfdOptions: boolean,
	isMobile: boolean
) => ({
	id: ChartPlotBands.quote,
	from,
	to,
	zIndex: 2,
	color: {
		linearGradient: { x1: 0, x2: 0, y1: linearY2, y2: linearY1 },
		stops: [
			[
				0,
				direction === 1
					? takeProfitBuyBandStartColor
					: takeProfitSellBandStartColor,
			],
			[
				1,
				direction === 1
					? takeProfitBuyBandEndColor
					: takeProfitSellBandEndColor,
			],
		],
	},
	label: {
		text: isCfdOptions ? 'PROFIT' : null,
		style: {
			color:
				direction === 1
					? takeProfitBuyBandEndColor
					: takeProfitSellBandEndColor,
			fontSize: isMobile ? 50 : 100,
			fontWeight: 900,
		},
		align: 'center',
		textAlign: 'center',
		verticalAlign: 'middle',
	},
})

export { ChartPlotBands, quoteBand }
