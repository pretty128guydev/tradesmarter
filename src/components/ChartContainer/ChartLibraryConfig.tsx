import { findIndex } from 'lodash'
import { t } from 'ttag'

export interface ChartLibraryConfig {
  allowedLibraries: ChartLibrary[]
  defaultLibrary: ChartLibrary
}

export enum ChartLibrary {
  Basic = '1',
  LightWeight = '2',
  TradingView = '3',
}

export enum ChartType {
  line = 'line',
  area = 'area',
  candlestick = 'candlestick',
  ohlc = 'ohlc',
  heikinashi = 'heikinashi',
}

export function getNextChart(
  chartLibraryConfig: ChartLibraryConfig,
  currentChart: ChartLibrary
): ChartLibrary {
  const currentIndex = findIndex(
    chartLibraryConfig.allowedLibraries,
    (c) => c === currentChart
  )
  if (currentIndex === chartLibraryConfig.allowedLibraries.length - 1) {
    return chartLibraryConfig.allowedLibraries[0]
  } else {
    return chartLibraryConfig.allowedLibraries[currentIndex + 1]
  }
}

export function getNextChartName(
  chartLibraryConfig: ChartLibraryConfig,
  currentChart: ChartLibrary
) {
  const nextChart = getNextChart(chartLibraryConfig, currentChart)
  switch (nextChart) {
    case ChartLibrary.Basic:
      return t`Basic Chart`
    case ChartLibrary.LightWeight:
      return t`Trading View`
    case ChartLibrary.TradingView:
      return t`Advanced Chart`
    default:
      break
  }
}

export function getNextChartTooltip(
  chartLibraryConfig: ChartLibraryConfig,
  currentChart: ChartLibrary
) {
  const nextChart = getNextChart(chartLibraryConfig, currentChart)
  switch (nextChart) {
    case ChartLibrary.Basic:
      return t`Switch to Basic Chart`
    case ChartLibrary.LightWeight:
      return t`Switch to Trading View`
    case ChartLibrary.TradingView:
      return t`Switch to Advanced Chart`
    default:
      break
  }
}

export function getCurrentChartName(currentChart: ChartLibrary) {
  switch (currentChart) {
    case ChartLibrary.Basic:
      return t`Basic Chart`
    case ChartLibrary.LightWeight:
      return t`Trading View`
    case ChartLibrary.TradingView:
      return t`Advanced Chart`
    default:
      break
  }
}

export function getCurrentChartTooltip(currentChart: ChartLibrary) {
  switch (currentChart) {
    case ChartLibrary.Basic:
      return t`Switch to Basic Chart`
    case ChartLibrary.LightWeight:
      return t`Switch to Trading View`
    case ChartLibrary.TradingView:
      return t`Switch to Advanced Chart`
    default:
      break
  }
}
