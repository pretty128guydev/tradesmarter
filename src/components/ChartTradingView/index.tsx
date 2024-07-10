/* eslint-disable no-restricted-globals */
import * as React from 'react'
import './index.scss'
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  IChartingLibraryWidget,
  ResolutionString,
} from '../../charting_library'
import { connect } from 'react-redux'
import {
  reRenderTradingChart,
  subscribeOnStream,
  unsubscribeFromStream,
} from './datafeed/stream'
import { api } from '../../core/createAPI'
import axios from 'axios'
import {
  chartPeriodOptions,
  chartPeriodOptionsMobile,
  IPeriod,
} from '../ChartContainer/Chart/period'
import { filter, find, includes, sortBy, toLower, toNumber } from 'lodash'
import {
  getInstrumentObject,
  lastPriceForSelectedInstrument,
  lastQuoteForSelectedInstrument,
} from '../selectors/instruments'
import ChartControls from '../ChartContainer/Chart/ChartControls'
import { actionSelectInstrument } from '../../actions/trading'
import { ICfdOptionsInstrument, IInstrument } from '../../core/API'
import { IClosedTrade, IOpenTrade } from '../../core/interfaces/trades'
import { formatCurrency, formatCurrencyById } from '../selectors/currency'
import ChartPositionInfo from '../ChartContainer/Chart/ChartPositionInfo'
import { actionSetSelectedTrade } from '../../actions/trades'
import Backdrop from '../Backdrop'
import TradingChartHelper from './chart-render-helper'
import { IGame } from '../../reducers/games'
import { EntityId } from '../../build/charting_library/charting_library'
import moment from 'moment'
import { getLocalTimeZone } from './datafeed/helper'
import { ChartLibrary, ChartType } from '../ChartContainer/ChartLibraryConfig'
import { isLoggedIn } from '../selectors/loggedIn'
import ChartBottomPanel from '../ChartContainer/Chart/ChartBottomPanel'
import { MobileTimeFrames, TimeFrameItem } from '../ChartContainer/Chart/styled'
import MobileInstrumentsBar from '../ChartContainer/MobileInstrumentsBar'
import { isMobileLandscape } from '../../core/utils'
import { isCfdOptionsProductType } from '../selectors/trading'
import { store } from '../../store'

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol']
  interval: ChartingLibraryWidgetOptions['interval']

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string
  libraryPath: ChartingLibraryWidgetOptions['library_path']
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  clientId: ChartingLibraryWidgetOptions['client_id']
  userId: ChartingLibraryWidgetOptions['user_id']
  fullscreen: ChartingLibraryWidgetOptions['fullscreen']
  autosize: ChartingLibraryWidgetOptions['autosize']
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
  container: ChartingLibraryWidgetOptions['container']
  selectedExpiry: number
  instrument: any
  currentInstrumentProps: IInstrument | null
  trading: any
  chart: any
  state: any
  lastQuote: any
  setIsHighCharts?: (isHighCharts: boolean) => void
  isHighCharts: boolean
  actionSelectInstrument: (id: any) => void
  theme: any
  isMobile: boolean
  isCfdOptions: boolean
  lastPrice: number | string
  selectedCfdOptionInstrument?: ICfdOptionsInstrument
  selectedCfdOptionExpiry?: number
  openTrades: IOpenTrade[]
  formatCurrency: (value: number) => string
  actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => any
  game?: IGame
  time: number
  currentChartLibrary: ChartLibrary
  actionChangeChartLibrary: (chartType: ChartLibrary) => void
  loggedIn: boolean
  currentChartType: ChartType
}

export interface ChartContainerState {
  clientX: number
  clientY: number
  clickedTrade?: IOpenTrade
  showTradeInfo: boolean
  openTradeLength: number
  isChartReady: boolean
  timeCountPositon: number
  isHidenSlideBar: boolean
  timeframe: any
  loaded: boolean
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode)
}

