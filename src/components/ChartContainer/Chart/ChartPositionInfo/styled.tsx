import styled from 'styled-components'

const PositionOverlay = styled.div`
	position: absolute;
	z-index: 40;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.1);
`

const InfoContainer = styled.div<{
	colors?: any
	direction: number
	x: number
	y: number
}>`
	position: fixed;
	top: ${(props) => props.y}px;
	left: ${(props) => props.x - 176}px;
	z-index: 54;
	margin-top: 20px;
	width: 196px;
	padding: 10px;
	background-color: ${(props) =>
		props.direction === 1
			? props.colors.chart.tradeInfo.high.backgroundColor
			: props.colors.chart.tradeInfo.low.backgroundColor};
`

const DataContainer = styled.div``

const DataRow = styled.div<{ colors?: any; direction: number }>`
	display: flex;
	justify-content: space-between;
	padding: 4px;
	color: ${(props) => props.colors.secondaryText};

	&.highlight {
		background-color: ${(props) =>
			props.direction === 1
				? props.colors.chart.tradeInfo.high.highlight
				: props.colors.chart.tradeInfo.low.highlight};

		.title {
			color: ${(props) =>
				props.direction === 1
					? props.colors.chart.tradeInfo.high.textColor
					: props.colors.chart.tradeInfo.low.textColor};
		}

		.value {
			color: ${(props) => props.colors.primaryText};
		}
	}
`

const RowLabel = styled.div<{ colors?: any }>`
	font-size: 11px;
	color: ${(props) => props.colors.secondaryText};
`

const RowValue = styled.div<{ colors?: any; direction: number }>`
	font-size: 12px;
	color: ${(props) =>
		props.direction === 1
			? props.colors.chart.tradeInfo.high.textColor
			: props.colors.chart.tradeInfo.low.textColor};
`

const SellBackContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10px;
`

const SellBackButton = styled.div<{ colors?: any; direction: number }>`
	height: 24px;
	width: 100%;
	padding: 0 5px;
	margin-left: 10px;
	line-height: 24px;
	border-radius: 2px;
	border: 1px solid
		${(props) =>
			props.direction === 1
				? props.colors.chart.tradeInfo.high.sellBackColor
				: props.colors.chart.tradeInfo.low.sellBackColor};
	color: ${(props) =>
		props.direction === 1
			? props.colors.chart.tradeInfo.high.sellBackColor
			: props.colors.chart.tradeInfo.low.sellBackColor};
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
`

export {
	PositionOverlay,
	InfoContainer,
	DataContainer,
	DataRow,
	RowLabel,
	RowValue,
	SellBackContainer,
	SellBackButton,
}
