/**
 * Implements a chart overlay
 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import ReactTooltip from 'react-tooltip'
import {
  ButtonsHolder,
  ChartButton,
  ControlsPanel,
  IndicatorsWrapper,
  IndicatorWarning,
  ListContainer,
  ListItem,
  PrimaryBlock,
  PrimaryHolder,
  PurchaseTime,
  SecondaryPanel,
  SwithButton,
  WarningContent,
} from './styled'
import { IPeriod } from './period'
import Backdrop from '../../Backdrop'
import DrawingTools from './ChartDrawingTools'
import ChartIndicators from './ChartIndicators'
import ThemedIcon from '../../ui/ThemedIcon'
import { Tooltipped } from 'react-md'
import IndicatorLegend from './ChartIndicators/Legends'
import { isLoggedIn } from '../../selectors/loggedIn'
import CurrentPayout from './CurrentPayout'
import InstrumentsPicker from './Instruments'
import InstrumentInfo from './InstrumentInfo'
import CfdSentimentSwitcher from './CfdSentimentSwitcher'
import { isCfdOptionsProductType } from '../../selectors/trading'
import { isEqual } from 'lodash'
import UserStorage from '../../../core/UserStorage'
import ProductTypePanel from '../MobileInstrumentsBar/ProductTypePanel'
import {
  ChartLibraryConfig,
  ChartLibrary,
  ChartType,
} from '../ChartLibraryConfig'
import {
  actionChangeChartLibrary,
  actionChangeChartType,
} from '../../../actions/registry'
import SoundSwitch from './SoundSwitch'
import CurrentPayoutMobile from '../MobileInstrumentsBar/CurrentPayout'
import { isMobileLandscape } from '../../../core/utils'

require('./ChartControls.scss')

interface IChartControlsProps {
  isMobile: boolean
  colors: any
  isLoggedIn: boolean
  indicators: any[]
  periodOptions: IPeriod[]
  timeframe: IPeriod
  currentChartType: ChartType
  isCfdOptions: boolean
  onChangeTimeframe: (tf: IPeriod) => void
  onChangeChartType?: (cType: ChartType) => void
  removeAllAnnotations: () => void
  calculateAnnotations: () => void
  toggleAnnotation: (visibility: boolean) => void
  lang: string
  chartLibraryConfig: ChartLibraryConfig
  currentChartLibrary: ChartLibrary
  actionChangeChartLibrary: (chartLibrary: ChartLibrary) => void
  actionChangeChartType: (chartType: ChartType) => void
  deadPeriodCountDown?: string | TrustedHTML
  deadPeriodTime?: string
  showConfetti: boolean
}

const calculateListPosition = (e: any, listType: number) => {
  const rect = e.currentTarget.getBoundingClientRect()
  return {
    type: listType,
    top: rect.bottom,
    left: rect.left,
  }
}

interface IListType {
  type: number
  top?: number
  left?: number
}

/**
 * Chart controls component
 */
