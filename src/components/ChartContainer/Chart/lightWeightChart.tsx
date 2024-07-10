/**
 * Implements a Chart wrapper
 * Chart is HighStock deattached from react
 * Each time when we need to rerender chart (received a new props) - pass new properties
 */
import React, { Component } from 'react'
import { createChart, LastPriceAnimationMode } from 'lightweight-charts'
import { chartPeriodOptions, chartPeriodOptionsMobile, IPeriod } from './period'
import MobileInstrumentsBar from '../MobileInstrumentsBar'
import { MobileTimeFrames, TimeFrameItem } from './styled'
import ChartControls from './ChartControls'
import ChartBottomPanel from './ChartBottomPanel'
import Sentiment from './Sentiment'
import GlobalLoader from '../../ui/GlobalLoader'
import { IClosedTrade, IOpenTrade } from '../../../core/interfaces/trades'
import { IGame } from '../../../reducers/games'
import { ICandle, ICfdOptionsInstrument, IInstrument } from '../../../core/API'
import { SidebarState } from '../../../reducers/sidebar'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import {
  getInstrumentName,
  getInstrumentObject,
  lastPriceForSelectedInstrument,
  lastQuoteForSelectedInstrument,
} from '../../selectors/instruments'
import { isLoggedIn } from '../../selectors/loggedIn'
import axios from 'axios'
import { api } from '../../../core/createAPI'
import { chain, dropRight, isEqual, last } from 'lodash'
import { IIndicatorMenuItem } from './ChartIndicators/menuItems'
import { isMobileLandscape } from '../../../core/utils'
import {
  actionSelectExpiry,
  actionDeselectExpiry,
} from '../../../actions/expiry'
import { actionChangeChartLibrary } from '../../../actions/registry'
import { actionSetSidebar } from '../../../actions/sidebar'
import { actionSetSelectedTrade } from '../../../actions/trades'
import { actionSelectNextExpiry } from '../../../actions/game'
import { formatCurrencyById } from '../../selectors/currency'
import { store } from '../../../store'
import ChartPositionInfo from './ChartPositionInfo'
import Backdrop from '../../Backdrop'
import EventEmitter from '../../../core/EventEmitter'
import {
  ChartLibraryConfig,
  ChartLibrary,
  ChartType,
} from '../ChartLibraryConfig'
import { ContainerState } from '../../../reducers/container'
import { isCfdOptionsProductType } from '../../selectors/trading'
import { t } from 'ttag'
import { Background } from '../../../App'

export const IndicatorsContext = React.createContext<any>({})

interface IChartProps {
  instrument: string
  instrumentName: string
  instrumentObject: IInstrument
  lastPrice: any
  lastQuote: any
  openTrades: IOpenTrade[]
  closedTrades: IClosedTrade[]
  game: IGame | null
  time: number
  direction: number
  cfdDirection: number
  hoveredDirection: number
  isMobile: boolean
  loggedIn: boolean
  chartConfig: any
  theme: any
  selectedExpiry: number
  isCfdOptions: boolean
  selectedCfdOptionInstrument: ICfdOptionsInstrument | null
  selectedCfdOptionExpiry: number | null
  actionSetSidebar: (state: SidebarState, props?: any) => void
  actionSelectExpiry: (expiry: number | null) => void
  actionDeselectExpiry: () => void
  actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => void
  actionSelectNextExpiry: () => void
  chartLibraryConfig: ChartLibraryConfig
  currentChartLibrary: ChartLibrary
  actionChangeChartLibrary: (chartLibrary: ChartLibrary) => void
  showBottomPanel: boolean
  bottomPanelHeight: number
  container: ContainerState
  showSideMenu: boolean
  collapsedSideMenu: boolean
  currentChartType: ChartType
  tradingPanelType: string
  isPosition: boolean
}

/**
 * Container which will hold chart and overlay
 */
export const ChartPanel = styled.div<{
  isMobile: boolean
  colors: any
}>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? 'column' : 'row')};
  width: ${(props) => (props.isMobile ? '100vw' : 'unset')};
  ${(props) =>
    props.isMobile
      ? css`
          background-color: ${props.colors.tradebox.widgetBackground};
        `
      : css``}
  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            background-color: #141f2c !important;
          }
        `
      : css``}
`

