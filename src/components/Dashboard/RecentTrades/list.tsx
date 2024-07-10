import React from 'react'
import { connect } from 'react-redux'
import { IClosedTrade } from '../../../core/interfaces/trades'
import { formatCurrency, formatStringCurrency } from '../../selectors/currency'
import ClosedPositionItem from '../../Sidebar/PositionsPanel/ClosedPositionItem'
import { RecentTradesListSpace } from './styled'

interface IRecentTradesTableProps {
	colors: any
	closedTrades: IClosedTrade[]
	selectedTrade: any
	selectedInstrument: number | null
	formatCurrency: any
	formatStringCurrency: (value: string | number) => string
}

const RecentTradesList = ({
	colors,
	closedTrades,
	selectedTrade,
	formatStringCurrency,
	selectedInstrument,
	formatCurrency,
}: IRecentTradesTableProps) => {
	return (
		<RecentTradesListSpace>
			{closedTrades.map((position: IClosedTrade, index: number) => {
				return (
					<ClosedPositionItem
						isOpen={
							selectedTrade &&
							selectedTrade.tradeID === position.tradeID
						}
						colors={colors}
						key={index}
						selected={
							Number(position.instrumentID) === selectedInstrument
						}
						formatCurrency={formatCurrency}
						formatStringCurrency={formatStringCurrency}
						position={position}
					/>
				)
			})}
		</RecentTradesListSpace>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	selectedInstrument: Number(state.trading.selected),
	selectedTrade: state.trades.selected,
	formatCurrency: formatCurrency(state),
	formatStringCurrency: formatStringCurrency(state),
})

export default connect(mapStateToProps)(RecentTradesList)
