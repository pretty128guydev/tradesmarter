/**
 * Implements a chart overlay
 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ChartLibrary, ChartType } from '../ChartLibraryConfig'
import ChartTradingView from '../../ChartTradingView'
import LightWeightChart from './lightWeightChart'

interface IAdvancedChartProps {
  chartType: ChartType
}

const AdvancedChart = (props: IAdvancedChartProps) => {
  const { chartType } = props

  const [chart, setChart] = useState<ChartLibrary | null>(null)

  useEffect(() => {
    const isCandlestick = chartType === 'candlestick' || chartType === 'ohlc'
    setChart(
      isCandlestick ? ChartLibrary.TradingView : ChartLibrary.LightWeight
    )
  }, [chartType])

  if (chart === ChartLibrary.TradingView) return <ChartTradingView />

  if (chart === ChartLibrary.LightWeight) return <LightWeightChart />

  return <></>
}

const mapStateToProps = (state: any) => ({
  chartType: state.registry.currentChartType,
})

export default connect(mapStateToProps, {})(AdvancedChart)