const ChartArea = styled.div<{
  loggedIn: boolean
  isMobile: boolean
}>`
  flex: 1;
  display: flex;
  ${(props) =>
    props.isMobile
      ? window.innerHeight < 800
        ? css`
            height: 365px;
            ${isMobileLandscape(props.isMobile)
              ? css`
                  @media (orientation: landscape) {
                    height: calc(
                      ${window.innerHeight}px -
                        ${({ loggedIn }: any) => (loggedIn ? 142 : 98)}px
                    );
                  }
                `
              : ``}
          `
        : css`
            height: calc(${window.innerHeight}px - 400px);
            ${isMobileLandscape(props.isMobile)
              ? css`
                  @media (orientation: landscape) {
                    height: calc(
                      ${window.innerHeight}px -
                        ${({ loggedIn }: any) => (loggedIn ? 142 : 98)}px
                    );
                  }
                `
              : ``}
          `
      : css``}
  #chart-container {
    ${(props) =>
      props.isMobile
        ? window.innerHeight < 800
          ? css`
              height: 365px;
              ${isMobileLandscape(props.isMobile)
                ? css`
                    @media (orientation: landscape) {
                      height: calc(
                        ${window.innerHeight}px -
                          ${({ loggedIn }: any) => (loggedIn ? 142 : 98)}px
                      );
                    }
                  `
                : ``}
            `
          : css`
              height: calc(${window.innerHeight}px - 440px);
              ${isMobileLandscape(props.isMobile)
                ? css`
                    @media (orientation: landscape) {
                      height: calc(
                        ${window.innerHeight}px -
                          ${({ loggedIn }: any) => (loggedIn ? 142 : 98)}px
                      );
                    }
                  `
                : ``}
            `
        : css`
            padding-top: 80px;
            height: calc(100% - 80px);
          `}
  }
`

interface ICandleLightWeight {
  time: number
  open: number
  high: number
  low: number
  close: number
  value: number
}

interface IChartState {
  ready: boolean // chart ready for updates
  loading: boolean // show loader instead of chart
  error: boolean // hide chart component
  navigator: boolean // show navigator
  candles: any[]
  annotationsCount: number
  visibleAnnotations: number
  lastPrice: any
  expiry: number
  deadPeriod: number
  countDownExpectedTime: number
  direction: any
  timeframe: IPeriod
  chartType: ChartType
  periodOptions: IPeriod[]
  zoomLevels: number[]
  zoomLevel: number
  indicators: any[]
  clickedIndicator: any
  clickedIndicatorX: any
  clickedIndicatorY: any
  clickedTrade: any
  clickedTradeX: any
  clickedTradeY: any
  isScrolling: boolean
}

let fetchCandlesCancelToken: any = null

const mountChart = (
  data: ICandle[],
  component: any,
  chartConfig: any,
  theme: any,
  isMobile: boolean
) => {
  const instance = createChart('chart-container', {
    layout: {
      background: { color: 'transparent' },
      textColor: theme.tooltip.color,
    },
    rightPriceScale: {
      borderColor: theme.tooltip.backgroundColor,
    },
    timeScale: {
      borderColor: theme.tooltip.backgroundColor,
      timeVisible: true,
      secondsVisible: true,
    },
    grid: {
      vertLines: {
        color: theme.yAxis.gridLineColor,
      },
      horzLines: {
        color: theme.xAxis.gridLineColor,
      },
    },
    localization: {
      dateFormat: 'dd/MM/yyyy',
    },
  })

  return instance
}

/**
 * Main component which holds chart state like candles, zoom level
 */
class LightWeightChart extends Component<IChartProps, IChartState> {
  chartInstance: any | null
  chartSeries: any | null
  tooltipChart: any | null
  eventEmitter: any | null

