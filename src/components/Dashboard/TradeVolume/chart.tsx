import React from 'react'
import { connect } from 'react-redux'
import { TradeVolumeChartSpace } from './styled'
import { DashboardCardTitle } from '../styled'
import { t } from 'ttag'
import BarChart from './BarChart'
import { IDashboardTrade } from '../interfaces'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import { LocaleDate } from '../../../core/localeFormatDate'

interface ITradeVolumeChartProps {
	colors: any
	currencySymbol: string
	trades: { [key: string]: IDashboardTrade }
}

const DAY_TIME_STEP = 1000 * 60 * 60 * 24 // milliseconds * seconds * hour * day
const STATISTIC_DATES = 30

const chartData = (list: { [key: string]: IDashboardTrade }, colors: any) => {
	const todayDate = new Date()
	const date = todayDate.getTime() + todayDate.getTimezoneOffset() * 60 * 1000 //milliseconds in minute

	return new Array(STATISTIC_DATES).fill('').map((item, index) => {
		const searchDate = date - index * DAY_TIME_STEP
		const chartDate = LocaleDate.format(searchDate, 'yyyy-MM-dd')
		const dayData = list[chartDate]
		const value = {
			name: LocaleDate.format(searchDate, 'MM/dd'),
			x: searchDate,
			y: 0,
			color: colors.primary,
		}

		if (dayData) {
			value.y = dayData.highVolume + dayData.lowVolume
		}

		return value
	})
}

const TradeVolumeChart = ({
	colors,
	trades,
	currencySymbol,
}: ITradeVolumeChartProps) => {
	const data = chartData(trades, colors)
	return (
		<TradeVolumeChartSpace colors={colors}>
			<DashboardCardTitle
				colors={colors}
			>{t`Volume Per Day`}</DashboardCardTitle>
			<BarChart data={data} currencySymbol={currencySymbol} />
		</TradeVolumeChartSpace>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	currencySymbol: getWalletCurrencySymbol(state),
})

export default connect(mapStateToProps)(TradeVolumeChart)