const ChartControls = (props: IChartControlsProps) => {
  const [list, setList] = useState<IListType>({ type: 0 })
  const [periodOptions, setPeriodOptions] = useState<IPeriod[]>(
    props.periodOptions
  )
  const [timeframe, setTimeframe] = useState<IPeriod>(props.timeframe)

  const getTranslatedPeriod = (period: string | null) => {
    switch (period) {
      case 'Tick':
        return t`Tick`
      case '1m':
        return t`1m`
      case '1 Minute':
        return t`1 Minute`
      case '2m':
        return t`2m`
      case '2 Minutes':
        return t`2 Minutes`
      case '5m':
        return t`5m`
      case '5 Minutes':
        return t`5 Minutes`
      case '15m':
        return t`15m`
      case '15 Minutes':
        return t`15 Minutes`
      case '30m':
        return t`30m`
      case '30 Minutes':
        return t`30 Minutes`
      case '1h':
        return t`1h`
      case '1 Hour':
        return t`1 Hour`
      case '2h':
        return t`2h`
      case '2 Hours':
        return t`2 Hours`
      case '4h':
        return t`4h`
      case '4 Hours':
        return t`4 Hours`
      case '1d':
        return t`1d`
      case '1 Day':
        return t`1 Day`
      case '1w':
        return t`1w`
      case '1 Week':
        return t`1 Week`
      default:
        return period
    }
  }

  const updateTimeFrame = () => {
    setTimeframe({
      ...timeframe,
      periodLabel: getTranslatedPeriod(timeframe.periodLabelEnglish) || '',
      periodToolTip: getTranslatedPeriod(timeframe.periodToolTipEnglish) || '',
    })
  }
  const updateTimeFrameList = () => {
    const chartPeriodOptionsTranslated: any = periodOptions.map(
      (c: IPeriod) => {
        const periodLabel = getTranslatedPeriod(c.periodLabelEnglish)
        const periodToolTip = getTranslatedPeriod(c.periodToolTipEnglish)
        return {
          ...c,
          periodLabel,
          periodToolTip,
        }
      }
    )
    setPeriodOptions(chartPeriodOptionsTranslated)
  }

  useEffect(() => {
    updateTimeFrame()
    updateTimeFrameList()
  }, [props.lang])

  useEffect(() => {
    if (!isEqual(timeframe, props.timeframe)) setTimeframe(props.timeframe)
  }, [props.timeframe])

  const onSelectChartType = (ctype: ChartType) => {
    const nonTickTypes = [
      ChartType.candlestick,
      ChartType.ohlc,
      ChartType.heikinashi,
    ]

    setList({ type: 0 })
    props.onChangeChartType?.(ctype)
    props.actionChangeChartType(ctype)
    UserStorage.setChartType(ctype)

    if (isTick && nonTickTypes.includes(ctype)) {
      props.onChangeTimeframe(chartPeriods[1])
    }
  }

  const onSelectTimeframe = (timeframe: IPeriod) => {
    setList({ type: 0 })
    props.onChangeTimeframe(timeframe)
  }

  const isTick = timeframe.period === 'tick'
  const { indicators, colors } = props

  /**
   * Tick is not supported on candlestick/ohlc chart
   */
  const chartPeriods =
    props.isCfdOptions ||
    [ChartType.candlestick, ChartType.ohlc, ChartType.heikinashi].includes(
      props.currentChartType
    )
      ? periodOptions.filter((p: IPeriod) => p.supportedOnCandleChartType)
      : periodOptions.filter((p: IPeriod) => p.supportedOnLineChartType)

  const openPeriodList = (e: React.SyntheticEvent<any>) =>
    setList(calculateListPosition(e, 1))
  const openChartTypeList = (e: React.SyntheticEvent<any>) =>
    setList(calculateListPosition(e, 2))

  const onChangeChart = (chartId: ChartLibrary) => {
    if (
      props.currentChartLibrary === ChartLibrary.Basic &&
      props.currentChartType === ChartType.heikinashi
    ) {
      UserStorage.setChartType(ChartType.area)
      props.actionChangeChartType(ChartType.area)
    }
    props.actionChangeChartLibrary(chartId)
  }

  const CurrPayout = props.isMobile ? CurrentPayoutMobile : CurrentPayout

  return (
    <>
      <ControlsPanel className="chart-controls-panel">
        <PrimaryBlock>
          <PrimaryHolder>
            <InstrumentsPicker colors={colors} isMobile={props.isMobile} />
            {!props.isMobile &&
              props.currentChartLibrary !== ChartLibrary.TradingView && (
                <InstrumentInfo colors={colors} />
              )}
            {!props.isCfdOptions && <CurrPayout colors={colors} />}

            <ButtonsHolder>
              {!props.isMobile && (
                <SecondaryPanel>
                  {indicators.map((indicator: any, index: number) => (
                    <IndicatorLegend key={index} indicator={indicator} />
                  ))}
                </SecondaryPanel>
              )}
              {(!props.isMobile || isMobileLandscape(props.isMobile)) && (
                <ChartButton
                  isMobile={props.isMobile}
                  colors={colors}
                  onClick={openPeriodList}
                  smallText={timeframe.period === 'tick'}
                  className="resolution-button"
                >
                  <div data-tip="" data-for="chart_timeframe">
                    <span>{timeframe.periodLabel}</span>
                    <ReactTooltip
                      id="chart_timeframe"
                      place="bottom"
                      className="react-tooltip tooltip-background"
                      backgroundColor={colors.background}
                    >
                      {t`Chart timeframes`}
                    </ReactTooltip>
                  </div>
                </ChartButton>
              )}
              {(!props.isMobile || isMobileLandscape(props.isMobile)) && (
                <ChartButton
                  isMobile={props.isMobile}
                  colors={colors}
                  onClick={openChartTypeList}
                >
                  <Tooltipped id="chart-type-list" tooltip={t`Chart types`}>
                    <ThemedIcon
                      width={16}
                      height={16}
                      fill={colors.primaryText}
                      stroke={colors.primaryText}
                      verticalAlign="sub"
                      src={`${process.env.PUBLIC_URL}/static/icons/chart_types/${props.currentChartType}.svg`}
                    />
                  </Tooltipped>
                </ChartButton>
              )}
              {(!props.isMobile || isMobileLandscape(props.isMobile)) &&
                props.currentChartLibrary === ChartLibrary.Basic && (
                  <Tooltipped
                    id="chart-drawing-tools-list"
                    tooltip={t`Chart drawing tools list`}
                  >
                    <DrawingTools
                      isMobile={props.isMobile}
                      colors={colors}
                      removeAllAnnotations={props.removeAllAnnotations}
                      calculateAnnotations={props.calculateAnnotations}
                      toggleAnnotation={props.toggleAnnotation}
                    />
                  </Tooltipped>
                )}
              {(!props.isMobile || isMobileLandscape(props.isMobile)) &&
                props.currentChartLibrary === ChartLibrary.Basic && (
                  <IndicatorsWrapper
                    data-tip=""
                    data-for="indicators_warning"
                    colors={colors}
                  >
                    {isTick && (
                      <ReactTooltip
                        id="indicators_warning"
                        place="bottom"
                        delayHide={1000}
                        effect="solid"
                        clickable={true}
                        className="react-tooltip tooltip-background"
                        backgroundColor={colors.background}
                      >
                        <IndicatorWarning>
                          <WarningContent>{t`Indicators only available on timeframes  of 1 min and above.`}</WarningContent>
                          <SwithButton
                            colors={colors}
                            onClick={() => onSelectTimeframe(chartPeriods[1])}
                          >
                            {t`Switch`}
                          </SwithButton>
                        </IndicatorWarning>
                      </ReactTooltip>
                    )}
                    <ChartIndicators
                      timeframe={props.timeframe}
                      indicators={indicators}
                      isLoggedIn={props.isLoggedIn}
                    />
                  </IndicatorsWrapper>
                )}
              {!props.isMobile &&
                props.currentChartLibrary === ChartLibrary.Basic &&
                props.chartLibraryConfig.allowedLibraries.includes(
                  ChartLibrary.LightWeight
                ) && (
                  <ChartButton
                    isMobile={props.isMobile}
                    colors={colors}
                    onClick={() => onChangeChart(ChartLibrary.LightWeight)}
                    className="resolution-button"
                    isTradingView={false}
                  >
                    <div data-tip="" data-for="switch-chart-button-2">
                      <Tooltipped id="switch-chart-tooltipped-2">
                        <div className="switch-chart-view-wrapper">
                          <b
                            style={{
                              marginLeft: 5,
                              marginRight: 5,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {t`Advanced Chart`}
                          </b>
                        </div>
                      </Tooltipped>
                      <ReactTooltip
                        id="switch-chart-button-2"
                        place="bottom"
                        className="react-tooltip tooltip-background"
                        backgroundColor={colors.background}
                      >
                        {t`Switch to Advanced Chart`}
                      </ReactTooltip>
                    </div>
                  </ChartButton>
                )}
              {!props.isMobile &&
                props.currentChartLibrary === ChartLibrary.LightWeight &&
                props.chartLibraryConfig.allowedLibraries.includes(
                  ChartLibrary.Basic
                ) && (
                  <ChartButton
                    isMobile={props.isMobile}
                    colors={colors}
                    onClick={() => onChangeChart(ChartLibrary.Basic)}
                    className="resolution-button"
                    isTradingView={true}
                  >
                    <div data-tip="" data-for="switch-chart-button-1">
                      <Tooltipped id="switch-chart-tooltipped-1">
                        <div className="switch-chart-view-wrapper">
                          <b
                            style={{
                              marginLeft: 5,
                              marginRight: 5,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {t`Basic Chart`}
                          </b>
                        </div>
                      </Tooltipped>
                      <ReactTooltip
                        id="switch-chart-button-1"
                        place="bottom"
                        className="react-tooltip tooltip-background"
                        backgroundColor={colors.background}
                      >
                        {t`Switch to Basic Chart`}
                      </ReactTooltip>
                    </div>
                  </ChartButton>
                )}
              {/* {props.isMobile &&
                props.currentChartLibrary === ChartLibrary.Basic &&
                props.chartLibraryConfig.allowedLibraries.includes(
                  ChartLibrary.LightWeight
                ) && (
                  <ChartButton
                    isMobile={props.isMobile}
                    colors={props.colors}
                    onClick={() => onChangeChart(ChartLibrary.LightWeight)}
                  >
                    <Tooltipped id="switch-chart-tooltipped-2">
                      <div className="switch-chart-view-wrapper">
                        <ThemedIcon
                          width={16}
                          height={16}
                          verticalAlign="sub"
                          src={`${process.env.PUBLIC_URL}/static/icons/chart/lightweight-chart.svg`}
                        />
                      </div>
                    </Tooltipped>
                  </ChartButton>
                )} */}
              {/* {props.isMobile &&
                props.currentChartLibrary === ChartLibrary.LightWeight &&
                props.chartLibraryConfig.allowedLibraries.includes(
                  ChartLibrary.Basic
                ) && (
                  <ChartButton
                    isMobile={props.isMobile}
                    colors={props.colors}
                    onClick={() => onChangeChart(ChartLibrary.Basic)}
                  >
                    <Tooltipped id="switch-chart-tooltipped-1">
                      <div className="switch-chart-view-wrapper">
                        <ThemedIcon
                          width={16}
                          height={16}
                          verticalAlign="sub"
                          src={`${process.env.PUBLIC_URL}/static/icons/chart/highcharts.svg`}
                        />
                      </div>
                    </Tooltipped>
                  </ChartButton>
                )} */}
              {props.isLoggedIn && !props.isMobile && props.showConfetti && (
                <SoundSwitch />
              )}
            </ButtonsHolder>
          </PrimaryHolder>
        </PrimaryBlock>
        {props.isLoggedIn &&
          !props.isMobile &&
          !props.isCfdOptions &&
          props.currentChartLibrary === ChartLibrary.Basic && (
            <PurchaseTime colors={colors} isMobile={props.isMobile}>
              <div className="purchase-time">
                <span className="purchase-time-title">{t`purchase time`}</span>
                <span>{props.deadPeriodTime}</span>
              </div>
              {props.deadPeriodCountDown && (
                <div
                  className="countdown"
                  dangerouslySetInnerHTML={{
                    __html: props.deadPeriodCountDown,
                  }}
                ></div>
              )}
            </PurchaseTime>
          )}
        {props.isMobile && <ProductTypePanel colors={colors} />}
        {props.isCfdOptions &&
          props.currentChartLibrary === ChartLibrary.Basic && (
            <CfdSentimentSwitcher colors={colors} />
          )}
      </ControlsPanel>
      {list.type === 1 && (
        <ListContainer
          top={list.top}
          left={list.left}
          colors={colors}
          className="scrollable"
          isMobile={props.isMobile}
          style={{ backgroundColor: colors.background }}
        >
          {chartPeriods.map((period: IPeriod) => (
            <ListItem
              colors={colors}
              key={period.period}
              onClick={() => onSelectTimeframe(period)}
              active={props.timeframe === period}
            >
              <span>{period.periodToolTip}</span>
            </ListItem>
          ))}
        </ListContainer>
      )}
      {list.type === 2 && (
        <ListContainer
          top={list.top}
          left={list.left}
          colors={colors}
          className="scrollable"
          isMobile={props.isMobile}
          style={{ backgroundColor: colors.background }}
        >
          <ListItem
            colors={colors}
            onClick={() => onSelectChartType(ChartType.candlestick)}
            active={props.currentChartType === ChartType.candlestick}
          >
            <ThemedIcon
              width={16}
              height={16}
              fill={colors.secondaryText}
              stroke={colors.secondaryText}
              verticalAlign="sub"
              src={`${process.env.PUBLIC_URL}/static/icons/chart_types/candlestick.svg`}
            />
            <span>{t`Candlestick`}</span>
          </ListItem>
          <ListItem
            colors={colors}
            onClick={() => onSelectChartType(ChartType.line)}
            active={props.currentChartType === ChartType.line}
          >
            <ThemedIcon
              width={16}
              height={16}
              fill={colors.secondaryText}
              stroke={colors.secondaryText}
              verticalAlign="sub"
              src={`${process.env.PUBLIC_URL}/static/icons/chart_types/line.svg`}
            />
            <span>{t`Line`}</span>
          </ListItem>
          <ListItem
            colors={colors}
            onClick={() => onSelectChartType(ChartType.area)}
            active={props.currentChartType === ChartType.area}
          >
            <ThemedIcon
              width={16}
              height={16}
              fill={colors.secondaryText}
              stroke={colors.secondaryText}
              verticalAlign="sub"
              src={`${process.env.PUBLIC_URL}/static/icons/chart_types/area.svg`}
            />
            <span>{t`Area`}</span>
          </ListItem>
          <ListItem
            colors={colors}
            onClick={() => onSelectChartType(ChartType.ohlc)}
            active={props.currentChartType === ChartType.ohlc}
          >
            <ThemedIcon
              width={16}
              height={16}
              fill={colors.secondaryText}
              stroke={colors.secondaryText}
              verticalAlign="sub"
              src={`${process.env.PUBLIC_URL}/static/icons/chart_types/ohlc.svg`}
            />
            <span>{t`OHLC`}</span>
          </ListItem>
          {props.currentChartLibrary === ChartLibrary.Basic && (
            <ListItem
              colors={colors}
              onClick={() => onSelectChartType(ChartType.heikinashi)}
              active={props.currentChartType === ChartType.heikinashi}
            >
              <ThemedIcon
                width={16}
                height={16}
                fill={colors.secondaryText}
                stroke={colors.secondaryText}
                verticalAlign="sub"
                src={`${process.env.PUBLIC_URL}/static/icons/chart_types/heikinashi.svg`}
              />
              <span>{t`Heikin Ashi`}</span>
            </ListItem>
          )}
        </ListContainer>
      )}
      {list.type !== 0 && <Backdrop onClick={() => setList({ type: 0 })} />}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isLoggedIn: isLoggedIn(state),
  isMobile: state.registry.isMobile,
  isCfdOptions: isCfdOptionsProductType(state),
  lang: state.registry.data.lang,
  chartLibraryConfig: state.registry.data.partnerConfig.chartLibraryConfig,
  currentChartType: state.registry.currentChartType,
  currentChartLibrary: state.registry.currentChartLibrary,
  showConfetti: state.registry.data.partnerConfig.showConfetti,
})

export default connect(mapStateToProps, {
  actionChangeChartLibrary,
  actionChangeChartType,
})(ChartControls)