  constructor(props: IChartProps) {
    super(props)
    const chartType = this.props.currentChartType
    /**
     * Set tick timeframe for line, area chart
     * candles and bars will be 1m
     */
    const timeframe = ['area', 'line'].includes(chartType)
      ? chartPeriodOptions[0]
      : chartPeriodOptions[1]

    this.state = {
      loading: true,
      error: false,
      ready: false,
      navigator: !props.isMobile,
      candles: [],
      annotationsCount: 0,
      visibleAnnotations: 0,
      lastPrice: null,
      expiry: 0,
      deadPeriod: 0,
      countDownExpectedTime: 0,
      direction: null,
      indicators: [],
      clickedIndicator: null,
      clickedIndicatorX: null,
      clickedIndicatorY: null,
      clickedTrade: null,
      clickedTradeX: null,
      clickedTradeY: null,
      periodOptions: chartPeriodOptions,
      zoomLevels: props.isMobile
        ? [
            1.01, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45,
            0.4, 0.35, 0.3, 0.25, 80, 60, 50, 25,
          ]
        : [
            1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4,
            0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05,
          ],
      zoomLevel: 19,
      timeframe,
      chartType,
      isScrolling: false,
    }

    this.chartInstance = null
  }

  getMinMove = () => {
    const { precision } = this.props.instrumentObject
    let minMove = ''
    for (let index = 0; index < precision; index++) {
      minMove = `${minMove}0`
    }
    return Number(minMove.slice(0, 1) + '.' + minMove.slice(1) + '1')
  }

  setChartData = (candles: number[][]) => {
    this.chartSeries.setData(candles)
    const { precision } = this.props.instrumentObject
    const minMove = this.getMinMove()

    this.chartSeries.applyOptions({
      priceFormat: {
        type: 'price',
        precision: precision,
        minMove,
      },
    })
  }

  createChartSeries = (chartType: string) => {
    this.chartInstance &&
      this.chartSeries &&
      this.chartInstance.removeSeries(this.chartSeries)
    switch (chartType) {
      case 'candlestick':
        this.chartSeries = this.chartInstance.addCandlestickSeries({
          upColor: this.props.theme.chart.plotOptions.candlestick.upColor,
          wickUpColor: this.props.theme.chart.plotOptions.candlestick.upColor,
          downColor: this.props.theme.chart.plotOptions.candlestick.color,
          wickDownColor: this.props.theme.chart.plotOptions.candlestick.color,
          borderVisible: false,
        })
        if (this.state.candles[0].close) this.setChartData(this.state.candles)
        break
      case 'line':
        this.chartSeries = this.chartInstance.addLineSeries({
          color: this.props.theme.chart.priceLine.color,
          lastPriceAnimation: LastPriceAnimationMode.Continuous,
        })
        this.setChartData(this.state.candles)
        break
      case 'ohlc':
        this.chartSeries = this.chartInstance.addBarSeries({
          upColor: this.props.theme.chart.plotOptions.ohlc.color,
          downColor: this.props.theme.chart.plotOptions.ohlc.color,
        })
        if (this.state.candles[0].close) this.setChartData(this.state.candles)
        break
      default:
        this.chartSeries = this.chartInstance.addAreaSeries({
          topColor: this.props.theme.chart.plotOptions.area.linearGradientUp,
          bottomColor:
            this.props.theme.chart.plotOptions.area.linearGradientDown,
          lineColor: this.props.theme.chart.plotOptions.area.color,
          lineWidth: 2,
          lastPriceAnimation: LastPriceAnimationMode.Continuous,
        })
        this.setChartData(this.state.candles)
        break
    }
    this.onRenderTrades()
  }