class ChartTradingView extends React.PureComponent<
  Partial<ChartContainerProps>,
  ChartContainerState
> {
  public static defaultProps: Omit<ChartContainerProps, 'container'> = {
    symbol: '',
    interval: '1' as ResolutionString,
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    instrument: '',
    currentInstrumentProps: null,
    trading: null,
    chart: null,
    state: null,
    lastQuote: null,
    isHighCharts: true,
    actionSelectInstrument: (id: any) => {},
    theme: null,
    isMobile: false,
    isCfdOptions: false,
    lastPrice: 0,
    selectedCfdOptionInstrument: undefined,
    selectedCfdOptionExpiry: undefined,
    openTrades: [],
    formatCurrency: (value: number) => '',
    actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => {},
    currentChartLibrary: ChartLibrary.Basic,
    actionChangeChartLibrary: (chartType: ChartLibrary) => {},
    selectedExpiry: 0,
    time: 0,
    loggedIn: false,
    currentChartType: ChartType.candlestick,
  }

  private tvWidget: IChartingLibraryWidget | null = null
  private ref: React.RefObject<HTMLDivElement> = React.createRef()
  private fetchCandlesCancelToken: any = null
  private data: any
  private currentInstrument: string = ''
  private timeLineId: EntityId | null | undefined
  private tradeOpenLines: any[] = []
  private tradeOpenPoints: any[] = []
  private timeDistance: string = ''
  private linetext: any
  private prevExpiry: number = 0
  private chartPeriod?: IPeriod

  public componentDidMount(): void {
    this.onInitChart()
  }

  public componentWillUnmount(): void {
    if (this.tvWidget !== null) {
      this.tvWidget.remove()
      this.tvWidget = null
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<Partial<ChartContainerProps>>,
    prevState: Readonly<ChartContainerState>,
    snapshot?: any
  ): void {
    if (this.currentInstrument !== this.props.instrument) {
      this.currentInstrument = this.props.instrument
      this.removeTradeShape()
      if (this.state?.isChartReady && this.props.currentInstrumentProps?.name) {
        this.tvWidget
          ?.chart()
          ?.setSymbol(this.props.currentInstrumentProps?.name, () => {
            this.renderGame()
            this.renderTrades()
          })
      }
    }
    const instrument = find(this.props.trading?.instruments, [
      'instrumentID',
      `${this.props.instrument}`,
    ])

    if (
      prevProps.isCfdOptions !== this.props.isCfdOptions ||
      prevProps.openTrades?.length !== this.props.openTrades?.length
    ) {
      this.renderTrades()
    }

    if (
      prevProps.game &&
      prevProps.game !== this.props.game &&
      this.state?.loaded
    ) {
      this.renderGame()
      this.renderTrades()
    }
    reRenderTradingChart(instrument?.name, this.props.lastQuote)
  }

  removeTradeShape = () => {
    try {
      this.tvWidget?.chart().removeEntity(this.timeLineId as EntityId)
      this.tradeOpenLines.forEach((l) => l.actionRemove())
      this.tradeOpenLines = []
      this.tradeOpenPoints.forEach((l) => l.actionRemove())
      this.tradeOpenPoints = []
    } catch (e) {}
  }

  removeOpenLines = () => {
    let filterOpenLines = this.tradeOpenLines
    let filterOpenPoints = this.tradeOpenPoints
    if (this.props.openTrades && this.props.openTrades.length > 0) {
      this.props.openTrades.forEach((trade) => {
        filterOpenLines = this.tradeOpenLines.filter(
          (l) =>
            !this.props.openTrades?.some(
              (trade) =>
                l.time === trade.createdTimestamp && l.price === trade.strike
            )
        )
        filterOpenPoints = this.tradeOpenPoints.filter(
          (p) =>
            !this.props.openTrades?.some(
              (trade) =>
                p.time === trade.createdTimestamp && p.price === trade.strike
            )
        )
      })
    }
    filterOpenLines.forEach((l) => {
      this.tradeOpenLines = this.tradeOpenLines.filter(
        (line) => !(line.time === l.time && line.price === l.price)
      )
      l.actionRemove()
    })
    filterOpenPoints.forEach((p) => {
      this.tradeOpenPoints = this.tradeOpenPoints.filter(
        (point) => !(point.time === p.time && point.price === p.price)
      )
      p.actionRemove()
    })
  }

  getShapeById = (id: EntityId) => {
    try {
      const shape = this.tvWidget?.chart().getShapeById(id)
      return shape
    } catch (error) {
      return
    }
  }

  renderGame = (from?: number) => {
    if (this.props.isCfdOptions) {
      this.removeTradeShape()
    }
    if (
      !this.props.game ||
      !this.tvWidget ||
      this.props.isCfdOptions ||
      !this.state?.isChartReady
    )
      return
    try {
      const { expiry } = this.props.game
      const instrument: IInstrument = find(this.props.trading?.instruments, [
        'instrumentID',
        `${this.props.instrument}`,
      ])

      const lastPoint = this.lastBarsCache.get(instrument.name)
      const maxExtendTime =
        (lastPoint?.time || 0) / 1000 +
        1000 * 100 * (this.chartPeriod?.candleStickPeriod || 1)

      const gameTime = TradingChartHelper.getGameTime(
        this.props.game,
        this.chartPeriod as IPeriod
      )

      const gameTimeMax = TradingChartHelper.getMaxGameTime(
        maxExtendTime,
        gameTime,
        this.chartPeriod?.candleStickPeriod || 1,
        lastPoint?.time,
        true
      )
      if (this.timeLineId) {
        const line = this.getShapeById(this.timeLineId)
        if (line) this.tvWidget?.chart().removeEntity(this.timeLineId)
        this.timeLineId = this.tvWidget
          ?.chart()
          .createShape(
            { time: gameTimeMax },
            { shape: 'vertical_line', disableSelection: true }
          )
      } else {
        this.timeLineId = this.tvWidget
          ?.chart()
          .createShape(
            { time: gameTimeMax },
            { shape: 'vertical_line', disableSelection: true }
          )
      }

      const {
        expiryLine: { color: expiryLineColor },
      } = this.props.theme.chart

      const timeLine = this.tvWidget
        ?.chart()
        .getShapeById(this.timeLineId as EntityId)

      timeLine.setProperties({
        time: gameTimeMax,
        linecolor: expiryLineColor,
        text: moment(gameTime).format('HH:mm:ss'),
        showLabel: true,
        showTime: false,
        textcolor: expiryLineColor,
      })

      const points = timeLine.getPoints()

      timeLine.setPoints(
        points.map((p) => ({
          ...p,
          time: gameTimeMax,
        }))
      )
      if (this.prevExpiry !== expiry) {
        this.prevExpiry = expiry
        const visible = this.tvWidget?.chart().getVisibleRange()
        this.tvWidget?.chart().setVisibleRange({
          from: from || visible.from,
          to: gameTimeMax + 1000,
        })
      }
    } catch (error) {}
  }

  renderTrades = () => {
    const instrument: IInstrument = find(this.props.trading?.instruments, [
      'instrumentID',
      `${this.props.instrument}`,
    ])

    const openTrades = this.props.openTrades

    this.removeOpenLines()

    let openTradeVisible = (openTrades || []).filter(
      (trade) =>
        (this.props.isCfdOptions ? !!trade.optionValue : !trade.optionValue) &&
        instrument.name === trade.instrumentName
    )

    const upColor = this.props.theme?.chart.plotOptions.candlestick.upColor
    const downColor = this.props.theme?.chart.plotOptions.candlestick.color

    openTradeVisible.forEach((openTrade) => {
      const line = this.tradeOpenLines.find(
        (l) =>
          l.price === openTrade.strike && l.time === openTrade.createdTimestamp
      )
      if (!line) {
        const entityId = this.tvWidget?.chart().createMultipointShape(
          [
            {
              time: openTrade.expiryTimestamp / 1000,
              price: openTrade.strike,
            },
            {
              time: openTrade.createdTimestamp / 1000,
              price: openTrade.strike,
            },
          ],
          {
            shape: 'info_line',
            disableSelection: true,
            lock: true,
            zOrder: 'top',
            overrides: {
              statsPosition: 2,
              textcolor: openTrade.direction === 1 ? upColor : downColor,
              linecolor: openTrade.direction === 1 ? upColor : downColor,
              linestyle: 2,
              linewidth: 1,
              showAngle: false,
              showBarsRange: false,
              showDateTimeRange: false,
              showDistance: false,
              showLabel: false,
              showMiddlePoint: false,
              showPriceLabels: false,
              showPriceRange: false,
            },
          }
        )

        if (entityId) {
          this.tradeOpenLines = [
            ...this.tradeOpenLines,
            {
              time: openTrade.createdTimestamp,
              price: openTrade.strike,
              actionRemove: () => this.tvWidget?.chart().removeEntity(entityId),
            },
          ]
        }
      }
      const point = this.tradeOpenPoints.find(
        (l) =>
          l.price === openTrade.strike && l.time === openTrade.createdTimestamp
      )

      if (!point) {
        const newPoint = this.tvWidget?.chart().createExecutionShape()
        if (newPoint) {
          const stake = formatCurrencyById(store.getState())(
            openTrade.stake,
            openTrade.currency
          )
          newPoint
            .setText(stake)
            .setTooltip('')
            .setTextColor(openTrade.direction === 1 ? upColor : downColor)
            .setArrowColor(openTrade.direction === 1 ? upColor : downColor)
            .setDirection(openTrade.direction === 1 ? 'buy' : 'sell')
            .setTime(openTrade.createdTimestamp / 1000)
            .setArrowHeight(15)
            .setArrowSpacing(3)
            .setPrice(openTrade.strike)

          this.tradeOpenPoints = [
            ...this.tradeOpenPoints,
            {
              time: openTrade.createdTimestamp,
              price: openTrade.strike,
              actionRemove: () => newPoint.remove(),
            },
          ]
        }
      }
    })
  }

  updateClickPosition = (mouseEvent: any) => {
    this.setState({
      clientX: mouseEvent.screenX,
      clientY: mouseEvent.screenY,
    })
  }

  updateSelectedTrade = (markId: number) => {
    const openTrades = this.props.openTrades

    const selected = find(openTrades, ['tradeID', markId])
    if (selected) {
      this.setState({ showTradeInfo: true, clickedTrade: selected })
      this.props.actionSetSelectedTrade &&
        this.props.actionSetSelectedTrade(selected)
    }
  }

  onInitChart = () => {
    if (!this.ref.current) {
      return
    }

    const instrument = find(this.props.trading?.instruments, [
      'instrumentID',
      `${this.props.instrument}`,
    ])
    const widgetOptions: any = {
      symbol: instrument?.name || '',
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      datafeed: this.DataFeed,
      interval: this.props.interval,
      container: this.ref.current,
      library_path: this.props.libraryPath as string,
      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_settings',
        'header_fullscreen_button',
        'header_screenshot',
        'header_saveload',
        'header_compare',
        'header_resolutions',
        'header_chart_type',
        'header_symbol_search',
      ],
      enabled_features: this.props.isMobile
        ? ['seconds_resolution', 'hide_left_toolbar_by_default']
        : ['seconds_resolution'],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      theme: 'Dark',
      timezone: getLocalTimeZone(),
      overrides: {
        'paneProperties.legendProperties.showSeriesTitle': false,
        'mainSeriesProperties.candleStyle.wickUpColor':
          this.props.theme?.chart.plotOptions.candlestick.upColor,
        'mainSeriesProperties.candleStyle.borderUpColor':
          this.props.theme?.chart.plotOptions.candlestick.upColor,
        'mainSeriesProperties.candleStyle.upColor':
          this.props.theme?.chart.plotOptions.candlestick.upColor,
        'mainSeriesProperties.candleStyle.wickDownColor':
          this.props.theme?.chart.plotOptions.candlestick.color,
        'mainSeriesProperties.candleStyle.borderDownColor':
          this.props.theme?.chart.plotOptions.candlestick.color,
        'mainSeriesProperties.candleStyle.downColor':
          this.props.theme?.chart.plotOptions.candlestick.color,
        'paneProperties.background': this.props.theme?.panelBackground,
        'paneProperties.backgroundType': 'solid',
        'mainSeriesProperties.areaStyle.color1':
          this.props.theme?.chart.plotOptions.area.linearGradientUp,
        'mainSeriesProperties.areaStyle.color2':
          this.props.theme?.chart.plotOptions.area.linearGradientDown,
        'mainSeriesProperties.areaStyle.linecolor':
          this.props.theme?.chart.plotOptions.area.color,
        'mainSeriesProperties.lineStyle.color':
          this.props.theme?.chart.plotOptions.area.color,
        'paneProperties.vertGridProperties.color':
          this.props.theme?.chart.yAxis.gridLineColor,
        'paneProperties.horzGridProperties.color':
          this.props.theme?.chart.yAxis.gridLineColor,
      },
    }

    const tvWidget = new widget(widgetOptions)

    this.tvWidget = tvWidget

    tvWidget.onChartReady(() => {
      this.setState({ isChartReady: true, timeframe: chartPeriodOptions[1] })

      const dateTo = moment().unix()
      const dateFrom = moment().subtract(30, 'minutes').unix()
      tvWidget.chart().setVisibleRange({
        from: dateFrom,
        to: dateTo,
      })
      this.renderGame(dateFrom)
      this.renderTrades()
      if (this.props.currentChartType === ChartType.ohlc)
        tvWidget.chart().setChartType(0)
      let myiFrame: any = document.querySelector(
        '.ChartTradingView > div > iframe'
      )
      if (myiFrame) {
        const upColor = this.props.theme?.chart.plotOptions.candlestick.upColor
        const upColorCheckBoxBackground =
          this.props.theme?.chart.plotOptions.candlestick.upColor + '33'
        const backgroundColor = this.props.theme?.modalBackground
        let doc = myiFrame.contentDocument
        const style = document.createElement('style')
        style.type = 'text/css'
        const css = TradingChartHelper.overrideChartCss({
          upColor,
          upColorCheckBoxBackground,
          backgroundColor,
        })
        style.appendChild(document.createTextNode(css))

        const head = doc.head || doc.getElementsByTagName('head')[0]
        if (head) {
          head.appendChild(style)
        }
      }
    })
    this.tvWidget.subscribe('mouse_up', (event) => {
      this.updateClickPosition(event)
    })
    this.tvWidget.subscribe('onMarkClick', (markId) => {
      this.updateSelectedTrade(markId as number)
    })
    this.tvWidget.subscribe('indicators_dialog', () => {
      console.log('indicators_dialog')
    })
    this.tvWidget.subscribe('toggle_sidebar', (isHidden) => {
      this.setState({
        isHidenSlideBar: isHidden,
      })
    })
  }

  getMinMove = (precision: number | undefined) => {
    return 0.001
    // if (precision) {
    //   let minMove = ''
    //   for (let index = 0; index < precision; index++) {
    //     minMove = `${minMove}0`
    //   }
    //   return Number(minMove.slice(0, 1) + '.' + minMove.slice(1) + '1')
    // }
    // return 1
  }

  formatPeriod(period: string) {
    if (
      period.includes('S') ||
      period.includes('H') ||
      period.includes('W') ||
      period.includes('D')
    ) {
      return period
    } else {
      if (toNumber(period) >= 60) {
        return toNumber(period) / 60 + 'h'
      }
      return period + 'm'
    }
  }

  getPriceScale(precision: number) {
    let scale = ''
    for (let index = 0; index < precision; index++) {
      scale = `${scale}0`
    }
    return Number('1' + scale)
  }

  onFetchCandles = async (
    period: string,
    firstDataRequest: boolean,
    periodParams: { to: number }
  ) => {
    if (this.fetchCandlesCancelToken) {
      this.fetchCandlesCancelToken.cancel(
        'Operation canceled due to new request.'
      )
    }
    const CancelToken = axios.CancelToken
    this.fetchCandlesCancelToken = CancelToken.source()
    const periodFomarted = this.formatPeriod(period)
    const selectPeriod = find(chartPeriodOptions, [
      'period',
      toLower(periodFomarted),
    ])
    this.chartPeriod = selectPeriod
    let data
    if (firstDataRequest) {
      data = await api.chartHistory(
        this.props.instrument,
        selectPeriod?.period || '1m',
        1000,
        this.fetchCandlesCancelToken
      )
    } else {
      data = await api.chartHistory(
        this.props.instrument,
        selectPeriod?.period || '1m',
        300,
        this.fetchCandlesCancelToken,
        periodParams.to
      )
    }
    this.fetchCandlesCancelToken = null
    if (firstDataRequest) {
      return sortBy(data?.aggs, ['timestamp', 'asc'])
    } else {
      return sortBy(
        filter(data?.aggs, (item) => item.timestamp < periodParams.to * 1000),
        ['timestamp', 'asc']
      )
    }
  }

  lastBarsCache = new Map()
  supportedResolutions = ['1', '5', '15', '30', '1H', '2H', '4H', '1D']
  config = {
    supported_resolutions: this.supportedResolutions,
    exchanges: [],
    symbols_types: [],
    supports_marks: true,
    has_seconds: true,
    has_ticks: true,
  }
  DataFeed = {
    onReady: (cb: any) => {
      const exchanges = (this.props.trading?.instruments || []).map(
        (inst: any) => ({
          value: inst.name,
          name: inst.name,
          desc: inst.description,
        })
      )
      this.config.exchanges = exchanges
      setTimeout(() => cb(this.config), 0)
    },
    searchSymbols: (
      userInput: any,
      exchange: any,
      symbolType: any,
      onResultReadyCallback: any
    ) => {
      let allSymbols = (this.props.trading?.instruments || []).map(
        (inst: any) => ({
          symbol: inst.name,
          full_name: inst.name,
          description: inst.description,
          exchange: '',
          type: '',
        })
      )
      const newSymbols = allSymbols.filter((symbol: any) => {
        const isFullSymbolContainsInput = includes(
          toLower(symbol.full_name),
          toLower(userInput)
        )
        return isFullSymbolContainsInput
      })
      onResultReadyCallback(newSymbols)
    },
    resolveSymbol: async (
      symbolName: any,
      onSymbolResolvedCallback: (symbol: any) => void,
      onResolveErrorCallback: any
    ) => {
      const instrument = find(this.props.trading?.instruments, [
        'instrumentID',
        `${this.props.instrument}`,
      ])
      // expects a symbolInfo object in response
      if (symbolName !== instrument.name && symbolName !== '') {
        const instruments = this.props.trading?.instruments

        const selectedSymbol: IInstrument = instruments?.find(
          (inst: any) => inst.name === symbolName
        )
        if (selectedSymbol) {
          this.props.actionSelectInstrument &&
            this.props.actionSelectInstrument(selectedSymbol.instrumentID)
        }
        return
      }
      console.log('precision:', instrument?.precision)
      const symbol_stub = {
        name: instrument?.name || '',
        description: instrument?.name || '',
        type: '',
        session: '24x7',
        timezone: 'Etc/UTC',
        ticker: '',
        exchange: '',
        minmov: this.getMinMove(instrument?.precision),
        minmove2: 0,
        pricescale: this.getPriceScale(instrument?.precision || 100),
        supported_resolution: this.supportedResolutions,
        data_status: 'streaming',
        has_no_volume: true,
        has_weekly_and_monthly: false,
        volume_precision: 2,
        has_intraday: true,
        has_seconds: true,
        has_ticks: true,
      }
      onSymbolResolvedCallback(symbol_stub)
    },
    getBars: async (
      symbolInfo: any,
      resolution: string,
      periodParams: any,
      onHistoryCallback: (arg0: any[], arg1: { noData: boolean }) => void,
      onErrorCallback: (arg0: unknown) => void
    ) => {
      try {
        this.setState({ loaded: false })
        const { firstDataRequest } = periodParams

        this.data = await this.onFetchCandles(
          resolution,
          firstDataRequest,
          periodParams
        )
        const bars = this.data.map((his: any) => {
          return {
            time: his.timestamp,
            open: his.open,
            high: his.high,
            low: his.low,
            close: his.close,
          }
        })
        if (bars.length === 0) {
          onHistoryCallback([], {
            noData: true,
          })
          return
        } else {
          if (firstDataRequest) {
            this.lastBarsCache.set(symbolInfo.full_name, {
              ...bars[bars.length - 1],
            })
          }
          onHistoryCallback(bars, {
            noData: false,
          })
        }
        this.setState({ loaded: true })
      } catch (err) {
        onErrorCallback(err)
      }
    },
    subscribeBars: (
      symbolInfo: { full_name: any },
      resolution: any,
      onRealtimeCallback: any,
      subscribeUID: any,
      onResetCacheNeededCallback: any
    ) => {
      console.log(
        '[subscribeBars]: Method call with subscribeUID:',
        subscribeUID
      )
      subscribeOnStream(
        symbolInfo,
        resolution,
        onRealtimeCallback,
        subscribeUID,
        onResetCacheNeededCallback,
        this.lastBarsCache.get(symbolInfo.full_name)
      )
    },
    unsubscribeBars: (subscriberUID: any) => {
      console.log(
        '[unsubscribeBars]: Method call with subscriberUID:',
        subscriberUID
      )
      unsubscribeFromStream(subscriberUID)
    },
    calculateHistoryDepth: (
      resolution: number,
      resolutionBack: any,
      intervalBack: any
    ) => {
      //optional
      console.log('=====calculateHistoryDepth running')
      // while optional, this makes sure we request 24 hours of minute data at a time
      // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
      return resolution < 60
        ? { resolutionBack: 'D', intervalBack: '1' }
        : undefined
    },
    getMarks: (
      symbolInfo: any,
      startDate: any,
      endDate: any,
      onDataCallback: (arg0: any[]) => void,
      resolution: any
    ) => {
      //optional
      console.log('=====getMarks running')
    },
    getTimeScaleMarks: (
      symbolInfo: any,
      startDate: any,
      endDate: any,
      onDataCallback: any,
      resolution: any
    ) => {
      //optional
      console.log('=====getTimeScaleMarks running')
    },
    getServerTime: (cb: any) => {
      console.log('=====getServerTime running')
    },
  }

  onChangeTimeframe = (timeframe: IPeriod) => {
    if (!this.state) return
    const { timeframe: currentTimeframe } = this.state
    if (currentTimeframe.period !== timeframe.period) {
      this.setState({ timeframe }, () => {
        this.tvWidget
          ?.chart()
          .setResolution(timeframe.tradingViewPeriod as ResolutionString)
      })
    }
  }

  onChangeChartType = (chartType: ChartType) => {
    let cType
    switch (chartType) {
      case ChartType.candlestick:
        cType = 1
        break
      case ChartType.ohlc:
        cType = 0
        break
    }
    if (cType !== undefined) this.tvWidget?.chart().setChartType(cType)
  }

  public render(): JSX.Element {
    const currentChartType =
      this.props.currentChartType || ChartType.candlestick
    const timeframe = this.state?.timeframe || chartPeriodOptions[1]

    const chartPeriods =
      ['candlestick', 'ohlc', 'heikinashi'].includes(currentChartType) ||
      this.props.isCfdOptions
        ? chartPeriodOptionsMobile.filter(
            (p: IPeriod) => p.supportedOnCandleChartType
          )
        : chartPeriodOptionsMobile.filter(
            (p: IPeriod) => p.supportedOnLineChartType
          )

    return (
      <>
        <div className="trading-chart-header-mobile">
          {this.props.isMobile && (
            <>
              <MobileInstrumentsBar
                chartType={this.props.currentChartType}
                timeframe={timeframe}
                periodOptions={chartPeriodOptions}
                onChangeTimeframe={this.onChangeTimeframe}
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
                        this.state?.timeframe?.chartPeriod ===
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
          {!this.props.isMobile && (
            <ChartControls
              periodOptions={chartPeriodOptions}
              timeframe={timeframe}
              onChangeTimeframe={this.onChangeTimeframe}
              onChangeChartType={this.onChangeChartType}
              removeAllAnnotations={() => {}}
              calculateAnnotations={() => {}}
              toggleAnnotation={() => {}}
              indicators={[]}
            />
          )}
          <div className={'ChartTradingView'}>
            <div ref={this.ref}></div>
          </div>
          <ChartBottomPanel
            onChangeTimeframe={this.onChangeTimeframe}
            onChangeChartType={this.onChangeChartType}
            periodOptions={chartPeriodOptions}
            chartType={currentChartType}
            timeframe={timeframe}
            removeAllAnnotations={() => {}}
            calculateAnnotations={() => {}}
            toggleAnnotation={() => {}}
            isMobile={this.props.isMobile || false}
            navigator={false}
            zoomLevel={1}
            onChangeZoomLevel={() => {}}
            onFullScreen={() => {}}
            onToggleNavigator={() => {}}
            isHighCharts={this.props.currentChartLibrary === ChartLibrary.Basic}
            isResetZoom={false}
          />
        </div>
        {this.state?.showTradeInfo && !!this.state?.clickedTrade && (
          <>
            <ChartPositionInfo
              trade={this.state.clickedTrade}
              quote={this.props.lastQuote}
              timeleft={5}
              x={this.state.clientX - 50}
              y={this.state.clientY - 200}
              onClose={() => {
                this.setState({ showTradeInfo: false, clickedTrade: undefined })
              }}
            />
            <Backdrop
              onClick={() => {
                this.setState({ showTradeInfo: false, clickedTrade: undefined })
              }}
            />
          </>
        )}
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  instrument: state.trading.selected,
  currentInstrumentProps: getInstrumentObject(state),
  trading: state.trading,
  chart: state.chart,
  state,
  lastQuote: lastQuoteForSelectedInstrument(state),
  theme: state.theme,
  lastPrice: lastPriceForSelectedInstrument(state),
  selectedCfdOptionInstrument: state.trading.selectedCfdOptionInstrument,
  selectedCfdOptionExpiry: state.trading.selectedCfdOptionExpiry,
  openTrades: state.trades.open,
  selectedExpiry: state.expiry.selected,
  formatCurrency: formatCurrency(state),
  game: state.game,
  time: state.time,
  loggedIn: isLoggedIn(state),
  currentChartType: state.registry.currentChartType,
  currentChartLibrary: state.registry.currentChartLibrary,
  isCfdOptions: isCfdOptionsProductType(state),
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionSetSelectedTrade,
})(ChartTradingView)
