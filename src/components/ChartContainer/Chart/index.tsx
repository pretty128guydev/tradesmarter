/**
 * Implements a Chart wrapper
 * Chart is HighStock deattached from react
 * Each time when we need to rerender chart (received a new props) - pass new properties
 */
import React, { Component } from 'react'
import axios from 'axios'
import Highcharts from 'highcharts/highstock'
import { connect } from 'react-redux'
import { store } from '../../../store'
import Picker from 'vanilla-picker'
import { api } from '../../../core/createAPI'
import { ICandle, ICfdOptionsInstrument, IInstrument } from '../../../core/API'
import styled, { css } from 'styled-components'
import ChartControls from './ChartControls'
import ChartBottomPanel from './ChartBottomPanel'
import { chartPeriodOptions, chartPeriodOptionsMobile, IPeriod } from './period'
import GlobalLoader from '../../ui/GlobalLoader'
import {
  MobileTimeFrames,
  TimeFrameItem,
  PlotLineLabel,
  PurchaseTime,
} from './styled'
import {
  lastPriceForSelectedInstrument,
  lastQuoteForSelectedInstrument,
  getInstrumentName,
  getInstrumentObject,
} from '../../selectors/instruments'
import {
  ChartPlotLines,
  quoteLine,
  deadPeriodLine,
  expiryLine,
  breakevenLine,
} from './plotLines'
import { ChartPlotBands, quoteBand } from './plotBands'
import {
  filter,
  findIndex,
  first,
  last,
  slice,
  isEqual,
  includes,
  size,
  dropRight,
  takeRight,
  throttle,
  find,
  chain,
  forEach,
  max,
  min,
  round,
  uniqBy,
} from 'lodash'
import UserStorage from '../../../core/UserStorage'
import { IGame } from '../../../reducers/games'
import Sentiment from './Sentiment'
import {
  IIndicatorMenuItem,
  IIndicatorParam,
  serializeIndicator,
} from './ChartIndicators/menuItems'
import indicatorsList from './ChartIndicators/properties'
import Legend from './ChartIndicators/Legends'
import { isMobileLandscape, replaceByIndex } from '../../../core/utils'
import CircularProgress from './Sentiment/CircularProgress'
import { timeDistanceFormatter } from '../../Sidebar/PositionsPanel/Countdown'
import { renderToString } from 'react-dom/server'
import { IClosedTrade, IOpenTrade } from '../../../core/interfaces/trades'
import { formatCurrency, formatCurrencyById } from '../../selectors/currency'
import PositionInfo from './ChartPositionInfo'
import { actionSetSidebar } from '../../../actions/sidebar'
import Backdrop from '../../Backdrop'
import {
  actionSelectExpiry,
  actionDeselectExpiry,
} from '../../../actions/expiry'
import { actionChangeChartLibrary } from '../../../actions/registry'
import { actionSetSelectedTrade } from '../../../actions/trades'
import { SidebarState } from '../../../reducers/sidebar'
import { balloonTemplate } from './TradeBalloon'
import { ExpiryFlag } from './Countdown'
import { CfdSlider } from './CfdSlider'
import MobileInstrumentsBar from '../MobileInstrumentsBar'
import { LocaleDate } from '../../../core/localeFormatDate'
import { isLoggedIn } from '../../selectors/loggedIn'
import EventEmitter from '../../../core/EventEmitter'
import { t } from 'ttag'
import ChartTradingView from '../../ChartTradingView'
import {
  ChartLibraryConfig,
  ChartLibrary,
  ChartType,
} from '../ChartLibraryConfig'
import { ContainerState } from '../../../reducers/container'
import confetti from 'canvas-confetti'
import {
  isAboveBelowProductType,
  isCfdOptionsProductType,
} from '../../selectors/trading'
import moment from 'moment'
;(function (H) {
  H.wrap(
    H.Pointer.prototype,
    'getHoverData',
    // @ts-ignore
    function (
      proceed: any,
      existingHoverPoint: any,
      existingHoverSeries: any,
      series: any,
      isDirectTouch: any,
      shared: any,
      e: any
    ) {
      // @ts-ignore
      var result = proceed.apply(this, Array.prototype.slice.call(arguments, 1))

      if (result.hoverPoint) {
        result.hoverPoint.originalEvent = e
      }

      return result
    }
  )
})(Highcharts)

require('./chart.scss')
require('highcharts/indicators/indicators-all')(Highcharts)
require('highcharts/modules/drag-panes')(Highcharts)
require('highcharts/modules/price-indicator')(Highcharts)
require('highcharts/modules/full-screen')(Highcharts)
require('highcharts/modules/annotations-advanced')(Highcharts)
require('highcharts/modules/stock-tools')(Highcharts)
require('highcharts/highcharts-more')(Highcharts)
require('highcharts/modules/heikinashi')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts)

Highcharts.AST.allowedTags.push('g')
Highcharts.AST.allowedAttributes.push('viewBox')
Highcharts.AST.allowedAttributes.push('data-reactroot')
Highcharts.AST.allowedAttributes.push('fill-rule')
Highcharts.AST.allowedAttributes.push('transform')
Highcharts.AST.allowedAttributes.push('text-anchor')
Highcharts.AST.allowedAttributes.push('stroke-dashoffset')
Highcharts.AST.allowedAttributes.push('stroke-dasharray')
Highcharts.AST.allowedAttributes.push('aria-valuenow')
Highcharts.AST.allowedAttributes.push('fill-opacity')
Highcharts.AST.allowedAttributes.push('stroke-opacity')

Highcharts.setOptions({
  global: {
    timezoneOffset: new Date().getTimezoneOffset(),
  } as any,
})

if (process.env.NODE_ENV === 'development') window.Highcharts = Highcharts

interface IChartProps {
  instrument: string
  instrumentName: string
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
  instrumentObject: IInstrument
  chartLibraryConfig: ChartLibraryConfig
  currentChartLibrary: ChartLibrary
  currentChartType: ChartType
  actionChangeChartLibrary: (chartLibrary: ChartLibrary) => void
  showBottomPanel: boolean
  bottomPanelHeight: number
  container: ContainerState
  backgroundChart: string
  tradingPanelType: string
  formatCurrency: (input: number) => string
  isAboveBelow: boolean
  distances: any
  showSideMenu: boolean
  collapsedSideMenu: boolean
}

interface ITradeProps {
  trade: IOpenTrade | IClosedTrade
  id: number
  isClosed: boolean
  x: number
  fillColor: string
  shape: string
  title: string
  color: string
  style: object
}

const start = new Date().getTime()

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
  width: ${(props) => (props.isMobile ? '100%' : 'unset')};
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

  .mobile-purchase-time-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`

const ChartArea = styled.div<{
  loggedIn: boolean
  isMobile: boolean
}>`
  display: flex;
  width: 100%;
  background-size: 100% 100%;

  ${(props) =>
    props.isMobile
      ? window.innerHeight < 800
        ? css`
            height: 310px;
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
            height: calc(
              ${window.innerHeight}px -
                ${({ loggedIn }: any) => (loggedIn ? 500 : 400)}px
            );
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
              height: 310px;
              ${isMobileLandscape(props.isMobile)
                ? css`
                    @media (orientation: landscape) {
                      height: calc(
                        ${window.innerHeight}px -
                          ${({ loggedIn }: any) => (loggedIn ? 180 : 98)}px
                      );
                    }
                  `
                : ``}
            `
          : css`
              height: calc(
                ${window.innerHeight}px -
                  ${({ loggedIn }: any) => (loggedIn ? 480 : 410)}px
              );
              ${isMobileLandscape(props.isMobile)
                ? css`
                    @media (orientation: landscape) {
                      height: calc(
                        ${window.innerHeight}px -
                          ${({ loggedIn }: any) => (loggedIn ? 180 : 98)}px
                      );
                    }
                  `
                : ``}
            `
        : css``}
  }

  .highcharts-navigator-mask-inside {
    cursor: pointer !important;
  }