  /**
   * If chart instance is defined - set data
   * otherwise - create chart instance
   */
  createOrUpdateChart = () => {
    if (this.chartInstance) {
      this.setChartData(this.state.candles)
    } else {
      this.chartInstance = mountChart(
        this.state.candles,
        this,
        this.props.chartConfig,
        this.props.theme.chart,
        this.props.isMobile
      )
      this.onChartResize()
      this.createChartSeries(this.state.chartType)
      const dateTo = new Date()
      const timeTo = Math.floor(
        Date.UTC(
          dateTo.getFullYear(),
          dateTo.getMonth(),
          dateTo.getDate(),
          dateTo.getHours(),
          dateTo.getMinutes(),
          dateTo.getSeconds(),
          dateTo.getMilliseconds()
        ) / 1000
      )
      const dateFrom = new Date(Date.now() - 1000 * 300)
      const timeFrom = Math.floor(
        Date.UTC(
          dateFrom.getFullYear(),
          dateFrom.getMonth(),
          dateFrom.getDate(),
          dateFrom.getHours(),
          dateFrom.getMinutes(),
          dateFrom.getSeconds(),
          dateFrom.getMilliseconds()
        ) / 1000
      )
      this.chartInstance.timeScale().setVisibleRange({
        from: timeFrom,
        to: timeTo,
      })
      this.chartInstance.timeScale().applyOptions({
        rightOffset: 10,
      })
      this.chartInstance?.subscribeClick((param: any) => {
        if (param.hoveredMarkerId) {
          const clickedTrade = this.props.openTrades.find(
            (c) => c.tradeID === param.hoveredMarkerId
          )

          this.setState({
            clickedTrade,
            clickedTradeX: param.point.x + 50,
            clickedTradeY: param.point.y - 20,
          })
        }
      })
    }
    this.setState({ loading: false })
  }

  addIndicator = (indicator: IIndicatorMenuItem) => {}

  removeIndicator = (indicator: IIndicatorMenuItem) => {}

  updateIndicator = (menuIndicator: IIndicatorMenuItem, params: any) => {}

  getIndicatorVisibility = (indicator: IIndicatorMenuItem): boolean => {
    return false
  }

  toggleIndicator = (indicator: IIndicatorMenuItem) => {}

  removeAllAnnotations = () => {}

  timeToLocal = (originalTime: number) => {
    const d = new Date(originalTime)
    return (
      Date.UTC(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        d.getMilliseconds()
      ) / 1000
    )
  }

  createSeriesData = (data: ICandle[]): any => {
    const { period } = this.state.timeframe

    if (period === 'tick') {
      return chain(data)
        .sortBy((p: any) => p[0])
        .map((p: any) => {
          return {
            time: this.timeToLocal(p[0]),
            value: p[1],
          }
        })
        .value()
    }

    return chain(data)
      .sortBy((p) => p.timestamp)
      .map((p) => {
        return {
          time: this.timeToLocal(p.timestamp),
          open: p.open,
          high: p.high,
          low: p.low,
          close: p.close,
          value: p.close,
        }
      })
      .value()
  }

  onFetchCandles = async () => {
    if (fetchCandlesCancelToken) {
      fetchCandlesCancelToken.cancel('Operation canceled due to new request.')
    }
    const CancelToken = axios.CancelToken
    fetchCandlesCancelToken = CancelToken.source()
    const { period } = this.state.timeframe
    const data = await api.chartHistory(
      this.props.instrument,
      period,
      1000,
      fetchCandlesCancelToken
    )
    if (data) {
      const candles = this.createSeriesData(data.aggs)
      const lastQuote = candles[candles.length - 1]
      this.setState(
        {
          candles,
          lastPrice: lastQuote[1],
        },
        () => this.createOrUpdateChart()
      )
      fetchCandlesCancelToken = null
    } else {
      this.setState({ error: true })
      fetchCandlesCancelToken = null
    }
  }

  getAnnotations = () => {}

  calculateAnnotations = () => {}

  toggleAnnotation = (visibility: boolean) => {}

  onChangeZoomLevel = (zoomLevel: number) => {}

  onFullScreen = () => {}

  onToggleNavigator = () => {}

  onChangeTimeframe = (timeframe: IPeriod) => {
    const { indicators, timeframe: currentTimeframe } = this.state
    const isTick = timeframe.period === 'tick'
    if (currentTimeframe.period !== timeframe.period) {
      this.setState(
        {
          timeframe,
          indicators: isTick ? [] : indicators,
        },
        async () => {
          if (isTick) {
            // forEach(indicators, this.removeIndicator)
          }
          await this.onFetchCandles()
        }
      )
    }
  }

