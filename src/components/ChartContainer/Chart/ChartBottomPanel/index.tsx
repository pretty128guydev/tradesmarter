/**
 * Implements a chart bottom bar with zoom buttons
 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ReactComponent as ZoomIn } from './zoomIn.svg'
import { ReactComponent as ZoomOut } from './zoomOut.svg'
import { ReactComponent as ToggleOn } from './toggleOn.svg'
import { BottomPanel, BottomPanelContainer, ButtonContainer } from './styled'
import {
  ChartButtonBottomPanel,
  IndicatorsWrapper,
  IndicatorWarning,
  SwithButton,
  WarningContent,
} from '../styled'
import { t } from 'ttag'
import { IPeriod } from '../period'
import { isLoggedIn } from '../../../selectors/loggedIn'
import ChartIndicators from '../ChartIndicators'
import { isCfdOptionsProductType } from '../../../selectors/trading'
import ReactTooltip from 'react-tooltip'
import { ChartType } from '../../ChartLibraryConfig'

interface IChartBottomPanelProps {
  colors: any
  isMobile: boolean
  isLoggedIn: boolean
  isCfdOptions: boolean
  navigator: boolean
  zoomLevel: number
  onChangeZoomLevel: (zoomLevel: number) => void
  onFullScreen: () => void
  onToggleNavigator: () => void
  onChangeTimeframe: (tf: IPeriod) => void
  onChangeChartType: (cType: ChartType) => void
  periodOptions: IPeriod[]
  chartType: ChartType
  timeframe: IPeriod
  indicators?: any[]
  removeAllAnnotations: () => void
  calculateAnnotations: () => void
  toggleAnnotation: (visibility: boolean) => void
  isHighCharts: boolean
  isResetZoom?: boolean
}

const ChartBottomPanel = (props: IChartBottomPanelProps) => {
  const [zoomLevel, setZoomLevel] = useState<number>(props.zoomLevel)

  useEffect(() => {
    if (props.isResetZoom) setZoomLevel(1)
  }, [props.isResetZoom])

  const chartPeriods = [
    ChartType.candlestick,
    ChartType.ohlc,
    ChartType.heikinashi,
  ].includes(props.chartType)
    ? props.periodOptions.filter((p: IPeriod) => p.supportedOnCandleChartType)
    : props.periodOptions.filter((p: IPeriod) => p.supportedOnLineChartType)

  useEffect(() => {
    if (props.isCfdOptions) {
      props.onChangeTimeframe(props.periodOptions[1])
    }
  }, [props.isCfdOptions])

  const isTickTimeframe = props.timeframe.period === 'tick'

  return (
    <BottomPanelContainer
      className="bottom-panel-container"
      navigator={props.navigator}
      isMobile={props.isMobile}
    >
      <BottomPanel>
        {props.isMobile && (
          <>
            {props.isHighCharts && (
              <IndicatorsWrapper
                data-tip=""
                data-for="indicators_warning"
                colors={props.colors}
              >
                {isTickTimeframe && (
                  <ReactTooltip
                    id="indicators_warning"
                    place="top"
                    delayHide={1000}
                    effect="solid"
                    clickable={true}
                    className="react-tooltip tooltip-background"
                    backgroundColor={props.colors.background}
                  >
                    <IndicatorWarning>
                      <WarningContent>{t`Indicators only available on timeframes of 1 min and above.`}</WarningContent>
                      <SwithButton
                        colors={props.colors}
                        onClick={() => props.onChangeTimeframe(chartPeriods[1])}
                      >
                        {t`Switch`}
                      </SwithButton>
                    </IndicatorWarning>
                  </ReactTooltip>
                )}
                {props.indicators && (
                  <ChartIndicators
                    timeframe={props.timeframe}
                    indicators={props.indicators}
                    isLoggedIn={props.isLoggedIn}
                  />
                )}
              </IndicatorsWrapper>
            )}
          </>
        )}

        {props.isHighCharts && (
          <ChartButtonBottomPanel
            isMobile={props.isMobile}
            colors={props.colors}
          >
            <div data-tip="" data-for={'zoom_out_tooltip'}>
              <ButtonContainer width="17px" height="16px">
                <ZoomOut
                  onClick={() => {
                    if (zoomLevel < 5) {
                      props.onChangeZoomLevel(zoomLevel + 0.5)
                      setZoomLevel(zoomLevel + 0.5)
                    }
                  }}
                />
              </ButtonContainer>
              {!props.isMobile && (
                <ReactTooltip
                  id={'zoom_out_tooltip'}
                  place="top"
                  className="react-tooltip-small tooltip-background"
                  backgroundColor={props.colors.background}
                >
                  {t`Zoom out`}
                </ReactTooltip>
              )}
            </div>
          </ChartButtonBottomPanel>
        )}

        {props.isHighCharts && (
          <ChartButtonBottomPanel
            isMobile={props.isMobile}
            colors={props.colors}
          >
            <div data-tip="" data-for={'zoom_in_tooltip'}>
              <ButtonContainer width="17px" height="16px">
                <ZoomIn
                  onClick={() => {
                    if (zoomLevel > 1) {
                      props.onChangeZoomLevel(zoomLevel - 0.5)
                      setZoomLevel(zoomLevel - 0.5)
                    }
                  }}
                />
              </ButtonContainer>
              {!props.isMobile && (
                <ReactTooltip
                  id={'zoom_in_tooltip'}
                  place="top"
                  className="react-tooltip-small tooltip-background"
                  backgroundColor={props.colors.background}
                >
                  {t`Zoom in`}
                </ReactTooltip>
              )}
            </div>
          </ChartButtonBottomPanel>
        )}

        {props.isHighCharts && (
          <ChartButtonBottomPanel
            isMobile={props.isMobile}
            colors={props.colors}
          >
            <div data-tip="" data-for={'navigator_tooltip'}>
              <ButtonContainer width="17px" height="16px">
                <ToggleOn onClick={() => props.onToggleNavigator()} />
              </ButtonContainer>
              {!props.isMobile && (
                <ReactTooltip
                  id={'navigator_tooltip'}
                  place="top"
                  className="react-tooltip-small tooltip-background"
                  backgroundColor={props.colors.background}
                >
                  {t`Toggle navigator`}
                </ReactTooltip>
              )}
            </div>
          </ChartButtonBottomPanel>
        )}
      </BottomPanel>
    </BottomPanelContainer>
  )
}

export default connect((state: any) => ({
  colors: state.theme,
  isLoggedIn: isLoggedIn(state),
  isCfdOptions: isCfdOptionsProductType(state),
}))(ChartBottomPanel)