`

enum ChartSeries {
  mainSeries = 'main-series',
  tradesSeries = 'trades-series',
  indicatorSeries = 'indicator-series',
}

let fetchCandlesCancelToken: any = null

enum ChartAxis {
  yAxis = 'chart-y-axis',
  xAXis = 'chart-x-axis',
}

/**
 * Adapter for theme
 */
const colors = {
  gridColor: 'transparent',
  tickColor: '#263346',
  ui: '#FFFFFF',
  border: '#1d2834',
  contrast: '#FFFFFF',
  line: '#75f986',
  up: '#75f986',
  down: '#ff3364',
  upGradient0: 'rgba(117, 249, 134, 0)',
  upGradient1: 'rgba(117, 249, 134, 0.2)',
  downGradient0: 'rgba(255, 51, 100, 0)',
  downGradient1: 'rgba(255, 51, 100, 0.2)',
  mask: '#141f2c',
  areaUp: 'rgba(117, 249, 134, 0.5)',
  areaDown: 'rgba(117, 249, 134, 0)',
}

const PULSE_MARKER_CHART_TYPES = ['area', 'line']

const setPulseMarkerVisibility = (isVisible: boolean) => {
  const element: any = document.getElementsByClassName(
    'mgo-widget-call_pulse'
  )[0]
  if (element) element.style.display = isVisible ? 'block' : 'none'
}

const setPulseMarkerColor = (color: string) => {
  const element: any = document.getElementsByClassName(
    'mgo-widget-call_pulse'
  )[0]
  if (element) element.style.backgroundColor = color
}

const positionPulseMarker = (series: any, animate: boolean) => {
  const chart = series.chart
  const lastPoint: any = last(series.points)

  if (chart && chart.pulseMarker && lastPoint) {
    chart.pulseMarker.animate({
      x: lastPoint.plotX - chart.plotLeft - chart.spacing[0] - 23,
      y: lastPoint.plotY + chart.spacing[2] - 18 + 103,
    })
  }

  return chart
}

/**
 * returns current min/max indexes of xData
 * @param event wheelEvent in most cases, but can be any chart event
 * @param zoomLevel level stored in state
 */
const getExtremesIndexes = (event: any, zoomLevel: number) => {
  const { target } = event
  const xAxis = target.xAxis[0]
  const xData = target.series[0].xData
  const { min, max } = xAxis.getExtremes()

  const pointsNum = takeRight(
    xData,
    Math.floor(xData.length * zoomLevel)
  ).length
  const points = filter(xData, (p) => p >= min && p <= max)
  const currentMinPoint = first(points)
  const currentMaxPoint = last(points)
  const maxIndex = findIndex(xData, (p) => p === currentMaxPoint)
  const minIndex = findIndex(xData, (p) => p === currentMinPoint)

  return {
    minIndex,
    maxIndex,
    pointsNum,
  }
}

/**
 * Wheels to the left side of navigator tool
 * @param event wheel event
 * @param component chart component
 */
const wheelLeft = (event: any, component: any) => {
  const { zoomLevel } = component.state
  const { minIndex, maxIndex, pointsNum } = getExtremesIndexes(event, zoomLevel)
  const { target } = event
  const xAxis = target.xAxis[0]
  const xData = target.series[0].xData
  const newMin = xData[minIndex - pointsNum]
  const newMax = xData[maxIndex - pointsNum]
  const getAxisAmination = () => ({
    duration: 200,
    easing: function (t: any) {
      return t
    },
  })

  if (!newMin) {
    const index = takeRight(xData, Math.floor(xData.length * zoomLevel)).length
    xAxis.setExtremes(xData[0], xData[index], true, getAxisAmination())
  } else {
    xAxis.setExtremes(newMin, newMax, true, getAxisAmination())
  }
}

/**
 * Wheels to the right side of navigator tool
 * @param event wheel event
 * @param component chart component
 */
const wheelRight = (event: any, component: any) => {
  const { zoomLevel, candles } = component.state
  const { minIndex, maxIndex, pointsNum } = getExtremesIndexes(event, zoomLevel)
  const { target } = event
  const xAxis = target.xAxis[0]
  const xData = target.series[0].xData
  const newMin = xData[minIndex + pointsNum]
  const newMax = xData[maxIndex + pointsNum]
  const newPoints = filter(xData, (p) => p <= newMax && p >= newMin)
  const lastNewPoint = last(newPoints)
  const lastHistoryPoint = candles[candles.length - 1][0]

  if (newPoints.length <= pointsNum) {
    // xAxis.setExtremes(xAxis.min, null, true)
    return
  } else if (lastHistoryPoint - lastNewPoint === 0) {
    xAxis.setExtremes(newMin, null, true)
  } else if (newMin) {
    xAxis.setExtremes(newMin, newMax, true)
  }
}

/**
 * Wheels up, meaning decreasing zoom level
 * @param component chart component
 */
const wheelUp = (component: any) => {
  const { zoomLevel } = component.state
  component.onChangeZoomLevel(zoomLevel - 0.1)
}

/**
 * Wheels up, meaning increasing zoom level
 * @param component chart component
 */
const wheelDown = (component: any) => {
  const { zoomLevel } = component.state
  component.onChangeZoomLevel(zoomLevel + 0.1)
}

/**
 * return template for tradesSeries point
 * @param direction high/low direction
 * @param isClosed indicated whether trade is closed
 * @param trade trade object itself
 * @param isHover indicated whether hover state
 * @param theme theme object for the chart
 */
const getFlagTitle = (
  direction: number,
  isClosed: boolean,
  trade: IOpenTrade | IClosedTrade,
  isHover: boolean,
  theme: any
) => {
  const {
    flags: { backgroundColor, breakEvenColor },
    candlestick: { lineColor, upLineColor },
  } = theme.plotOptions

  const getExpiredTradeColor = (status: number) => {
    switch (status) {
      case 1:
        return upLineColor
      case -1:
        return lineColor
      default:
        return breakEvenColor
    }
  }

  const fillColor = isClosed
    ? getExpiredTradeColor(trade.status)
    : direction === 1
    ? upLineColor
    : lineColor
  const bgColor = isClosed ? backgroundColor : fillColor
  const borderColor = isClosed ? fillColor : backgroundColor
  const textColor = isClosed ? fillColor : backgroundColor
  const stake = formatCurrencyById(store.getState())(
    trade.stake,
    trade.currency
  )
  const isCfdOptions = !!trade.optionValue
  const label = isCfdOptions ? t`CLOSE` : isClosed ? t`EXPIRED` : t`SELL`

  if (isClosed)
    return `<span class="flag-wrapper" style="background: ${backgroundColor}">
    <span class="flag-title" style="background: ${bgColor};border: 1px solid ${borderColor};">
      <span class="text" style="color: ${breakEvenColor}">${
      direction === 1 ? '&#9650;' : '&#9660;'
    }</span></span></span>`

  return `
    <span class="flag-wrapper" style="background: ${backgroundColor}">
      <span class="flag-title" style="background: ${bgColor};border: 1px solid ${borderColor};">
        <span class="text" style="color: ${textColor}">${
    direction === 1 ? '&#9650;' : '&#9660;'
  }</span>
				</span><div class="flag-datalabel"><div class="line" style="border-top: 1px solid ${fillColor};"></div>
        <span class="label" style="border: 1px solid ${fillColor}; color: ${fillColor}; background: ${backgroundColor}">
					&nbsp;${isHover ? label : ''}<span>${
    isHover ? '&nbsp;@&nbsp;' : ''
  }</span>${stake.replace(/\s/g, '')}&nbsp;</span></span>`
}

/**
 * gets trade properties
 * @param trade trade object itself
 * @param selectedTrade currently selected trade
 * @param isClosed indicated whether trade is closed
 * @param theme theme object for the chart
 */
const getFlagParams = (
  trade: IOpenTrade,
  selectedTrade: any,
  isClosed: boolean,
  theme: any
) => {
  const shape = 'circlepin'
  const { direction } = trade
  const {
    plotOptions: {
      candlestick: { lineColor, upLineColor },
      flags: { closedColor },
    },
  } = theme
  const fillColor = isClosed
    ? closedColor
    : direction === 1
    ? upLineColor
    : lineColor
  const color = isClosed
    ? direction === 1
      ? upLineColor
      : lineColor
    : closedColor
  const title = getFlagTitle(
    direction,
    isClosed,
    trade,
    selectedTrade && selectedTrade.tradeID === trade.tradeID,
    theme
  )

  return {
    fillColor,
    color,
    shape,
    title,
  }
}

/**
 * gets tades properties for flag point depending on trade object
 * @param trade trade object itself
 * @param currentInstrument id of selected instrument
 * @param selectedTrade currently selected trade
 * @param isClosed indicated whether trade is closed
 * @param xAxis xAxis of the chart
 * @param theme theme object for the chart
 */
const getTradeProperties = (
  trade: IOpenTrade,
  currentInstrument: string | number,
  selectedTrade: any,
  isClosed: boolean,
  xAxis: any,
  theme: any
): ITradeProps | undefined => {
  const { dataMin } = xAxis.getExtremes()
  const { tradeID: id, createdTimestamp, instrumentID } = trade

  if (
    Number(instrumentID) === Number(currentInstrument) &&
    createdTimestamp > dataMin
  ) {
    const flagParams = getFlagParams(trade, selectedTrade, isClosed, theme)
    const { shape, title, fillColor, color } = flagParams

    return {
      trade,
      id,
      isClosed,
      x: createdTimestamp,
      fillColor,
      shape,
      title,
      color: fillColor,
      style: {
        color,
      },
    }
  }
}

/**
 * Mounts chart
 * @param data - chart data
 * @param component - react component instance
 * @param chartConfig - config from registry
 * @param theme
 * @param isMobile
 */
const mountChart = (
  data: ICandle[],
  component: any,
  chartConfig: any,
  theme: any,
  isMobile: boolean,
  timeframe: IPeriod,
  zoomLevel: number
) => {
  const xAxis = {
    id: ChartAxis.xAXis,
    gridLineWidth: 1,
    tickWidth: 0,
    gridZIndex: 1,
    ordinal: false,
    gridLineColor: theme.xAxis.gridLineColor,
    lineColor: theme.xAxis.lineColor,
    allowDecimals: false,
    range: timeframe.range,
    overscroll: timeframe.range / 3,
    minRange: (timeframe.range / 3) * 2,
    labels: {
      y: -5,
    },
    crosshair: {
      width: 1,
      color: theme.crosshair.color,
    },
    events: {
      afterSetExtremes(e: any) {
        const { min, max } = e
        const { timeframe } = component.state
        const { range } = timeframe
        const zoomLevel = Math.round(((max - min) / range) * 2) / 2
        component.setState({ zoomLevel })
      },
    },
  }

  const yAxis = [
    {
      id: ChartAxis.yAxis,
      gridLineWidth: 1,
      gridZIndex: 1,
      gridLineColor: theme.yAxis.gridLineColor,
      lineColor: theme.yAxis.lineColor,
      crosshair: {
        width: 0,
        color: theme.crosshair.color,
      },
      offset: 70,
      tickPixelInterval: 52,
      minPadding: 0.1, // defaults 0.05
      tickAmount: 8,
      tickPositioner: function (this: any) {
        const { tickAmount, tickInterval } = component.getCfdYAxisValue()
        const { isCfdOptions } = component.props

        if (!isCfdOptions || !tickAmount || !tickInterval) {
          return
        }

        let lastPointY

        const isOddTickAmount = tickAmount % 2 !== 0
        const tickPositions = [],
          tickNumber = Math.min(tickAmount + (isOddTickAmount ? 0 : 1), 16),
          series = this.series[0],
          yAxis = this

        if (series) {
          const data = series.processedYData
          if (data.length && yAxis.dataMin !== yAxis.dataMax) {
            const lastY = last<any>(component.state.candles)
            lastPointY = lastY[4] || lastY[1]

            let interval = Math.max(
              lastPointY - (yAxis.dataMin - tickInterval || 0),
              (yAxis.dataMax + tickInterval || 0) - lastPointY
            )

            let lastInt = Math.ceil(interval / tickInterval) * tickInterval

            for (
              let i = lastPointY - lastInt;
              i <= lastPointY + lastInt;
              i += tickInterval || lastInt / tickNumber
            ) {
              tickPositions.push(round(i, 5))
            }
          }

          if (tickPositions.length && tickPositions.length < 100)
            return tickPositions.length % 2 === 0
              ? tickPositions.slice(1, tickPositions.length)
              : tickPositions
        }
      },
    },
  ]

  const stockToolsProperties = {
    gui: {
      enabled: false,
    },
  }

  const annotationsObserver = new MutationObserver((mutationList) => {
    const inputMap = {
      'highcharts-annotation-fill': 'color',
      'highcharts-annotation-stroke': 'color',
      'highcharts-annotation-backgroundColor': 'color',
      'highcharts-annotation-color': 'color',
    }
    for (let mutation of mutationList) {
      for (let child of mutation.addedNodes) {
        const node: any = child
        const tagName = node.tagName.toLowerCase()
        if (tagName === 'input') {
          const rect = node.getBoundingClientRect()
          const parentRect = node.closest('div').getBoundingClientRect()
          const type = (inputMap as any)[node.name]
          if (type) {
            const wrapper = document.createElement('div')
            wrapper.style.width = '60px'
            wrapper.style.height = '40px'
            wrapper.style.position = 'absolute'
            wrapper.style.right = '20px'
            wrapper.style.top = `${rect.y - parentRect.y}px`
            wrapper.style.zIndex = '11'

            node.parentNode.insertBefore(wrapper, child)

            const picker = new Picker({
              parent: wrapper,
              editorFormat: 'rgb',
            })
            picker.onChange = function (color) {
              node.value = color.rgbaString
              wrapper.style.backgroundColor = color.rgbaString
            }

            wrapper.style.backgroundColor =
              node.value && node.value !== 'none' ? node.value : 'rgb(0, 0, 0)'
            node.style.opacity = '0'
          }
        }
      }
    }
  })

  const navigationProperties = {
    bindingsClassName: 'tools-container',
    events: {
      showPopup(event: any) {
        const target = event.annotation.graphic.element
        const toolbar: any = document.getElementsByClassName(
          'highcharts-annotation-toolbar'
        )[0]
        if (target.getBoundingClientRect) {
          const rect = target.getBoundingClientRect()
          toolbar.style.top = `${rect.top - 80}px`
          toolbar.style.left = `${rect.left - 90}px`
        }

        const [, , removeButton, editButton] = toolbar.childNodes
        const destroySvg = document.getElementById('toolbar-destroy-icon')
        const editSvg = document.getElementById('toolbar-edit-icon')

        if (destroySvg && editSvg) {
          const destroyNode = destroySvg.cloneNode(true)
          const editNode = editSvg.cloneNode(true)
          removeButton.appendChild(destroyNode)
          editButton.appendChild(editNode)

          removeButton.style.backgroundColor = colors.border
          editButton.style.backgroundColor = colors.border

          if (event.annotation.options.type === 'basicAnnotation')
            editButton.style.display = 'none'

          const annotationToolbar = document.getElementsByClassName(
            'highcharts-annotation-toolbar'
          )
          annotationsObserver.observe(annotationToolbar[0], {
            childList: true,
            subtree: true,
          })
        }
      },
      closePopup: function () {
        annotationsObserver.disconnect()
      },
    },
    bindings: {
      circleAnnotation: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      rectangleAnnotation: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      labelAnnotation: {
        annotationsOptions: {
          labelOptions: {
            // backgroundColor: $mdColors.getThemeColor('default-accent-hue-1-0.3'),
          },
        },
      },
      arrowRay: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      arrowSegment: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      ray: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      segment: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      horizontalLine: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      crooked3: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      crooked5: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      elliott3: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      elliott5: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      verticalCounter: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      verticalLabel: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      verticalArrow: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      verticalLine: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
        },
      },
      parallelChannel: {
        annotationsOptions: {
          shapeOptions: {
            stroke: theme.priceLine.color,
            fill: theme.priceLine.color,
          },
          typeOptions: {
            background: {
              // fill: $mdColors.getThemeColor('default-accent-hue-1-0.3')
            },
          },
        },
      },
      measureXY: {
        annotationsOptions: {
          typeOptions: {
            crosshairX: {
              stroke: theme.priceLine.color,
              fill: theme.priceLine.color,
            },
            background: {
              // fill: $mdColors.getThemeColor('default-accent-hue-1-0.3')
            },
          },
        },
      },
      measureX: {
        annotationsOptions: {
          typeOptions: {
            crosshairX: {
              stroke: theme.priceLine.color,
              fill: theme.priceLine.color,
            },
            background: {
              // fill: $mdColors.getThemeColor('default-accent-hue-1-0.3')
            },
          },
        },
      },
      measureY: {
        annotationsOptions: {
          typeOptions: {
            crosshairY: {
              stroke: theme.priceLine.color,
              fill: theme.priceLine.color,
            },
            background: {
              // fill: $mdColors.getThemeColor('default-accent-hue-1-0.3')
            },
          },
        },
      },
    },
  }

  const instance = Highcharts.stockChart({
    rangeSelector: {
      enabled: false,
    },
    chart: {
      renderTo: 'chart-container',
      margin: 0,
      marginRight: 80,
      marginBottom: isMobile ? 10 : 30,
      marginTop: isMobile ? 10 : 100,
      plotBorderColor: theme.plotBorderColor,
      plotBorderWidth: 1,
      panning: {
        enabled: true,
      },
      zooming: {
        mouseWheel: {
          enabled: false,
        },
        resetButton: {
          theme: {
            style: { display: 'none' },
          },
        },
      },
      // plotBackgroundColor: {
      //   linearGradient: [0, 174, 0, window.innerHeight],
      //   stops: [
      //     [0, 'rgba(0, 0, 0, 0)'],
      //     [1, 'rgba(0, 0, 0, 0.4)'],
      //   ],
      // },
      plotBackgroundColor: 'transparent',
      spacingBottom: 30,
      events: {
        load(e: any) {
          const chart = this as any
          chart.pulseMarker = chart.renderer
            .text("<span class='mgo-widget-call_pulse'></span>", 200, 200, true)
            .add()
          setPulseMarkerColor(theme.pulseMarker.color)

          // document.addEventListener(
          //   'keydown',
          //   throttle((event) => {
          //     const { code } = event
          //     switch (code) {
          //       case 'ArrowUp': {
          //         wheelUp(component)
          //         break
          //       }
          //       case 'ArrowDown': {
          //         wheelDown(component)
          //         break
          //       }
          //       case 'ArrowLeft': {
          //         wheelLeft(e, component)
          //         break
          //       }
          //       case 'ArrowRight': {
          //         wheelRight(e, component)
          //         break
          //       }
          //     }
          //   }, 400)
          // )

          let prevDeltaX: number
          let prevDeltaY: number
          document.addEventListener(
            'wheel',
            throttle((event) => {
              const isChartContainer = chart.renderTo.contains(event.target)
              if (!isChartContainer || component.props.isMobile)
                return event.preventDefault()

              const { deltaX, deltaY, ctrlKey } = event
              if (ctrlKey) {
                event.preventDefault()

                if (deltaY < 1 && prevDeltaY < 0) {
                  wheelUp(component)
                } else if (deltaY > 0 && prevDeltaY > 0) {
                  wheelDown(component)
                }

                prevDeltaX = deltaX
                prevDeltaY = deltaY

                return event.preventDefault()
              }

              if (deltaX < 0 && prevDeltaX < 0) {
                wheelLeft(e, component)
              } else if (deltaX > 0 && prevDeltaX > 0) {
                wheelRight(e, component)
              } else if (
                deltaX === 0 &&
                deltaY > 0 &&
                prevDeltaX === 0 &&
                prevDeltaY > 0
              ) {
                wheelUp(component)
              } else if (
                deltaX === 0 &&
                deltaY < 0 &&
                prevDeltaX === 0 &&
                prevDeltaY < 0
              ) {
                wheelDown(component)
              }

              prevDeltaX = deltaX
              prevDeltaY = deltaY
            }, 400),
            { passive: false }
          )

          document.addEventListener(
            'wheel',
            (event) => {
              if (event.ctrlKey) event.preventDefault()
            },
            { passive: false }
          )

          component.onChartReady()
        },
        render(this: any) {
          const { direction, candles, clickedTrade } = component.state
          const { isCfdOptions, cfdDirection, theme } = component.props
          const xAxis = this.get(ChartAxis.xAXis)
          const yAxis = this.get(ChartAxis.yAxis)
          const mainSeries = this.get(ChartSeries.mainSeries)
          const { max } = xAxis.getExtremes()
          positionPulseMarker(mainSeries, false)

          const lastY = last<any>(candles)
          const lastPoint = last<any>(mainSeries.points)
          const lastPointY = lastY[4] || lastY[1]

          const toPixelLastPointY = yAxis.toPixels(lastPointY)

          component.redrawChartLastQuote(lastPointY, lastY[0], direction)

          if (this.priceLineLabel) {
            this.priceLineLabel.attr({
              text: lastPointY,
            })
            if (!isNaN(toPixelLastPointY))
              this.priceLineLabel.animate({
                translateX: this.chartWidth - 75,
                translateY: toPixelLastPointY - 12,
              })
          } else {
            const { priceLine } = theme.chart
            this.priceLineLabel = this.renderer
              .label(
                lastPointY,
                lastPoint.plotX + this.plotLeft + 8,
                lastPoint.plotY + this.plotTop - 12,
                'callout',
                lastPoint.plotX + this.plotLeft,
                lastPoint.plotY + this.plotTop
              )
              .css({
                color: theme.tradebox.marketPrice,
                fontWeight: 600,
                fontFamily: 'Roboto, sans-serif',
                fontSize: 12,
              })
              .attr({
                fill: priceLine.color,
                r: 4,
                zIndex: 99,
                padding: 3,
              })
              .add()
          }
          yAxis.removePlotLine(ChartPlotLines.breakeven)
          if (isCfdOptions && cfdDirection) {
            component.addCfdBreakevenLine(cfdDirection, lastPointY)
          }

          if (this.breakeven_line_position?.element)
            this.breakeven_line_position?.destroy()
          if (this.breakevenLabel?.element) this.breakevenLabel?.destroy()

          if (isCfdOptions && clickedTrade) {
            const {
              strike,
              optionValue,
              direction,
              createdTimestamp: xTrade,
            } = clickedTrade
            const breakevenValue = round(
              direction === 1
                ? strike + (optionValue ?? 0)
                : strike - (optionValue ?? 0),
              4
            )
            const color = direction === -1 ? colors.down : colors.up
            const path = [
              'M',
              xAxis.toPixels(xTrade),
              yAxis.toPixels(breakevenValue),
              'L',
              xAxis.toPixels(max),
              yAxis.toPixels(breakevenValue),
            ]
            this.breakeven_line_position = this.renderer
              .path(path)
              .attr({
                'stroke-width': 1,
                dashstyle: 'ShortDash',
                stroke: color,
                id: 'x',
              })
              .add()

            this.breakevenLabel = this.renderer
              .label(
                `${t`Breakeven`}: ${breakevenValue}`,
                xAxis.toPixels(max) - 50,
                yAxis.toPixels(breakevenValue) - 10,
                'callout'
              )
              .css({
                color: '#75F986',
                fontSize: 11,
              })
              .attr({
                fill: '#06141F',
                r: 20,
                zIndex: 99,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 2,
                paddingBottom: 2,
                style: {
                  padding: '2px 10px',
                },
              })
              .add()
          }

          const tradesSeries = this.get(ChartSeries.tradesSeries)
          const tradesSeriesData = tradesSeries?.data

          // Remove old horizontal lines
          if (tradesSeriesData?.length > 0) {
            tradesSeriesData.forEach((item: any) => {
              const { id } = item
              if (this[`line_${id}`]?.element) this[`line_${id}`]?.destroy()
            })
          }

          if (!isCfdOptions) {
            const expiryLine = component.getPlotLineOrBand(
              xAxis,
              ChartPlotLines.expiry
            )

            if (tradesSeriesData?.length > 0 && expiryLine) {
              tradesSeriesData.forEach((item: any) => {
                const { id, x, color, trade, isClosed } = item
                if (!isClosed) {
                  const point = this.get(id)
                  if (point) {
                    const chartPlotY = this.plotTop
                    const { plotY } = point
                    const yCoordinate = plotY + chartPlotY
                    const path = [
                      'M',
                      xAxis.toPixels(x),
                      yCoordinate,
                      'L',
                      xAxis.toPixels(
                        max > trade.expiryTimestamp
                          ? trade.expiryTimestamp
                          : max
                      ),
                      yCoordinate,
                    ]
                    this[`line_${id}`] = this.renderer
                      .path(path)
                      .attr({
                        'stroke-width': 1,
                        dashstyle: 'LongDash',
                        stroke: color,
                        id: 'x',
                      })
                      .add()
                  }
                }
              })
            }
          }
        },
      },
    },
    xAxis,
    yAxis,
    series: [
      {
        id: ChartSeries.mainSeries,
        name: component.props.instrumentName,
        threshold: null,
        turboThreshold: 0,
        type: component.state.chartType,
        zIndex: 1,
        showInNavigator: true,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
              animation: false,
              fillColor: theme.series.markerFillColor,
              lineWidth: 0,
            },
          },
        },
        data,
      },
      {
        id: ChartSeries.tradesSeries,
        animation: false,
        type: 'flags',
        data: [],
        cursor: 'pointer',
        width: 9,
        height: 9,
        linkedTo: 'main-series',
        lineWidth: 1,
        y: -5,
        useHTML: true,
        zIndex: 2,
        style: {
          cursor: 'pointer',
          position: 'absolute',
          zIndex: 99,
        },
        dataLabels: {
          enabled: false,
          useHTML: true,
          formatter: function () {
            return ''
          },
          y: 20,
        },
        tooltip: {
          enabled: false,
          pointFormat: undefined,
          followTouchMove: false,
        },
        shadow: true,
        states: {
          hover: {
            enabled: false,
          },
        },
        point: {
          events: {
            click: function (this: any, e: any) {
              const { trade, isClosed } = this
              if (!isClosed) {
                component.setState({
                  clickedTrade: trade,
                  clickedTradeX: e.clientX,
                  clickedTradeY: e.clientY - (trade.direction === 1 ? 0 : 160),
                })
                const _this = this as any
                if (trade) {
                  const title = getFlagTitle(
                    trade.direction,
                    isClosed,
                    trade,
                    true,
                    theme
                  )
                  if (!_this.isClicked) _this.update({ title })
                  component.props.actionSelectExpiry(trade.expiryTimestamp)
                  component.props.actionSetSelectedTrade(trade)
                }
              } else {
                if (trade) component.props.actionSetSelectedTrade(trade)
                component.props.actionSetSidebar(SidebarState.positions)
              }
            },
            mouseOut: function (e: any) {
              const _this = this as any
              const { openTrades, closedTrades } = component.props
              const trade = find(
                [...openTrades, ...closedTrades],
                (t: any) => t.tradeID === _this.trade.tradeID
              )
              const { isClosed } = _this

              if (trade) {
                const title = getFlagTitle(
                  trade.direction,
                  isClosed,
                  trade,
                  false,
                  theme
                )
                if (!_this.isClicked && !component.state.clickedTrade)
                  _this.update({ title })
              }
            },
            mouseOver: function (e: any) {
              const _this = this as any
              const { openTrades, closedTrades } = component.props
              const trade = find(
                [...openTrades, ...closedTrades],
                (t: any) => t.tradeID === _this.trade.tradeID
              )

              const { isClosed } = _this
              if (trade) {
                const title = getFlagTitle(
                  trade.direction,
                  isClosed,
                  trade,
                  true,
                  theme
                )
                _this.update({ title, isClicked: false })
              }
            },
          },
        },
        title: '',
      },
      {
        id: ChartSeries.indicatorSeries,
        className: 'indicators-series',
        type: 'line',
        data,
        useOhlcData: component.state.timeframe.period !== 'tick',
        tooltip: {
          enabled: false,
          formatter() {
            return false
          },
          pointFormatter() {
            return false
          },
          followTouchMove: false,
        },
      },
    ],
    stockTools: stockToolsProperties,
    navigation: navigationProperties,
    plotOptions: {
      series: {
        dataGrouping: {
          enabled: false,
        },
        marker: {
          enabled: false,
        },
        allowPointSelect: false,
        point: {
          events: {
            mouseOver: function () {
              // @ts-ignore
              const chart = this.series.chart,
                point = this

              const { xAxis, yAxis } = component.getAxis()

              // @ts-ignore
              const { x, y, plotX, plotY } = point
              const xCoordinate = xAxis.toPixels(x)
              const yCoordinate = yAxis.toPixels(y)

              // @ts-ignore
              const { chartY } = this.originalEvent
              let pathX = [
                'M',
                xCoordinate,
                chart.plotTop,
                'L',
                xCoordinate,
                yCoordinate,
              ]
              if (chartY > yCoordinate) {
                pathX = [
                  'M',
                  xCoordinate,
                  chart.plotTop,
                  'L',
                  xCoordinate,
                  chart.plotHeight + chart.plotTop,
                ]
              }
              const pathY = ['M', 0, chartY, 'L', chart.plotSizeX, chartY]

              if (chart.crosshairLineX) {
                chart.crosshairLineX = chart.crosshairLineX.destroy()
              }
              if (chart.crosshairLineY) {
                chart.crosshairLineY = chart.crosshairLineY.destroy()
              }

              chart.crosshairLineX = chart.renderer
                .path(pathX)
                .attr({
                  'stroke-width': 1,
                  stroke: '#8491a3',
                  dashstyle: 'LongDash',
                  id: 'crosshair-line-x',
                })
                .add()

              chart.crosshairLineY = chart.renderer
                .path(pathY)
                .attr({
                  'stroke-width': 1,
                  stroke: '#8491a3',
                  dashstyle: 'LongDash',
                  id: 'crosshair-line-y',
                })
                .add()

              chart.crosshairLabel = chart.renderer
                .label(y, chart.plotLeft, chart.plotTop + plotY, 'callout')
                .css({
                  fontSize: 11,
                  fontWeight: 600,
                  color: theme.tooltip.color,
                })
                .attr({
                  fill: theme.tooltip.backgroundColor,
                  'stroke-width': 1,
                  // stroke: theme.tooltip.color,
                  zIndex: 8,
                  padding: 5,
                  r: 5,
                })
                .add()

              const bBox = chart.crosshairLabel.getBBox()

              chart.crosshairLabel.attr({
                x: chart.plotWidth + 5,
                // y: chart.plotTop + plotY - bBox.height / 2,
                y: chartY - bBox.height / 2,
                anchorX: chart.plotLeft + plotX,
                anchorY: chart.plotTop + plotY,
              })
            },
            mouseOut: function () {
              // @ts-ignore
              const chart = this.series.chart

              if (chart.crosshairLabel) {
                chart.crosshairLabel = chart.crosshairLabel.destroy()
              }
              if (chart.crosshairLineY) {
                chart.crosshairLineY = chart.crosshairLineY.destroy()
              }
              if (chart.crosshairLineX) {
                chart.crosshairLineX = chart.crosshairLineX.destroy()
              }
            },
          },
        },
      },
      line: {
        color: theme.plotOptions.line.color,
      },
      area: {
        color: theme.plotOptions.area.color,
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, theme.plotOptions.area.linearGradientUp],
            [1, theme.plotOptions.area.linearGradientDown],
          ],
        },
      },
      column: {},
      ohlc: {
        color: theme.plotOptions.ohlc.color,
      },
      candlestick: {
        color: theme.plotOptions.candlestick.color,
        lineColor: theme.plotOptions.candlestick.lineColor,
        upColor: theme.plotOptions.candlestick.upColor,
        upLineColor: theme.plotOptions.candlestick.upLineColor,
      },
      heikinashi: {
        color: theme.plotOptions.candlestick.color,
        lineColor: theme.plotOptions.candlestick.lineColor,
        upColor: theme.plotOptions.candlestick.upColor,
        upLineColor: theme.plotOptions.candlestick.upLineColor,
      },
    },
    tooltip: {
      enabled: true,
      followTouchMove: false,
      borderWidth: 0,
      backgroundColor: theme.tooltip.backgroundColor,
      style: {
        color: theme.tooltip.color,
      },
      formatter: function (this: any) {
        return [LocaleDate.format(this.x, 'EEEE, LLL d, HH:mm:ss')].concat(
          this.points
            ?.filter(
              (point: any) =>
                point.series.userOptions.id === ChartSeries.mainSeries
            )
            .map((point: any) => {
              // return `<span style="font-size: 12px; color:${point.color}">● </span><span style="color: ${theme.tooltip.color}">${component.props.instrumentName}: </span> <b>${point.y}</b><br/>`
              return ''
            }) ?? []
        )
      },
    },
    scrollbar: {
      enabled: false,
    },
    navigator: {
      enabled: true,
      series: {
        lineColor: theme.navigator.seriesLineColor,
      },
      xAxis: {
        gridLineWidth: 0,
        labels: {
          enabled: true,
        },
        zoomEnabled: false,
        range: timeframe.range,
        overscroll: timeframe.range / 3,
        ordinal: false,
        minRange: (timeframe.range / 3) * 2,
      },
      height: 52,
      outlineWidth: 0,
      outlineColor: theme.navigator.outlineColor,
      margin: 0,
      handles: {
        width: 7,
        height: 18,
        borderRadius: 6,
      },
      maskFill: theme.navigator.maskFill,
      maskInside: false,
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  } as any)

  return instance
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
  zoomLevel: number
  indicators: any[]
  clickedIndicator: any
  clickedIndicatorX: any
  clickedIndicatorY: any
  clickedTrade: any
  clickedTradeX: any
  clickedTradeY: any
  isScrolling: boolean
  userClickNavigator: boolean
  isResetZoom: boolean
}

export const IndicatorsContext = React.createContext<any>({})

/**
 * Main component which holds chart state like candles, zoom level
 */
class Chart extends Component<IChartProps, IChartState> {
  chartInstance: any | null
  eventEmitter: any | null
  eventEmitterClosed: any | null
  lastPosY: any | null

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
      navigator: false,
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
      zoomLevel: 1,
      timeframe,
      chartType,
      isScrolling: false,
      userClickNavigator: false,
      isResetZoom: false,
    }
    this.chartInstance = null
    this.eventEmitter = null
    this.eventEmitterClosed = null
  }

  /**
   * Get yAxis/xAxis plot line or band by id
   */
  getPlotLineOrBand = (axis: any, id: ChartPlotLines | ChartPlotBands) => {
    for (let i = 0; i < axis.plotLinesAndBands.length; i++) {
      if (axis.plotLinesAndBands[i].id === id) {
        return axis.plotLinesAndBands[i]
      }
    }
  }

  /**
   * If plot line label is defined animate it with plot line
   * otherwise - destroy plot line
   */
  redrawPlotLine = (
    plotLine: any,
    yAxis: any,
    value: number,
    animate: boolean = true
  ) => {
    const { svgElem, axis } = plotLine
    const lastPos = yAxis.toPixels(value)
    const currentPos = yAxis.toPixels(plotLine.options.value)

    if (!(isNaN(lastPos) || isNaN(currentPos))) {
      const translateY = lastPos - currentPos
      plotLine.svgElem.animate({ translateY }, animate)
    }
  }

  redrawPlotBand = (plotBand: any, from: number, to: number) => {
    plotBand.options.to = to
    plotBand.options.from = from
    plotBand.render()
  }

  calculateHeikinAshiPoint = (previousPoint: any, point: any) => {
    const { instrumentObject } = this.props
    const { precision } = instrumentObject
    const [previousOpen, previousClose] = [previousPoint[1], previousPoint[4]]
    const [timestamp, open, high, low, close] = [
      point[0],
      point[1],
      point[2],
      point[3],
      point[4],
    ]
    const haOpen = (previousOpen + previousClose) / 2
    const haClose = (open + high + low + close) / 4
    const haHigh = Math.max(high, haClose, haOpen)
    const haLow = Math.min(low, haClose, haOpen)
    return [
      timestamp,
      Number(haOpen.toFixed(precision)),
      Number(haHigh.toFixed(precision)),
      Number(haLow.toFixed(precision)),
      Number(haClose.toFixed(precision)),
    ]
  }

  calculateHeikinAshiDataPoints = (data: ICandle[]) => {
    const returnData: any[] = []
    const chainData = chain(data)
      .sortBy((p) => p.timestamp)
      .map((p) => [p.timestamp, p.open, p.high, p.low, p.close])
      .value()
    chainData.forEach((p, index) => {
      if (index > 0) {
        const point = returnData[returnData.length - 1]
        const newPoint: any = this.calculateHeikinAshiPoint(point, p)
        returnData.push(newPoint)
      } else {
        returnData.push(p)
      }
    })
    return returnData
  }

  /**
   * This function creates series data in line/area format
   * Currently it is required since useOhlcData (https://api.highcharts.com/highstock/series.line.useOhlcData)
   * is not supported properly for area chart type, and we should use [p.timestamp, p.open, p.high, p.low, p.close]
   * format for main series to be portable across line/area/candlestick chart types
   */
  createSeriesData = (data: ICandle[], newChartType?: any): any => {
    const { chartType, timeframe } = this.state
    const { period } = timeframe

    const typeChart = newChartType || chartType

    if (typeChart === 'heikinashi') {
      return this.calculateHeikinAshiDataPoints(data)
    } else {
      if (period === 'tick') {
        return chain(data)
          .sortBy((p: any) => p[0]) // sortBy should be applied to avoid https://www.highcharts.com/errors/15/
          .value()
      }

      return chain(data)
        .sortBy((p) => p.timestamp) // sortBy should be applied to avoid https://www.highcharts.com/errors/15/
        .map((p) => [p.timestamp, p.open, p.high, p.low, p.close])
        .value()
    }
  }

  /**
   * If chart instance is defined - set data
   * otherwise - create chart instance
   */
  createOrUpdateChart = (isUpdateChart: boolean = true) => {
    if (this.chartInstance) {
      this.setChartData(this.state.candles)
      this.resetChartZoom(true)
      setTimeout(() => {
        this.chartInstance.update({
          navigator: {
            enabled: this.state.navigator,
          },
        })
      }, 500)
    } else {
      this.chartInstance = mountChart(
        this.state.candles,
        this,
        this.props.chartConfig,
        this.props.theme.chart,
        this.props.isMobile,
        this.state.timeframe,
        this.state.zoomLevel
      )
      this.resetChartZoom(false)
      this.chartInstance.update({
        navigator: {
          enabled: false,
        },
      })
    }

    this.onRenderGame(this.props.game, true)
    this.onRenderExpiry(this.props.selectedExpiry)
    this.onRenderTrades()
    setTimeout(() => {
      this.setState({ loading: false })
    }, 1000)
  }

  resetChartZoom = (isUpdateChart: boolean = true) => {
    this.setState({ isResetZoom: true }, () => {
      this.onChangeZoomLevel(1, isUpdateChart, true)
    })
  }

  changeChartType = async (
    currentChartType: ChartType,
    chartType: ChartType
  ) => {
    if (this.chartInstance) {
      if (
        (currentChartType !== ChartType.heikinashi &&
          chartType === ChartType.heikinashi) ||
        (currentChartType === ChartType.heikinashi &&
          chartType !== ChartType.heikinashi)
      ) {
        await this.onFetchCandles(false)
      }
      const mainSeries = this.chartInstance.get(ChartSeries.mainSeries)
      mainSeries.update(
        {
          type: chartType,
        },
        false
      )
      mainSeries.setData(this.state.candles)
      setPulseMarkerVisibility(
        !this.props.isMobile && includes(PULSE_MARKER_CHART_TYPES, chartType)
      )
    }
  }

  redrawAboveBelowLastPrice = (
    lastPrice: number,
    timestamp: number,
    animate: boolean = true
  ) => {
    if (this.chartInstance) {
      if (!this.props.isAboveBelow) {
        if (this.chartInstance.aboveLine) {
          this.chartInstance.aboveLine = this.chartInstance.aboveLine.destroy()
        }
        if (this.chartInstance.aboveLineLabel) {
          this.chartInstance.aboveLineLabel =
            this.chartInstance.aboveLineLabel.destroy()
        }
        if (this.chartInstance.belowLine) {
          this.chartInstance.belowLine = this.chartInstance.belowLine.destroy()
        }
        if (this.chartInstance.belowLineLabel) {
          this.chartInstance.belowLineLabel =
            this.chartInstance.belowLineLabel.destroy()
        }
      }

      if (this.props.isAboveBelow && this.props.distances && this.props.game) {
        const { instrumentObject, distances, game } = this.props
        const { precision } = instrumentObject
        const distance = distances.find((d: any) =>
          moment(d.timestamp).isSame(moment(game.timestamp))
        )
        const { xAxis, yAxis } = this.getAxis()
        const { max } = xAxis.getExtremes()
        const xCoordinate = xAxis.toPixels(timestamp)
        const xCoordinateMax = xAxis.toPixels(max)
        const abovePrice = lastPrice + distance?.distance || 0
        const yCoordinateAbove = yAxis.toPixels(abovePrice)
        const belowPrice = lastPrice - distance?.distance || 0
        const yCoordinateBelow = yAxis.toPixels(belowPrice)

        const abovePath = [
          'M',
          xCoordinate,
          yCoordinateAbove,
          'L',
          xCoordinateMax,
          yCoordinateAbove,
        ]
        if (!this.chartInstance.aboveLine) {
          this.chartInstance.aboveLine = this.chartInstance.renderer
            .path(abovePath)
            .attr({
              'stroke-width': 2,
              stroke: this.props.theme.tradebox.highNormal,
              dashstyle: 'ShortDash',
              id: 'above-line',
            })
            .add()

          this.chartInstance.aboveLineLabel = this.chartInstance.renderer
            .label(
              abovePrice.toFixed(precision),
              this.chartInstance.plotLeft,
              this.chartInstance.plotTop,
              'callout'
            )
            .css({
              fontSize: 12,
              color: this.props.theme.tradebox.marketPrice,
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
            })
            .attr({
              fill: this.props.theme.tradebox.highNormal,
              'stroke-width': 1,
              zIndex: 99,
              padding: 5,
              r: 4,
            })
            .add()

          const bBoxAbove = this.chartInstance.aboveLineLabel.getBBox()

          this.chartInstance.aboveLineLabel.attr({
            x: this.chartInstance.plotWidth + 5,
            y: yCoordinateAbove - bBoxAbove.height / 2,
            anchorX: this.chartInstance.plotLeft,
            anchorY: this.chartInstance.plotTop,
          })
        } else {
          this.chartInstance.aboveLine.attr({ d: abovePath })

          const bBoxAbove = this.chartInstance.aboveLineLabel.getBBox()

          this.chartInstance.aboveLineLabel.attr({
            text: abovePrice.toFixed(precision),
            x: this.chartInstance.plotWidth + 5,
            y: yCoordinateAbove - bBoxAbove.height / 2,
            anchorX: this.chartInstance.plotLeft,
            anchorY: this.chartInstance.plotTop,
          })
        }

        const belowPath = [
          'M',
          xCoordinate,
          yCoordinateBelow,
          'L',
          xCoordinateMax,
          yCoordinateBelow,
        ]

        if (!this.chartInstance.belowLine) {
          this.chartInstance.belowLine = this.chartInstance.renderer
            .path(belowPath)
            .attr({
              'stroke-width': 2,
              stroke: this.props.theme.tradebox.lowNormal,
              dashstyle: 'ShortDash',
              id: 'below-line',
            })
            .add()

          this.chartInstance.belowLineLabel = this.chartInstance.renderer
            .label(
              belowPrice.toFixed(precision),
              this.chartInstance.plotLeft + 8,
              this.chartInstance.plotTop - 14,
              'callout',
              this.chartInstance.plotLeft,
              this.chartInstance.plotTop
            )
            .css({
              fontSize: 12,
              color: this.props.theme.tradebox.marketPrice,
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
            })
            .attr({
              fill: this.props.theme.tradebox.lowNormal,
              'stroke-width': 1,
              zIndex: 99,
              padding: 5,
              r: 4,
            })
            .add()

          const bBoxBelow = this.chartInstance.belowLineLabel.getBBox()

          this.chartInstance.belowLineLabel.attr({
            x: this.chartInstance.plotWidth + 5,
            y: yCoordinateBelow - bBoxBelow.height / 2,
            anchorX: this.chartInstance.plotLeft,
            anchorY: this.chartInstance.plotTop,
          })
        } else {
          this.chartInstance.belowLine.attr({ d: belowPath })

          const bBoxBelow = this.chartInstance.belowLineLabel.getBBox()

          this.chartInstance.belowLineLabel.attr({
            text: belowPrice.toFixed(precision),
            x: this.chartInstance.plotWidth + 5,
            y: yCoordinateBelow - bBoxBelow.height / 2,
            anchorX: this.chartInstance.plotLeft,
            anchorY: this.chartInstance.plotTop,
          })
        }

        this.onRenderGradient(this.props.hoveredDirection)
      }
    }
  }

  redrawChartLastPriceLine = (lastPrice: number, animate: boolean = true) => {
    if (this.chartInstance) {
      const { yAxis } = this.getAxis()
      const { min, max } = yAxis
      const { priceLine } = this.props.theme.chart
      const lineProps = quoteLine(lastPrice, priceLine.color, 2, 9)
      const plotLine = this.getPlotLineOrBand(yAxis, ChartPlotLines.quote)

      if (!plotLine) {
        return yAxis.addPlotLine(lineProps)
      }

      if (plotLine.options.value < min || plotLine.options.value > max) {
        yAxis.removePlotLine(ChartPlotLines.quote)
        return yAxis.addPlotLine(lineProps)
      }

      this.redrawPlotLine(plotLine, yAxis, lastPrice, animate)
    }
  }

  redrawChartLastPriceBand = (from: number, to: number) => {
    if (this.chartInstance) {
      const { yAxis } = this.getAxis()
      const plotBand = this.getPlotLineOrBand(yAxis, ChartPlotBands.quote)
      if (plotBand) {
        this.redrawPlotBand(plotBand, from, to)
      }
    }
  }

  redrawChartLastQuote = (
    lastPrice: number,
    timestamp: number,
    direction: number | null,
    animate: boolean = true
  ) => {
    if (this.chartInstance) {
      if (direction) {
        const { yAxis } = this.getAxis()
        const { min, max } = yAxis.getExtremes()
        const isBuy = direction === 1
        const to = isBuy ? max : min
        this.redrawChartLastPriceBand(lastPrice, to)
      }
      this.redrawChartLastPriceLine(lastPrice, animate)
      this.redrawAboveBelowLastPrice(lastPrice, timestamp, animate)
    }
  }

  /**
   * Set candles data to mainSeries and indicator series
   * @param candles
   */
  setChartData = (candles: number[][]) => {
    const { period } = this.state.timeframe
    const { mainSeries, indicatorSeries } = this.getSeries()
    const mainData = candles

    mainSeries.name = this.props.instrumentName
    mainSeries.setData(mainData, false)
    indicatorSeries.setData(period !== 'tick' ? mainData : [], false)

    this.chartInstance.redraw(false)
  }

  /**
   * add point to mainSeries as well as to indicatorSeries
   * @param newPoint
   */
  addPointToChart = (newPoint: number[]) => {
    this.setState(
      {
        candles: [...this.state.candles, newPoint],
        lastPrice: newPoint[4],
      },
      () => {
        const { period } = this.state.timeframe
        const { mainSeries, indicatorSeries } = this.getSeries()

        mainSeries.addPoint(
          period === 'tick' ? [newPoint[0], newPoint[4]] : newPoint,
          false
        )
        if (period !== 'tick') {
          indicatorSeries?.setData(this.state.candles, false)
        }
      }
    )
  }

  /**
   * update last point of mainSeries as well as of indicatorSeries
   * and update component state
   * @param newPoint
   */
  updateLastChartPoint = (updatedPoint: number[]) => {
    const { chartType, timeframe } = this.state

    this.setState(
      {
        candles: [...dropRight(this.state.candles, 1), updatedPoint],
        lastPrice: updatedPoint[4],
      },
      () => {
        const { mainSeries, indicatorSeries } = this.getSeries()
        const isCandlestick =
          chartType === 'candlestick' || chartType === 'heikinashi'

        const lastPoint: any = last(mainSeries.data)
        const lastIndicatorsPoint: any = last(indicatorSeries.data)
        lastPoint?.update(
          isCandlestick
            ? {
                y: updatedPoint[4],
                open: updatedPoint[1],
                high: updatedPoint[2],
                low: updatedPoint[3],
                close: updatedPoint[4],
              }
            : {
                y: updatedPoint[4],
              },
          false
        )
        if (timeframe.period !== 'tick') {
          lastIndicatorsPoint?.update({
            y: updatedPoint[4],
            open: updatedPoint[1],
            high: updatedPoint[2],
            low: updatedPoint[3],
            close: updatedPoint[4],
          })
        }
      }
    )
  }

  showBalloon = (trade: IOpenTrade, profit: number, numberOfTrades: number) => {
    const { balloon } = this.props.theme.chart
    const backgroundColor =
      profit <= 0 ? balloon.low.backgroundColor : balloon.high.backgroundColor
    const textColor =
      profit <= 0 ? balloon.low.textColor : balloon.high.textColor
    const value = this.props.formatCurrency(profit)
    const mainSeries = this.chartInstance.get(ChartSeries.mainSeries)
    const lastPoint: any | undefined = last(mainSeries.data)
    const { xAxis, yAxis } = this.getAxis()
    xAxis.removePlotLine(
      `${ChartPlotLines.deadPeriod}_${trade.expiryTimestamp}`
    )
    const deadPeriodLineProps = deadPeriodLine(
      trade.expiryTimestamp,
      this.props.theme.primary,
      balloonTemplate(value, backgroundColor, textColor, numberOfTrades),
      -43
    )
    const dpLine = xAxis.addPlotLine({
      ...deadPeriodLineProps,
    })
    dpLine.label.on('click', () => {
      this.props.actionSetSelectedTrade(trade)
      this.props.actionSetSidebar(SidebarState.positions, {
        tab: 1,
      })
    })

    const windowWidth = window.innerWidth
    const xCoordinate = xAxis.toPixels(lastPoint.x) + 60
    const windowHeight = window.innerHeight
    const yCoordinate = yAxis.toPixels(lastPoint.y) + 235

    if (profit > 0)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: xCoordinate / windowWidth, y: yCoordinate / windowHeight },
      })

    setTimeout(() => {
      xAxis.removePlotLine(
        `${ChartPlotLines.deadPeriod}_${trade.expiryTimestamp}`
      )
    }, 3000)
  }

  getCountDownTime = (timestamp: number, deadTime?: number) => {
    const { countDownExpectedTime } = this.state
    const deadPeriod = deadTime || this.state.deadPeriod
    const expiry = this.props.selectedExpiry || this.state.expiry

    const isDead = deadPeriod - timestamp < 0
    const expectedTime =
      (isDead ? expiry : deadPeriod) -
      (isDead ? deadPeriod : countDownExpectedTime)
    const realTime = (isDead ? expiry : deadPeriod) - timestamp
    const fillRate = Math.ceil(((realTime - expectedTime) / expectedTime) * 100)
    const timeDistance = timeDistanceFormatter(realTime)

    return {
      fillRate,
      realTime,
      timeDistance,
    }
  }

  getCountDownColor = (timestamp: number) => {
    const fiveMinutes = 60000 * 5
    // const threeHours = 60000 * 60 * 3

    const {
      countDown: { filledColorUp, filledColorMiddle, filledColorDown },
    } = this.props.theme.chart

    const { expiry, deadPeriod, countDownExpectedTime } = this.state
    const isDead = deadPeriod - timestamp < 0
    const realTime = (isDead ? expiry : deadPeriod) - timestamp

    const from = isDead ? deadPeriod : countDownExpectedTime
    const to = isDead ? expiry : deadPeriod
    const distance = to - from

    const isMiddle =
      distance <= fiveMinutes
        ? realTime <= distance / (isDead ? 1 : 2)
        : realTime <= distance / (isDead ? 1 : 6)
    const isDown =
      distance <= fiveMinutes
        ? realTime <= distance / (isDead ? 6 : 5)
        : realTime <= distance / (isDead ? 180 : 36)

    return isMiddle
      ? filledColorMiddle
      : isDown
      ? filledColorDown
      : filledColorUp
  }

  getCountDownText = (time: number) => {
    const { deadPeriod, expiry } = this.state
    const { fillRate, timeDistance } = this.getCountDownTime(time)
    const {
      countDown: { backgroundColor, normalColor },
    } = this.props.theme.chart
    const filledColor = this.getCountDownColor(time)

    const deadPeriodText =
      deadPeriod - time > 0
        ? renderToString(
            <CircularProgress
              value={fillRate - 100}
              filledColor={filledColor}
              normalColor={normalColor}
              size={34}
              text={timeDistance}
              textColor={filledColor}
              thickness={2}
              withBackground={true}
              backgroundColor={backgroundColor}
              fontSize={12}
            />
          )
        : renderToString(
            <CircularProgress
              value={fillRate - 100}
              filledColor={filledColor}
              normalColor={normalColor}
              size={34}
              text="0"
              textColor={filledColor}
              thickness={2}
              withBackground={true}
              backgroundColor={backgroundColor}
              fontSize={12}
            />
          )

    const deadPeriodTime = LocaleDate.format(deadPeriod, 'HH:mm:ss')

    const expiryText =
      deadPeriod - time > 0
        ? renderToString(
            <>
              <PlotLineLabel>
                {t`Expiration`}
                <br />
                {LocaleDate.format(expiry, 'HH:mm:ss')}
              </PlotLineLabel>
              <ExpiryFlag />
            </>
          )
        : renderToString(
            <>
              <PlotLineLabel>
                {LocaleDate.format(expiry, 'HH:mm:ss')}
              </PlotLineLabel>
              <CircularProgress
                value={fillRate - 100}
                filledColor={filledColor}
                normalColor={normalColor}
                size={34}
                text={timeDistance}
                textColor={filledColor}
                thickness={2}
                withBackground={true}
                backgroundColor={backgroundColor}
              />
            </>
          )

    return {
      deadPeriodText,
      deadPeriodTime,
      expiryText:
        fillRate > -100
          ? expiryText
          : renderToString(
              <PlotLineLabel>
                {LocaleDate.format(expiry, 'HH:mm:ss')}
              </PlotLineLabel>
            ),
    }
  }

  getCountDownDeadLineText = (time: number, deadPeriod: number) => {
    const { fillRate, timeDistance } = this.getCountDownTime(time, deadPeriod)
    const {
      countDown: { backgroundColor, normalColor },
    } = this.props.theme.chart
    // const filledColor = this.getCountDownColor(time)

    const deadPeriodText =
      deadPeriod - time > 0
        ? renderToString(
            <CircularProgress
              value={fillRate - 100}
              filledColor={this.props.theme.primary}
              normalColor={normalColor}
              size={34}
              text={timeDistance}
              textColor={this.props.theme.primary}
              thickness={2}
              withBackground={true}
              backgroundColor={backgroundColor}
              fontSize={12}
            />
          )
        : renderToString(
            <CircularProgress
              value={fillRate - 100}
              filledColor={this.props.theme.primary}
              normalColor={normalColor}
              size={34}
              text="0"
              textColor={this.props.theme.primary}
              thickness={2}
              withBackground={true}
              backgroundColor={backgroundColor}
              fontSize={12}
            />
          )

    return deadPeriodText
  }

  updateCountDown = (timestamp: number) => {
    const { deadPeriod } = this.state
    if (this.chartInstance && timestamp !== deadPeriod) {
      const { xAxis } = this.getAxis()
      const expiryLine = this.getPlotLineOrBand(xAxis, ChartPlotLines.expiry)
      const { expiryText } = this.getCountDownText(timestamp)

      expiryLine?.label?.attr({
        text: expiryText,
      })

      for (let i = 0; i < xAxis.plotLinesAndBands.length; i++) {
        if (xAxis.plotLinesAndBands[i].id.includes(ChartPlotLines.deadPeriod)) {
          const expiry = Number(xAxis.plotLinesAndBands[i].id.split('_')[1])
          if (timestamp <= expiry) {
            const deadPeriodText = this.getCountDownDeadLineText(
              timestamp,
              expiry
            )
            xAxis.plotLinesAndBands[i]?.label?.attr({
              text: deadPeriodText,
            })
          }
        }
      }
    }
  }

  recalculateOverscroll = () => {
    const { xAxis } = this.getAxis()
    const { timeframe, chartType } = this.state
    const { range, candleStickRange } = timeframe
    const isCandlestick =
      chartType === 'candlestick' || chartType === 'heikinashi'

    const chartRange = isCandlestick ? candleStickRange : range

    const overscroll = chartRange / 3

    const { navigator } = this.chartInstance
    if (navigator?.xAxis?.update) {
      navigator.xAxis.update({
        overscroll,
        minRange: (chartRange / 3) * 2,
      })
    }

    if (xAxis?.update) {
      xAxis.update({
        overscroll,
        minRange: (chartRange / 3) * 2,
      })
    }
  }

  onTimeChange = (timestamp: number) => {
    this.updateCountDown(timestamp)
    const end = new Date().getTime()
    if (
      end - start > 300000 &&
      !this.state.navigator &&
      !this.state.userClickNavigator &&
      this.chartInstance
    ) {
      this.setState({ navigator: true })
      this.chartInstance.update({
        navigator: {
          enabled: true,
        },
      })
    }
  }

  changeChartLastPrice = (lastPrice: number) => {
    this.setState({ lastPrice })
  }

  changeChartLastQuote = (lastQuote: any) => {
    const { timeframe, chartType, expiry } = this.state
    const { chartPeriod, candleStickPeriod } = timeframe
    const isCandlestick =
      chartType === 'candlestick' || chartType === 'heikinashi'
    const threshold = isCandlestick
      ? candleStickPeriod * 60000
      : chartPeriod * 4000
    const { timestamp, open, high, low, last: close } = lastQuote
    const thresholdTime = Math.floor(timestamp / threshold) * threshold

    if (!this.props.isCfdOptions && timestamp >= expiry) {
      return this.props.actionDeselectExpiry()
    }

    // const mainSeries = this.chartInstance.get(ChartSeries.mainSeries)
    // const lastPoint: any | undefined = last(mainSeries.data)
    const lastPoint: any | undefined = last(this.state.candles)

    if (lastPoint) {
      const isAdded = timestamp - lastPoint[0] >= threshold

      if (isAdded) {
        let newPoint: any = [thresholdTime, open, high, low, close]
        if (chartType === 'heikinashi') {
          const lastCandleState =
            this.state.candles[this.state.candles.length - 1]

          newPoint = this.calculateHeikinAshiPoint(lastCandleState, newPoint)
        }
        this.addPointToChart(newPoint)
      } else {
        let updatedPoint: any = [lastPoint[0], open, high, low, close]

        if (chartType === 'heikinashi') {
          const lastCandleState =
            this.state.candles[this.state.candles.length - 2]

          updatedPoint = this.calculateHeikinAshiPoint(
            lastCandleState,
            updatedPoint
          )
        }
        this.updateLastChartPoint(updatedPoint)
      }
    }

    if (!this.props.isCfdOptions && thresholdTime >= expiry) {
      this.props.actionDeselectExpiry()
    }

    if (this.props.isCfdOptions) {
      this.onRenderGradient(this.props.cfdDirection)
    }

    this.chartInstance.redraw()
  }

  /**
   * Accepts trades and renders it on chart
   * @param trades
   */
  onRenderTrades = () => {
    const { tradesSeries, mainSeries } = this.getSeries()
    const { xAxis } = this.getAxis()
    const getFlagX = (tradeProps: any) => {
      const lastXPoint: number = last(mainSeries.xData) ?? 0
      return tradeProps.x > lastXPoint ? lastXPoint : tradeProps.x
    }
    const getFlagY = (tradeProps: any) => {
      const { points } = mainSeries
      const pointsSlice = filter(points, (p) => p.x <= tradeProps.x)
      const lastSlicePoint = last(pointsSlice)
      const lastYPoint = last(mainSeries.yData)

      return lastSlicePoint ? lastSlicePoint.y : lastYPoint
    }

    if (tradesSeries) {
      // Remove old line
      if (tradesSeries.data?.length > 0) {
        tradesSeries.data.forEach((item: any) => {
          const { id } = item
          const point = this.chartInstance.get(id)
          if (point && this.chartInstance[`line_${id}`]?.element) {
            this.chartInstance[`line_${id}`].destroy()
          }
        })
      }
      const { openTrades, closedTrades, instrument } = this.props
      const tradesData = chain([
        ...openTrades.map((trade: IOpenTrade) => ({
          ...trade,
          isClosed: false,
        })),
        ...closedTrades
          .filter((trade: IClosedTrade) => {
            return (new Date().getTime() - trade.expiryTimestamp) / 1000 < 3600
          })
          .map((trade: IClosedTrade) => ({
            ...trade,
            isClosed: true,
          })),
      ])
        .filter((trade) =>
          this.props.isCfdOptions ? !!trade.optionValue : !trade.optionValue
        )
        .map((trade: any) => {
          const props = getTradeProperties(
            trade,
            instrument,
            null,
            trade.isClosed,
            xAxis,
            this.props.theme.chart
          )

          return props
        })
        .filter((props: any) => props)
        .map((props: any) => ({
          ...props,
          x: getFlagX(props),
          y: getFlagY(props),
        }))
        .sortBy((props: any) => props.x)
        .value()
      tradesSeries.setData(tradesData)
    }
  }

  /**
   * Event emitted by chart when it is ready
   * Start data refetch each minute
   */
  onChartReady = () => {
    this.setState({ ready: true }, () => {
      setPulseMarkerVisibility(
        !this.props.isMobile &&
          includes(PULSE_MARKER_CHART_TYPES, this.state.chartType)
      )
    })
  }

  /**
   * Fetching candles including period
   * Locks UI on fetching
   * @param period
   */
  onFetchCandles = (isUpdateChart: boolean = true) => {
    if (fetchCandlesCancelToken) {
      fetchCandlesCancelToken.cancel('Operation canceled due to new request.')
    }
    this.setState({ loading: true }, async () => {
      if (!this.state.navigator)
        this.chartInstance?.update({
          navigator: {
            enabled: true,
          },
        })

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
        const lastQuote: any = last(candles)

        if (lastQuote) {
          this.setState(
            {
              candles,
              lastPrice: lastQuote[1],
            },
            () => {
              if (isUpdateChart) this.createOrUpdateChart(isUpdateChart)
            }
          )
        }
        fetchCandlesCancelToken = null
      } else {
        this.setState({ error: true })
        fetchCandlesCancelToken = null
      }
    })
  }

  onLastPrice = (lastPrice: number) => {
    this.setState({ lastPrice: Number(lastPrice) })
  }

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
            forEach(indicators, this.removeIndicator)
          }
          await this.onFetchCandles()
        }
      )
    }
  }

  onChangeChartType = (chartType: ChartType) => {
    this.onChangeZoomLevel(this.state.zoomLevel)
    const { chartType: currentChartType } = this.state
    this.setState({ chartType }, () => {
      this.changeChartType(currentChartType, chartType)
    })
  }

  onRenderGameDeadline = (expiry: number) => {
    const { xAxis } = this.getAxis()
    const { openTrades, instrument } = this.props

    if (openTrades && openTrades.length > 0) {
      const tradesInExpiry = uniqBy(
        filter(
          openTrades,
          (trade: IOpenTrade) =>
            trade.expiryTimestamp < expiry &&
            Number(trade.instrumentID) === Number(instrument)
        ),
        'expiryTimestamp'
      )

      tradesInExpiry.forEach((trade: IOpenTrade) => {
        const { expiryTimestamp } = trade
        const deadPeriodLineProps = deadPeriodLine(
          expiryTimestamp,
          this.props.theme.primary
        )
        xAxis.addPlotLine({
          ...deadPeriodLineProps,
        })
      })
    }
  }

  onRenderExpiry = (expiry: number) => {
    if (!expiry) return null

    this.setState({ expiry }, () => {
      const {
        expiryLine: { color: expiryLineColor },
      } = this.props.theme.chart
      const { xAxis } = this.getAxis()

      for (let i = 0; i < xAxis.plotLinesAndBands.length; i++) {
        xAxis.removePlotLine(xAxis.plotLinesAndBands[i].id)
      }

      if (this.props.isCfdOptions) {
        return void 0
      }

      const expiryLineProps = expiryLine(expiry, expiryLineColor)
      const { expiryText } = this.getCountDownText(this.props.time)

      xAxis.addPlotLine({
        ...expiryLineProps,
        label: {
          ...expiryLineProps.label,
          text: expiryText,
        },
      })

      this.onRenderGameDeadline(expiry)

      this.onChangeZoomLevel(this.state.zoomLevel)
      this.chartInstance.redraw()
    })
  }

  /**
   * Render series to display current game
   */
  onRenderGame = (game: IGame | null, init: boolean = false) => {
    if (!game) return

    const { xAxis } = this.getAxis()

    const {
      expiryLine: { color: expiryLineColor },
    } = this.props.theme.chart
    const { candles } = this.state
    const { deadPeriod, timestamp, expiry } = game
    const gameTime = Number(timestamp)
    const deadPeriodValue = gameTime - deadPeriod * 1000
    const overscrollTo = last(candles)[0]

    let newTimeframeIndex: number = 0
    if (expiry <= 600) {
      const isCandlestick = ['candlestick', 'ohlc', 'heikinashi'].includes(
        this.state.chartType
      )
      newTimeframeIndex = isCandlestick || this.props.isCfdOptions ? 1 : 0
    } else if (expiry > 600 && expiry <= 1500) {
      newTimeframeIndex = 1
    } else if (expiry > 1500 && expiry <= 3600) {
      newTimeframeIndex = 3
    } else if (expiry > 3600 && expiry <= 36000) {
      newTimeframeIndex = 5
    } else {
      newTimeframeIndex = 6
    }

    this.setState(
      {
        expiry: gameTime,
        deadPeriod: deadPeriodValue,
        periodOptions:
          expiry > 80000
            ? slice(
                chartPeriodOptions,
                newTimeframeIndex,
                chartPeriodOptions.length
              )
            : chartPeriodOptions,
        countDownExpectedTime: overscrollTo,
      },
      () => {
        for (let i = 0; i < xAxis.plotLinesAndBands.length; i++) {
          xAxis.removePlotLine(xAxis.plotLinesAndBands[i].id)
        }

        const expiryLineProps = expiryLine(gameTime, expiryLineColor)

        const { expiryText } = this.getCountDownText(this.props.time)

        if (!this.props.isCfdOptions) {
          xAxis.addPlotLine({
            ...expiryLineProps,
            label: {
              ...expiryLineProps.label,
              text: expiryText,
            },
          })

          this.onRenderGameDeadline(gameTime)
          this.updateCountDown(this.props.time)
        }
      }
    )
  }

  getCfdYAxisValue = () => {
    const { selectedCfdOptionExpiry, selectedCfdOptionInstrument } = this.props

    if (
      this.chartInstance &&
      selectedCfdOptionExpiry &&
      selectedCfdOptionInstrument
    ) {
      const { price } = selectedCfdOptionInstrument[selectedCfdOptionExpiry]
      const { mainSeries } = this.getSeries()

      const maxY: number = max(mainSeries.points?.map((p: any) => p.y)) ?? 0
      const minY: number = min(mainSeries.points?.map((p: any) => p.y)) ?? 0

      // price * x + lastPrice = dataMax
      const stepsCountUp = Math.ceil(
        (maxY - this.state.lastPrice) / Number(price)
      )
      // lastPrice - price * x = dataMin
      const stepsCountDown = Math.ceil(
        (this.state.lastPrice - minY) / Number(price)
      )
      const tickAmount =
        Math.max(stepsCountUp + 1, stepsCountDown + 1, 3) * 2 + 2

      return { tickAmount, tickInterval: +price }
    }

    return { tickAmount: null, tickInterval: null }
  }

  /**
   * Render gradient
   * @param direction
   */
  onRenderGradient = (direction: number) => {
    this.setState({ direction }, () => {
      const { yAxis } = this.getAxis()
      const { min, max } = yAxis.getExtremes()

      yAxis.removePlotBand(ChartPlotBands.quote)
      yAxis.removePlotLine(ChartPlotLines.breakeven)

      if ([1, -1].includes(direction)) {
        let from = this.state.lastPrice
        const { instrumentObject, distances, game, isAboveBelow } = this.props
        if (isAboveBelow && game?.isAboveBelow) {
          const { precision } = instrumentObject
          const distance = distances.find((d: any) =>
            moment(d.timestamp).isSame(moment(game.timestamp))
          )
          const abovePrice = parseFloat(
            (from + distance?.distance || 0).toFixed(precision)
          )
          const belowPrice = parseFloat(
            (from - distance?.distance || 0).toFixed(precision)
          )

          from = direction === 1 ? abovePrice : belowPrice
        }
        const isBuy = direction === 1
        const to = isBuy ? max : min
        const linearY1 = isBuy ? 1 : 0
        const linearY2 = isBuy ? 0 : 1
        const {
          quoteBand: { upGradient0, downGradient0, upGradient1, downGradient1 },
        } = this.props.theme.chart

        const isUp = direction === 1
        const index = yAxis.tickPositions.indexOf(this.state.lastPrice)
        const breakevenValue = yAxis.tickPositions[index + (isUp ? 1 : -1)]

        yAxis.addPlotBand(
          quoteBand(
            this.props.isCfdOptions ? breakevenValue : from,
            to,
            linearY2,
            linearY1,
            direction,
            upGradient0,
            downGradient0,
            upGradient1,
            downGradient1,
            this.props.isCfdOptions,
            this.props.isMobile
          )
        )

        // if (this.props.isCfdOptions) this.chartInstance.redraw()
      }
    })
  }

  /**
   * Return axis object
   */
  getAxis = () => {
    const yAxis = this.chartInstance?.get(ChartAxis.yAxis)
    const xAxis = this.chartInstance?.get(ChartAxis.xAXis)
    return { yAxis, xAxis }
  }

  /**
   * Return all series found by id
   */
  getSeries = () => {
    const tradesSeries = this.chartInstance.get(ChartSeries.tradesSeries)
    const mainSeries = this.chartInstance.get(ChartSeries.mainSeries)
    const indicatorSeries = this.chartInstance.get(ChartSeries.indicatorSeries)
    return { tradesSeries, mainSeries, indicatorSeries }
  }

  getAnnotations = () => {
    return this.chartInstance.annotations
  }

  calculateAnnotations = () => {
    const annotations = this.getAnnotations()
    this.setState({
      annotationsCount: annotations.length,
      visibleAnnotations: size(filter(annotations, (a) => a.options.visible)),
    })
  }

  removeAllAnnotations = () => {
    const annotations = this.getAnnotations()
    annotations.forEach((annotation: any) => annotation.setVisibility(false))
    this.calculateAnnotations()
  }

  toggleAnnotation = (visibility: boolean) => {
    const annotations = this.getAnnotations()
    const lastAnnotation = last(
      filter(annotations, (a) => a.options.visible === !visibility)
    )
    if (lastAnnotation) lastAnnotation.setVisibility(visibility)
    this.calculateAnnotations()
  }

  /**
   * adjust yAxis height depending on charts amount
   * (mainly causes by secondChart param in indicator)
   */
  recalculateYAxisHeight = () => {
    const { yAxis } = this.getAxis()
    const axixesHeight = chain(this.chartInstance.yAxis)
      .map((axis: any) => axis.height)
      .reduce((height: any, axisHeight: any) => height + axisHeight, 0)
      .value()
    const { chartHeight, navigator } = this.chartInstance
    const deltaHeight = chartHeight - axixesHeight
    const navigatorHeight = navigator?.navigatorOptions?.height || 0
    const yAxisHeightPx = yAxis.height + deltaHeight - navigatorHeight
    const newyAxisHeight = yAxisHeightPx * 0.2
    const mainAxisOffset = 20

    return { newyAxisHeight, yAxisHeightPx, mainAxisOffset }
  }

  addSecondChartAxis = (id: string) => {
    if (this.chartInstance) {
      const { newyAxisHeight, yAxisHeightPx, mainAxisOffset } =
        this.recalculateYAxisHeight()
      const { yAxis } = this.getAxis()

      yAxis.update(
        {
          height: `${yAxisHeightPx - newyAxisHeight - mainAxisOffset}px`,
        },
        false
      )

      this.chartInstance.addAxis(
        {
          id: `${id}-y-axis`,
          title: {
            text: null,
          },
          gridLineWidth: 1,
          gridZIndex: 1,
          gridLineColor: this.props.theme.chart.xAxis.gridLineColor,
          lineColor: this.props.theme.chart.xAxis.lineColor,
          opposite: true,
          height: `${newyAxisHeight}px`,
          top: `${yAxisHeightPx - newyAxisHeight}px`,
        },
        false
      )
    }
  }

  addCfdBreakevenLine = (direction: number, value: number) => {
    const { yAxis } = this.getAxis()
    if (yAxis) {
      const isUp = direction === 1
      const index = yAxis.tickPositions.indexOf(value)
      const breakevenValue = yAxis.tickPositions[index + (isUp ? 1 : -1)]
      const {
        quoteBand: { upGradient1 },
      } = this.props.theme.chart

      if (breakevenValue) {
        yAxis.addPlotLine(
          breakevenLine(
            breakevenValue,
            this.props.cfdDirection,
            upGradient1,
            this.props.isMobile
          )
        )
      }
    }
  }

  /**
   * casts IIndicatorParams to Highcharts series params
   * @param params IIndicatorParams
   */
  createIndicatorParams = (params: IIndicatorParam[]) => {
    return params
      .map((p) => ({ [p.id]: p.value }))
      .reduce((res, cur) => ({ ...res, ...cur }), {})
  }

  addIndicator = (indicator: IIndicatorMenuItem) => {
    if (this.chartInstance) {
      const {
        chart: { indicators },
      } = this.props.theme
      const indicatorProps: any = indicatorsList[indicator.type]
      const id = serializeIndicator(indicatorProps.type, indicator.params)
      const params = this.createIndicatorParams(indicator.params)
      const color = indicators[indicator.type]

      const indicatorSeries = this.chartInstance.get(id)
      if (indicatorSeries) return

      const { secondChart } = indicatorProps
      if (secondChart) this.addSecondChartAxis(id)

      this.chartInstance.addSeries(
        {
          ...indicatorProps,
          id,
          params,
          color,
          events: {
            click: (e: any) => {
              this.setState({
                clickedIndicator: { ...indicator, id },
                clickedIndicatorX: e.clientX,
                clickedIndicatorY: e.clientY,
              })
            },
          },
          yAxis: secondChart ? `${id}-y-axis` : undefined,
        },
        false
      )
      this.chartInstance.redraw()

      this.setState({
        indicators: [...this.state.indicators, { ...indicator, id, color }],
      })
    }
  }

  removeIndicator = (indicator: IIndicatorMenuItem) => {
    if (this.chartInstance) {
      const indicatorProps: any = indicatorsList[indicator.type]
      const id = serializeIndicator(indicatorProps.type, indicator.params)

      const indicatorSeries = this.chartInstance.get(id)
      if (indicatorSeries) {
        indicatorSeries.remove(false)

        const { secondChart } = indicatorProps
        if (secondChart) {
          const indicatorAxis = this.chartInstance.get(`${id}-y-axis`)
          if (indicatorAxis) {
            indicatorAxis.remove(false)
          }
        }

        const { yAxisHeightPx } = this.recalculateYAxisHeight()
        const { yAxis } = this.getAxis()
        yAxis.update(
          {
            height: `${yAxisHeightPx}px`,
          },
          false
        )
      }

      this.setState({
        indicators: this.state.indicators.filter(
          (ind: any) => serializeIndicator(ind.type, ind.params) !== id
        ),
        clickedIndicator: null,
      })

      this.chartInstance.redraw()
    }
  }

  /**
   * update indicator with new params
   * @param menuIndicator indicator id
   * @param params indicator IIndicatorParam
   */
  updateIndicator = (menuIndicator: IIndicatorMenuItem, params: any) => {
    const id = serializeIndicator(menuIndicator.type, menuIndicator.params)
    const indicator = this.chartInstance.get(id)
    if (indicator) {
      const index = findIndex(this.state.indicators, { id })
      const newId = serializeIndicator(menuIndicator.type, params)
      if (index !== -1) {
        indicator.update({
          ...indicator.options,
          id: newId,
          params: this.createIndicatorParams(params),
        })

        const updatedIndicator = {
          ...this.state.indicators[index],
          id: newId,
          params,
        }
        const { clickedIndicator } = this.state
        this.setState({
          indicators: replaceByIndex(
            this.state.indicators,
            index,
            updatedIndicator
          ),
          clickedIndicator:
            this.state.clickedIndicator && isEqual(clickedIndicator.id, id)
              ? updatedIndicator
              : clickedIndicator,
        })
      }
    }
  }

  /**
   * indicates whether indicator visible or no
   * @param menuIndicator indicator
   */
  getIndicatorVisibility = (indicator: IIndicatorMenuItem): boolean => {
    const { type, params } = indicator
    const id = serializeIndicator(type, params)
    const chart = this.chartInstance
    const index = findIndex(
      this.chartInstance.series,
      (s: any) => s.options.id === id
    )
    if (index !== -1) {
      const series = chart.series[index]
      return series.visible
    }

    return false
  }

  /**
   * hide/show indicator
   * @param id indicator id
   * @param params indicator IIndicatorParam
   */
  toggleIndicator = (indicator: IIndicatorMenuItem) => {
    const { type, params } = indicator
    const id = serializeIndicator(type, params)
    const chart = this.chartInstance
    const index = findIndex(
      this.chartInstance.series,
      (s: any) => s.options.id === id
    )
    if (index !== -1) {
      const series = chart.series[index]
      const visible = series.visible
      series.setVisible(!visible)
    }
  }

  onChangeZoomLevel = (
    zoomLevel: number,
    isUpdateChart: boolean = true,
    isResetZoom = false
  ) => {
    if (!isResetZoom && this.state.isResetZoom)
      this.setState({ isResetZoom: false })
    if (zoomLevel < 1 || zoomLevel > 5) return
    this.setState({ zoomLevel }, () => {
      const { xAxis, yAxis } = this.getAxis()
      const { timeframe, chartType } = this.state
      const { range, candleStickRange } = timeframe
      const isCandlestick =
        chartType === 'candlestick' || chartType === 'heikinashi'
      const chartRange = (isCandlestick ? candleStickRange : range) * zoomLevel
      yAxis.removePlotLine(ChartPlotLines.quote)

      if (!isUpdateChart) xAxis?.update?.({ range: chartRange })

      if (isUpdateChart) {
        const chartRangeWithoutZoom = isCandlestick ? candleStickRange : range

        const overscroll = chartRangeWithoutZoom / 3

        const { navigator } = this.chartInstance

        navigator?.xAxis?.update?.({
          overscroll,
          minRange: overscroll * 2,
        })

        xAxis?.update?.({
          range: chartRange,
          overscroll,
          minRange: overscroll * 2,
        })
      }
    })
  }

  /**
   * Hide or show navigator
   */
  onToggleNavigator = () => {
    const navigator = !this.state.navigator
    this.setState({ navigator, userClickNavigator: true }, () => {
      this.chartInstance.update({
        navigator: {
          enabled: navigator,
        },
      })
    })
  }

  /**
   * Toggle fullscreen
   */
  onFullScreen = () => this.chartInstance.fullscreen.toggle()

  /**
   * Reflow chart on window resize
   */
  onChartResize = () => {
    if (this.chartInstance) {
      const bottomHeight = this.props.showBottomPanel
        ? this.props.bottomPanelHeight + 84
        : 18
      const topHeight = this.props.loggedIn ? 32 : 0
      // let width = window.innerWidth - (this.props.isCfdOptions ? 446 : 372)
      // sidebar width = 62, tradebox width = 310
      // sidebarnew width = 84, tradeboxnew width = 140
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
      const height = window.innerHeight - 104 - topHeight - bottomHeight
      this.chartInstance.setSize(width, height, false)
    }
  }

  onChartOrientation = () => {
    window.location.reload()
  }

  componentDidMount = async () => {
    if (this.props.instrument) {
      this.onFetchCandles()
    }
    window.addEventListener('resize', this.onChartResize)
    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', this.onChartOrientation)
    }
    this.eventEmitter = EventEmitter.addListener('positionOpened', (event) => {
      // Get position of position
      const { position, opened } = event
      const tradesSeries = this.chartInstance.get(ChartSeries.tradesSeries)
      const tradesSeriesData = tradesSeries?.data
      const tradePosition = tradesSeriesData.find(
        (trade: any) => trade.id === position.tradeID
      )
      const { xAxis, yAxis } = this.getAxis()
      if (tradePosition) {
        const { x, y, direction } = tradePosition
        const xCoordinate = xAxis.toPixels(x) + 60
        const yCoordinate = yAxis.toPixels(y) + (direction === 1 ? 140 : -30)
        this.setState({
          clickedTrade: opened ? position : null,
          clickedTradeX: opened ? xCoordinate : null,
          clickedTradeY: opened ? yCoordinate : null,
        })
        if (!opened) {
          if (this.chartInstance?.breakeven_line_position?.element)
            this.chartInstance?.breakeven_line_position?.destroy()
          if (this.chartInstance?.breakevenLabel?.element)
            this.chartInstance?.breakevenLabel?.destroy()
        }
      }
    })
    this.eventEmitterClosed = EventEmitter.addListener(
      'positionClosed',
      (event: any) => this.showBalloonOnClosedTrades(event)
    )
  }

  showBalloonOnClosedTrades = (event: any) => {
    const { isCfdOptions, openTrades } = this.props
    if (!isCfdOptions) {
      const { trades, profit } = event
      const tradeIds = Object.keys(trades)
      const closeTrades: IOpenTrade[] = openTrades.filter(({ tradeID }) =>
        tradeIds.includes(`${tradeID}`)
      )
      if (closeTrades.length > 0)
        this.showBalloon(closeTrades[0], profit, closeTrades.length)
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onChartResize)
    if ('onorientationchange' in window) {
      window.removeEventListener('orientationchange', this.onChartOrientation)
    }
    this.eventEmitter?.removeListener('positionOpened', () => {})
    this.eventEmitterClosed?.removeListener('positionClosed', () => {})
  }

  /**
   * Main method to figure out what we should rerender
   * Acts as a custom connector to redux in fx-platform
   * @param prevProps - previous props object
   */
  componentDidUpdate = (prevProps: IChartProps) => {
    if (prevProps.instrument !== this.props.instrument) {
      this.onFetchCandles()

      if (this.chartInstance) {
        this.resetChartZoom(false)
        const { xAxis } = this.getAxis()
        for (let i = 0; i < xAxis.plotLinesAndBands.length; i++) {
          xAxis.removePlotLine(xAxis.plotLinesAndBands[i].id)
        }
      }
    }
    if (
      prevProps.showSideMenu !== this.props.showSideMenu ||
      prevProps.collapsedSideMenu !== this.props.collapsedSideMenu
    ) {
      this.onChartResize()
    }
    if (this.chartInstance) {
      if (
        prevProps.openTrades !== this.props.openTrades ||
        prevProps.closedTrades !== this.props.closedTrades
      ) {
        if (!this.props.isCfdOptions) {
          const expiry = this.props.selectedExpiry || this.state.expiry
          this.onRenderGameDeadline(expiry)
        }

        this.onRenderTrades()
      }
      if (!this.props.isCfdOptions && prevProps.game !== this.props.game) {
        if (!this.props.selectedExpiry) {
          this.onRenderGame(this.props.game)
        }
      }

      if (prevProps.selectedExpiry !== this.props.selectedExpiry) {
        this.onRenderExpiry(this.props.selectedExpiry)
      }
      if (prevProps.time !== this.props.time) {
        this.onTimeChange(this.props.time)
      }
      if (prevProps.lastPrice !== this.props.lastPrice) {
        this.onLastPrice(this.props.lastPrice)
      }
      if (!isEqual(prevProps.lastQuote, this.props.lastQuote)) {
        this.changeChartLastQuote(this.props.lastQuote)
      }
      if (prevProps.direction !== this.props.direction) {
        this.onRenderGradient(this.props.direction)
      }
      if (prevProps.hoveredDirection !== this.props.hoveredDirection) {
        this.onRenderGradient(this.props.hoveredDirection)
      }
      if (prevProps.cfdDirection !== this.props.cfdDirection) {
        this.onRenderGradient(this.props.cfdDirection)
      }
      if (prevProps.isMobile !== this.props.isMobile) {
        // hide navigator
      }
      if (prevProps.isCfdOptions !== this.props.isCfdOptions) {
        this.onRenderTrades()
        const { xAxis, yAxis } = this.getAxis()

        yAxis.setExtremes(null, null)
        yAxis.removePlotLine(ChartPlotLines.quote)

        for (let i = 0; i < xAxis.plotLinesAndBands.length; i++) {
          xAxis.removePlotLine(xAxis.plotLinesAndBands[i].id)
        }

        if (!this.props.isCfdOptions) {
          const chartPeriods = ['candlestick', 'ohlc', 'heikinashi'].includes(
            this.state.chartType
          )
            ? chartPeriodOptionsMobile.filter(
                (p: IPeriod) => p.supportedOnCandleChartType
              )
            : chartPeriodOptionsMobile.filter(
                (p: IPeriod) => p.supportedOnLineChartType
              )
          const tickTimeFrame = chartPeriods.find(
            (p: IPeriod) => p.period === 'tick'
          )
          if (tickTimeFrame) this.onChangeTimeframe(tickTimeFrame)
        }

        if (!this.props.isMobile) this.onChartResize()
        this.chartInstance.reflow()
      }

      if (
        prevProps.showBottomPanel !== this.props.showBottomPanel ||
        prevProps.bottomPanelHeight !== this.props.bottomPanelHeight
      )
        this.onChartResize()
      if (prevProps.container !== this.props.container) this.onChartResize()
      if (prevProps.isAboveBelow !== this.props.isAboveBelow) {
        const { yAxis } = this.getAxis()
        if (this.props.isAboveBelow) {
          yAxis?.update({
            minPadding: 2,
          })
        } else {
          yAxis?.update({
            minPadding: 0.1,
          })
        }
      }
    }
  }

  render = () => {
    const loaded = !this.state.loading && !this.state.error
    const visibility = loaded ? 'visible' : 'hidden'
    const isDesktop = !this.props.isMobile
    const contextValue = {
      addIndicator: this.addIndicator,
      updateIndicator: this.updateIndicator,
      removeIndicator: this.removeIndicator,
      toggleIndicator: this.toggleIndicator,
      getIndicatorVisibility: this.getIndicatorVisibility,
    }
    const {
      clickedIndicator,
      clickedIndicatorX,
      clickedIndicatorY,
      clickedTrade,
      clickedTradeX,
      clickedTradeY,
    } = this.state
    const onClosePositionInfo = () => {
      this.setState({
        clickedTrade: null,
        clickedTradeX: null,
        clickedTradeY: null,
      })
    }
    const chartPeriods =
      ['candlestick', 'ohlc', 'heikinashi'].includes(this.state.chartType) ||
      this.props.isCfdOptions
        ? chartPeriodOptionsMobile.filter(
            (p: IPeriod) => p.supportedOnCandleChartType
          )
        : chartPeriodOptionsMobile.filter(
            (p: IPeriod) => p.supportedOnLineChartType
          )

    const { yAxis } = this.getAxis()
    const trackStepLen = yAxis
      ? yAxis.len / (yAxis.tickPositions.length - 1)
      : 0
    const trackStepsCount = yAxis ? yAxis.tickPositions.length - 1 : 0
    const { deadPeriodText, deadPeriodTime } = this.getCountDownText(
      this.props.time
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
              {this.props.loggedIn &&
                this.props.isMobile &&
                !this.props.isCfdOptions && (
                  <div className="mobile-purchase-time-container">
                    <PurchaseTime
                      colors={this.props.theme}
                      isMobile={this.props.isMobile}
                    >
                      <div className="purchase-time">
                        <span className="purchase-time-title">{t`purchase time`}</span>
                        <span>{deadPeriodTime}</span>
                      </div>
                      {deadPeriodText && (
                        <div
                          className="countdown"
                          dangerouslySetInnerHTML={{
                            __html: deadPeriodText,
                          }}
                        ></div>
                      )}
                    </PurchaseTime>
                  </div>
                )}
            </>
          )}
          {clickedTrade && (
            <>
              <PositionInfo
                trade={clickedTrade}
                quote={this.props.lastQuote}
                timeleft={5}
                x={clickedTradeX}
                y={Math.min(870, clickedTradeY)}
                onClose={onClosePositionInfo}
              />
              <Backdrop onClick={() => onClosePositionInfo()} />
            </>
          )}
          <ChartArea
            loggedIn={this.props.loggedIn}
            isMobile={this.props.isMobile}
            style={{ backgroundImage: `url(${this.props.backgroundChart})` }}
          >
            <div
              id="chart-container"
              className="highcharts-container"
              style={{ visibility }}
            />

            {this.props.isCfdOptions && (
              <CfdSlider
                isMobile={this.props.isMobile}
                lastPrice={this.props.lastPrice}
                trackStepLen={trackStepLen}
                trackStepsCount={trackStepsCount}
                valueTrackColor={'#75F986'}
                activeTrackColor={'#54b467'}
                inactiveTrackColor={'#263346'}
                instrument={this.props.selectedCfdOptionInstrument}
                expiry={this.props.selectedCfdOptionExpiry}
              />
            )}
          </ChartArea>
          {clickedIndicator && (
            <Legend
              indicator={clickedIndicator}
              withBrief={false}
              x={clickedIndicatorX}
              y={clickedIndicatorY}
            />
          )}
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
              deadPeriodCountDown={deadPeriodText}
              deadPeriodTime={deadPeriodTime}
            />
          )}
          {this.state.loading && <GlobalLoader zIndex={21} top={90} />}
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
            onFullScreen={() => this.onFullScreen()}
            onToggleNavigator={this.onToggleNavigator}
            isHighCharts={this.props.currentChartLibrary === ChartLibrary.Basic}
            isResetZoom={this.state.isResetZoom}
          />
          {loaded && (
            <Sentiment
              instrument={this.props.instrument}
              navigator={this.state.navigator}
            />
          )}
        </ChartPanel>
      </IndicatorsContext.Provider>
    )
  }
}

const mapStateToProps = (state: any) => ({
  instrument: state.trading.selected,
  instrumentName: getInstrumentName(state as never),
  instrumentObject: getInstrumentObject(state as never),
  direction: state.trading.direction,
  cfdDirection: state.trading.cfdOptionsActiveDirection,
  hoveredDirection: state.trading.hoveredDirection,
  lastPrice: lastPriceForSelectedInstrument(state as never),
  lastQuote: lastQuoteForSelectedInstrument(state as never),
  openTrades: state.trades.open || [],
  closedTrades: state.trades.closed || [],
  game: state.game,
  time: state.time,
  chartConfig: state.registry.data.chartConfig,
  theme: state.theme,
  selectedExpiry: state.expiry.selected,
  selectedCfdOptionInstrument: state.trading.selectedCfdOptionInstrument,
  selectedCfdOptionExpiry: state.trading.selectedCfdOptionExpiry,
  loggedIn: isLoggedIn(state as never),
  chartLibraryConfig: state.registry.data.partnerConfig.chartLibraryConfig,
  backgroundChart: state.registry.data.partnerConfig.backgroundChart,
  tradingPanelType: state.registry.data.partnerConfig.tradingPanelType,
  currentChartType: state.registry.currentChartType,
  currentChartLibrary: state.registry.currentChartLibrary,
  showBottomPanel: state.container.showBottomPanel,
  bottomPanelHeight: state.container.bottomPanelHeight,
  container: state.container.content,
  formatCurrency: formatCurrency(state),
  isAboveBelow: isAboveBelowProductType(state),
  distances: state.trading.distances,
  showSideMenu: state.container.showSideMenu,
  collapsedSideMenu: state.container.collapsedSideMenu,
  isCfdOptions: isCfdOptionsProductType(state),
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionSetSidebar,
  actionSelectExpiry,
  actionDeselectExpiry,
  actionSetSelectedTrade,
  actionChangeChartLibrary,
})(Chart)