  changeChartLastQuote = (lastQuote: any) => {
    const { timeframe, chartType, expiry } = this.state
    const { chartPeriod, candleStickPeriod } = timeframe
    const isCandlestick = ['candlestick', 'ohlc'].includes(chartType)
    const threshold = isCandlestick
      ? candleStickPeriod * 60000
      : chartPeriod * 4000
    const { timestamp, open, high, low, last: close } = lastQuote
    const newPoint = {
      time: this.timeToLocal(Math.floor(timestamp / threshold) * threshold),
      open,
      high,
      low,
      close,
      value: close,
    }

    const lastPoint = last(this.state.candles)

    if (lastPoint) {
      const isAdded = this.timeToLocal(timestamp) - lastPoint.time >= threshold

      isAdded
        ? this.setState({
            candles: [...this.state.candles, newPoint],
            lastPrice: newPoint.close,
          })
        : this.setState({
            candles: [...dropRight(this.state.candles, 1), newPoint],
            lastPrice: newPoint.close,
          })

      try {
        this.chartSeries?.update(newPoint)
      } catch (error) {}
    }

    if (!this.props.isCfdOptions && newPoint.time >= this.timeToLocal(expiry)) {
      this.props.actionDeselectExpiry()
    }
  }

  onRenderTrades = () => {
    const { openTrades } = this.props
    const tradesData = chain([
      ...openTrades.map((trade: IOpenTrade) => ({
        ...trade,
        isClosed: false,
      })),
    ])
      .filter(
        (trade) =>
          (this.props.isCfdOptions
            ? !!trade.optionValue
            : !trade.optionValue) &&
          this.props.instrumentObject.name === trade.instrumentName
      )
      .map((trade) => {
        const stake = formatCurrencyById(store.getState())(
          trade.stake,
          trade.currency
        )
        return {
          ...trade,
          id: trade.tradeID,
          time: this.timeToLocal(trade.createdTimestamp),
          position: trade.direction === 1 ? 'belowBar' : 'aboveBar',
          color:
            trade.direction === 1
              ? this.props.theme.chart.plotOptions.candlestick.upColor
              : this.props.theme.chart.plotOptions.candlestick.color,
          text: stake,
          shape: trade.direction === 1 ? 'arrowUp' : 'arrowDown',
        }
      })
      .value()
    this.chartSeries?.setMarkers(tradesData)
  }

  onChartOrientation = () => {
    window.location.reload()
  }

  onChartResize = () => {
    if (this.chartInstance) {
      if (!this.props.isMobile) {
        const bottomHeight = this.props.showBottomPanel
          ? this.props.bottomPanelHeight + 84
          : 18
        const topHeight = this.props.loggedIn ? 32 : 0
        const minusWidth =
          84 +
          (parseInt(this.props.tradingPanelType) === 2 ? 140 : 310) +
          (this.props.isCfdOptions ? 74 : 0)
        let width = window.innerWidth - minusWidth
        width =
          width -
          (this.props.showSideMenu
            ? this.props.collapsedSideMenu
              ? 42
              : 220
            : 0)
        if (this.props.container === ContainerState.assets) width -= 320
        const height = window.innerHeight - 204 - topHeight - bottomHeight
        this.chartInstance.applyOptions({
          width,
          height,
        })
      } else {
        const height = !isMobileLandscape(this.props.isMobile)
          ? this.props.loggedIn
            ? this.props.isPosition
              ? window.innerHeight - 397
              : window.innerHeight - 312
            : window.innerHeight - 278
          : window.innerHeight - 116
        const width =
          this.props.isMobile && isMobileLandscape(this.props.isMobile)
            ? window.innerWidth - 230
            : window.innerWidth
        this.chartInstance.applyOptions({
          height,
          width,
        })
      }
    }
  }

  changeChartType = (chartType: ChartType) => {
    if (this.chartInstance) this.createChartSeries(chartType)
  }

  onChangeChartType = (chartType: ChartType) => {
    this.setState({ chartType }, () => {
      this.changeChartType(chartType)
    })
  }

  addTooltip = () => {
    const container = document.getElementById('chart-container')
    const floatingTooltip = document.getElementsByClassName(
      'floating-tooltip-lightweight'
    )
    if (!(floatingTooltip.length > 0)) {
      this.tooltipChart = document.createElement('div')
      this.tooltipChart.className = 'floating-tooltip-lightweight'
      container?.appendChild(this.tooltipChart)
    }
  }

