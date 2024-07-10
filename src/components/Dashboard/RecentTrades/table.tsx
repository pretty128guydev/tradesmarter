import React from 'react'
import { connect } from 'react-redux'
import { IClosedTrade } from '../../../core/interfaces/trades'
import { t } from 'ttag'
import {
	RecentTradesTableColumn,
	RecentTradesTableHeader,
	RecentTradesTableRow,
	RecentTradesTableSpace,
	RecentTradesTableTBody,
	RecentTradesTableTHead,
} from './styled'
import { getClosedMoneyStateString } from '../../Sidebar/services/TradeStatus'
import { formatStringCurrency } from '../../selectors/currency'
import { LocaleDate } from '../../../core/localeFormatDate'

interface IRecentTradesTableProps {
	colors: any
	closedTrades: IClosedTrade[]
	formatStringCurrency: (value: string) => string
}

const RecentTradesTable = ({
	colors,
	closedTrades,
	formatStringCurrency,
}: IRecentTradesTableProps) => {
	return (
		<RecentTradesTableSpace>
			<RecentTradesTableTHead>
				<RecentTradesTableRow>
					<RecentTradesTableHeader colors={colors} widthPercent={10}>
						<span>{t`id`}</span>
					</RecentTradesTableHeader>
					<RecentTradesTableHeader colors={colors} widthPercent={17}>
						<span>{t`trade time`}</span>
					</RecentTradesTableHeader>
					<RecentTradesTableHeader colors={colors} widthPercent={17}>
						<span>{t`expiry time`}</span>
					</RecentTradesTableHeader>
					<RecentTradesTableHeader colors={colors} widthPercent={11}>
						<span>{t`asset`}</span>
					</RecentTradesTableHeader>
					<RecentTradesTableHeader colors={colors} widthPercent={11}>
						<span>{t`investment`}</span>
					</RecentTradesTableHeader>
					<RecentTradesTableHeader colors={colors} widthPercent={9}>
						<span>{t`payout`}</span>
					</RecentTradesTableHeader>
					<RecentTradesTableHeader colors={colors} widthPercent={12}>
						<span>{t`status`}</span>
					</RecentTradesTableHeader>
					<RecentTradesTableHeader colors={colors} widthPercent={11}>
						<span>{t`return`}</span>
					</RecentTradesTableHeader>
				</RecentTradesTableRow>
			</RecentTradesTableTHead>
			<RecentTradesTableTBody className="scrollable">
				{closedTrades.map((item, key) => (
					<RecentTradesTableRow key={key}>
						<RecentTradesTableColumn
							colors={colors}
							widthPercent={10}
							minWidth={65}
						>
							<span>{item.tradeID}</span>
						</RecentTradesTableColumn>
						<RecentTradesTableColumn
							colors={colors}
							widthPercent={17}
							minWidth={111}
						>
							<span>
								{LocaleDate.format(
									item.createdTimestamp,
									'dd/MM/u HH:mm'
								)}
							</span>
						</RecentTradesTableColumn>
						<RecentTradesTableColumn
							colors={colors}
							widthPercent={17}
							minWidth={111}
						>
							<span>
								{LocaleDate.format(
									item.expiryTimestamp,
									'dd/MM/u HH:mm'
								)}
							</span>
						</RecentTradesTableColumn>
						<RecentTradesTableColumn
							colors={colors}
							widthPercent={11}
							minWidth={70}
						>
							<span>{item.instrumentName}</span>
						</RecentTradesTableColumn>
						<RecentTradesTableColumn
							colors={colors}
							widthPercent={11}
							minWidth={72}
						>
							<span>
								{formatStringCurrency(
									String(item.userCurrencyStake)
								)}
							</span>
						</RecentTradesTableColumn>
						<RecentTradesTableColumn
							colors={colors}
							widthPercent={9}
							minWidth={60}
						>
							<span>{item.payout}%</span>
						</RecentTradesTableColumn>
						<RecentTradesTableColumn
							colors={colors}
							widthPercent={12}
							minWidth={76}
						>
							<span>
								{getClosedMoneyStateString(item.status)}
							</span>
						</RecentTradesTableColumn>
						<RecentTradesTableColumn
							colors={colors}
							widthPercent={11}
							minWidth={72}
						>
							<span>
								{formatStringCurrency(
									String(item.userCurrencyReturn)
								)}
							</span>
						</RecentTradesTableColumn>
					</RecentTradesTableRow>
				))}
			</RecentTradesTableTBody>
		</RecentTradesTableSpace>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	closedTrades: state.trades.closed,
	formatStringCurrency: formatStringCurrency(state),
})

export default connect(mapStateToProps)(RecentTradesTable)
