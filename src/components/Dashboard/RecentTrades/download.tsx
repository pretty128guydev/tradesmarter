import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { RecentTradesDownload } from './styled'
import { getClosedMoneyStateString } from '../../Sidebar/services/TradeStatus'
import { LocaleDate } from '../../../core/localeFormatDate'
import { api } from '../../../core/createAPI'

interface IDashboardRecentTradesProps {
	colors: any
}

const fetchTrades = async () => {
	const millisecondsInDay = 86400000

	try {
		const params = {
			advanced: 1,
			openPositions: 0,
			pageSize: 1000000,
			from: LocaleDate.format(0, 'yyyy-MM-dd'),
			to: LocaleDate.format(Date.now() + millisecondsInDay, 'yyyy-MM-dd'),
		}
		const {
			closed: { rows },
		} = await api.fetchTrades(params)
		return rows
	} catch (err) {
		console.log(err)
	}
}

const DashboardDownload = ({ colors }: IDashboardRecentTradesProps) => {
	const onDownloadClick = async () => {
		const trades = await fetchTrades()

		if (trades) {
			const universalBOM = '\uFEFF'
			const csvContent =
				'data:text/csv;charset=utf-8,' +
				encodeURIComponent(
					universalBOM +
						'Trade ID,' +
						'Trade Time,' +
						'Expiry Time,' +
						'Asset,' +
						'Investment,' +
						'Payout,' +
						'Status,' +
						'Return\n' +
						trades
							.map((trade: any) => [
								trade.tradeID,
								LocaleDate.format(
									trade.createdTimestamp,
									'do MMM yyyy HH:mm'
								),
								LocaleDate.format(
									trade.expiryTimestamp,
									'do MMM yyyy HH:mm'
								),
								trade.instrumentName,
								trade.stake,
								trade.payout,
								getClosedMoneyStateString(trade.status),
								trade.return,
							])
							.join('\n')
				)
			const link = document.createElement('a')
			link.setAttribute('href', csvContent)
			link.setAttribute('download', 'transactions.csv')
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}

	return (
		<RecentTradesDownload
			colors={colors}
			onClick={() => onDownloadClick()}
		>{t`Download`}</RecentTradesDownload>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
})

export default connect(mapStateToProps)(DashboardDownload)