  componentDidMount = async () => {
    this.addTooltip()
    if (this.props.instrument) {
      this.onFetchCandles()
    }
    window.addEventListener('resize', this.onChartResize)
    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', this.onChartOrientation)
    }
    this.eventEmitter = EventEmitter.addListener('positionOpened', (event) => {
      // Get position of position
      // const { position, opened } = event
      // const clickedTrade: any = this.props.openTrades.find(
      //   (c) => c.tradeID === position.tradeID
      // ) || {}
      // this.setState({
      //   clickedTrade: opened ? clickedTrade : null,
      //   clickedTradeX: opened ? clickedTrade.createdTimestamp : null,
      //   clickedTradeY: opened ? clickedTrade.strike : null,
      // })
    })
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onChartResize)
    if ('onorientationchange' in window) {
      window.removeEventListener('orientationchange', this.onChartOrientation)
    }
    this.eventEmitter?.removeListener('positionOpened', () => {})
  }

  componentDidUpdate = (prevProps: IChartProps) => {
    if (prevProps.instrument !== this.props.instrument) {
      this.setState({ loading: true }, this.onFetchCandles)
    }
    if (!isEqual(prevProps.lastQuote, this.props.lastQuote)) {
      this.changeChartLastQuote(this.props.lastQuote)
    }
    if (
      prevProps.openTrades !== this.props.openTrades ||
      prevProps.closedTrades !== this.props.closedTrades ||
      prevProps.isCfdOptions !== this.props.isCfdOptions ||
      prevProps.instrument !== this.props.instrument
    ) {
      this.onRenderTrades()
    }

    if (
      prevProps.showBottomPanel !== this.props.showBottomPanel ||
      prevProps.bottomPanelHeight !== this.props.bottomPanelHeight ||
      prevProps.container !== this.props.container ||
      prevProps.showSideMenu !== this.props.showSideMenu ||
      prevProps.collapsedSideMenu !== this.props.collapsedSideMenu
    )
      this.onChartResize()
    if (prevProps.isPosition !== this.props.isPosition) {
      this.onChartResize()
    }
  }

  render = () => {
    const { clickedTrade, clickedTradeX, clickedTradeY } = this.state
    const loaded = !this.state.loading && !this.state.error
    const visibility = loaded ? 'visible' : 'hidden'
    const isDesktop = !this.props.isMobile
    const onClosePositionInfo = () => {
      this.setState({
        clickedTrade: null,
        clickedTradeX: null,
        clickedTradeY: null,
      })
    }
    const contextValue = {
      // addIndicator: this.addIndicator,
      // updateIndicator: this.updateIndicator,
      // removeIndicator: this.removeIndicator,
      // toggleIndicator: this.toggleIndicator,
      getIndicatorVisibility: this.getIndicatorVisibility,
    }
    const chartPeriods =
      ['candlestick', 'ohlc'].includes(this.state.chartType) ||
      this.props.isCfdOptions
        ? chartPeriodOptionsMobile.filter(
            (p: IPeriod) => p.supportedOnCandleChartType
          )
        : chartPeriodOptionsMobile.filter(
            (p: IPeriod) => p.supportedOnLineChartType
          )

    return (
      <IndicatorsContext.Provider value={contextValue}>
        <ChartPanel isMobile={this.props.isMobile} colors={this.props.theme}>
          {!isDesktop && (
            <>
              <MobileInstrumentsBar
                chartType={this.state.chartType}
                timeframe={this.state.timeframe}
                periodOptions={this.state.periodOptions}
                onChangeTimeframe={(timeframe) =>
                  this.onChangeTimeframe(timeframe)
                }
                isHighCharts={
                  this.props.currentChartLibrary === ChartLibrary.Basic
                }
                onChangeChartType={this.onChangeChartType}
              />
              {/* {!isMobileLandscape(this.props.isMobile) && (
                <MobileTimeFrames
                  colors={this.props.theme}
                  className="hide_scroll_bar"
                >
                  {chartPeriods.map((timeframe) => (
                    <TimeFrameItem
                      key={timeframe.periodLabel}
                      colors={this.props.theme}
                      active={
                        this.state.timeframe.chartPeriod ===
                        timeframe.chartPeriod
                      }
                      onClick={() => this.onChangeTimeframe(timeframe)}
                    >
                      {timeframe.periodLabel}
                    </TimeFrameItem>
                  ))}
                </MobileTimeFrames>
              )} */}
            </>
          )}
          <ChartArea
            loggedIn={this.props.loggedIn}
            isMobile={this.props.isMobile}
          >
            <div
              id="chart-container"
              className="highcharts-container"
              style={{ visibility }}
            />
          </ChartArea>
          {isDesktop && (
            <ChartControls
              periodOptions={this.state.periodOptions}
              timeframe={this.state.timeframe}
              onChangeTimeframe={this.onChangeTimeframe}
              onChangeChartType={this.onChangeChartType}
              removeAllAnnotations={this.removeAllAnnotations}
              calculateAnnotations={this.calculateAnnotations}
              toggleAnnotation={this.toggleAnnotation}
              indicators={this.state.indicators}
            />
          )}
          {this.state.loading && <GlobalLoader zIndex={40} />}
          {clickedTrade && (
            <>
              <ChartPositionInfo
                trade={clickedTrade}
                quote={this.props.lastQuote}
                timeleft={5}
                x={clickedTradeX}
                y={Math.min(870, clickedTradeY)}
                onClose={onClosePositionInfo}
              />
              <Backdrop onClick={onClosePositionInfo} />
            </>
          )}
          {loaded && (
            <>
              <ChartBottomPanel
                onChangeTimeframe={this.onChangeTimeframe}
                onChangeChartType={this.onChangeChartType}
                periodOptions={this.state.periodOptions}
                chartType={this.state.chartType}
                timeframe={this.state.timeframe}
                indicators={this.state.indicators}
                removeAllAnnotations={this.removeAllAnnotations}
                calculateAnnotations={this.calculateAnnotations}
                toggleAnnotation={this.toggleAnnotation}
                isMobile={this.props.isMobile}
                navigator={this.state.navigator}
                zoomLevel={this.state.zoomLevel}
                onChangeZoomLevel={this.onChangeZoomLevel}
                onFullScreen={this.onFullScreen}
                onToggleNavigator={this.onToggleNavigator}
                isHighCharts={
                  this.props.currentChartLibrary === ChartLibrary.Basic
                }
              />
              <Sentiment
                instrument={this.props.instrument}
                navigator={this.state.navigator}
              />
            </>
          )}
        </ChartPanel>
      </IndicatorsContext.Provider>
    )
  }
}

