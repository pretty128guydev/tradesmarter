import React from 'react'
import { connect } from 'react-redux'
import { DashboardRatioTradersSpace } from './styled'
import { t } from 'ttag'
import { DashboardCardTitle } from '../styled'
import DonutChart from './DonutChart'
import { IDashboardTradeDate } from '../interfaces'

interface IDashboardRatioTradersProps {
  colors: any
  trades: IDashboardTradeDate
  isMobile: boolean
}

const DashboardRatioTraders = ({
  colors,
  trades,
  isMobile,
}: IDashboardRatioTradersProps) => {
  const { high, low } = Object.values(trades.dates).reduce(
    (prev, curr) => {
      return {
        high: prev.high + curr.highCount,
        low: prev.low + curr.lowCount,
      }
    },
    { high: 0, low: 0 }
  )

  const chartData = [
    {
      y: high,
      name: t`High`,
      color: colors.primary,
    },
    {
      y: low,
      name: t`Low`,
      color: colors.secondary,
    },
  ]

  return (
    <DashboardRatioTradersSpace colors={colors} isMobile={isMobile}>
      <DashboardCardTitle
        colors={colors}
      >{t`High/Low Ratio`}</DashboardCardTitle>
      <DonutChart data={chartData} colors={colors} />
    </DashboardRatioTradersSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps)(DashboardRatioTraders)