const mapStateToProps = (state: any) => ({
  instrument: state.trading.selected,
  instrumentObject: getInstrumentObject(state),
  instrumentName: getInstrumentName(state),
  direction: state.trading.direction,
  cfdDirection: state.trading.cfdOptionsActiveDirection,
  hoveredDirection: state.trading.hoveredDirection,
  lastPrice: lastPriceForSelectedInstrument(state),
  lastQuote: lastQuoteForSelectedInstrument(state),
  openTrades: state.trades.open || [],
  closedTrades: state.trades.closed || [],
  game: state.game,
  time: state.time,
  chartConfig: state.registry.data.chartConfig,
  theme: state.theme,
  selectedExpiry: state.expiry.selected,
  selectedCfdOptionInstrument: state.trading.selectedCfdOptionInstrument,
  selectedCfdOptionExpiry: state.trading.selectedCfdOptionExpiry,
  loggedIn: isLoggedIn(state),
  chartLibraryConfig: state.registry.data.partnerConfig.chartLibraryConfig,
  currentChartLibrary: state.registry.currentChartLibrary,
  showBottomPanel: state.container.showBottomPanel,
  bottomPanelHeight: state.container.bottomPanelHeight,
  container: state.container.content,
  showSideMenu: state.container.showSideMenu,
  collapsedSideMenu: state.container.collapsedSideMenu,
  currentChartType: state.registry.currentChartType,
  isCfdOptions: isCfdOptionsProductType(state),
  isMobile: state.registry.isMobile,
  tradingPanelType: state.registry.data.partnerConfig.tradingPanelType,
  isPosition: state.trades.open.length !== 0,
})

export default connect(mapStateToProps, {
  actionSetSidebar,
  actionSelectExpiry,
  actionDeselectExpiry,
  actionSetSelectedTrade,
  actionSelectNextExpiry,
  actionChangeChartLibrary,
})(LightWeightChart)
