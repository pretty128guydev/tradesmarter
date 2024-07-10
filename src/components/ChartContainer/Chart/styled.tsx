/**
 * Gather all styled UI components
 */
import styled from 'styled-components'
import { ListContainer, ListItem } from '../../ui/List'
import { convertHexToRGBA } from '../../../core/utils'

const ControlsPanel = styled.div`
  position: absolute;
  z-index: 30;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  top: 7px;
  left: 11px;
  right: 0;
`
const SecondaryPanel = styled.div`
  position: absolute;
  max-width: 280px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  top: 40px;
  left: 235px;
  right: 0;
  height: 16px;

  font-size: 14px;
  letter-spacing: -0.08px;
  color: #ffffff;
  font-weight: 500;
`

const PrimaryBlock = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: center;

  &:after {
    content: ' ';
    clear: both;
  }
`

const PrimaryBlockHight = styled.div`
  flex: 1 1 auto;k
  display: flex;
  align-items: center;
  height: 40px;
  &:after {
    content: ' ';
    clear: both;
  }
`

const PrimaryHolder = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  text-align: left;
  line-height: 30px;
`

const FavIconHolder = styled.div`
  padding: 0 0 0 3px;
  img {
    padding: unset !important;
  }
`

const ButtonsHolder = styled.div`
  display: inline-flex;
  align-items: center;
`

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 4px;
`

const LastPrice = styled.span<{ colors: any }>`
  display: inline-block;
  height: 30px;
  line-height: 30px;

  padding-left: 15px;
  margin-right: 19px;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: normal;

  color: ${(props) => props.colors.primary};
`
const ChartButton = styled.button<{
  smallText?: boolean
  colors: any
  indicators?: any
  isMobile: boolean
  isTradingView?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 30px;
  width: 30px;
  line-height: 28px;
  margin: ${(props) =>
    props.isMobile && props.isTradingView
      ? '0 16px '
      : props.isTradingView
      ? '0px 8px'
      : '0 5px'};
  outline: none;
  border: none;
  border-radius: 15px;
  font-size: ${(props) => (props.smallText ? '9' : '12')}px;
  font-weight: 500;
  letter-spacing: 0.1px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;

  color: ${(props) => props.colors.primaryText};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: ${(props) => props.colors.panelBorder};

  &.resolution-button {
    width: auto !important;
  }

  .switch-chart-view-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 5px;
    color: #fff;
  }

  .tooltip-background {
    color: ${(props) => props.colors.secondaryText} !important;
    background-color: ${(props) => props.colors.background} !important;
  }
`
const ChartButtonBottomPanel = styled(ChartButton)`
  margin: 0 5px;
  padding: 0 7px;
  background-color: ${(props) => props.colors.BackgroundCircleButtons};
`

const IndicatorsButton = styled(ChartButton)`
  position: relative;
  min-width: ${(props) => (props.isMobile ? 'unset' : '124px')};
  width: ${(props) => (props.indicators && !props.isMobile ? '150px' : 'auto')};
  text-align: left;
  border-radius: 15px;

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  svg {
    display: inline-block;
    vertical-align: sub;
    margin-left: 4px;
    margin-right: 4px;
  }

  .btn__caption {
    display: inline-block;

    font-size: 12px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: normal;
    color: ${(props) => props.colors.primaryText};
  }

  .enabled__indicators {
    position: absolute;
    top: 0;
    right: 0;
    display: block;

    width: 36px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: normal;
    cursor: pointer;

    color: #000000;
    background: ${(props) => (props.isMobile ? '0px 0px' : '0px 5px')};
    box-shadow: 0 2px 4px 0
      ${(props) => convertHexToRGBA(props.colors.background, 0.8)};
  }
`

const TooltipContainer = styled.div<any>`
  display: flex;
  width: 340px;
  white-space: nowrap;
`

const TooltipColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  max-width: 50%;
  max-height: 100%;
  box-sizing: border-box;
`

const TooltipTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`

const TooltipDataCell = styled.div``

const IndicatorsWrapper = styled.div<{ colors: any }>`
  display: inline-block;

  .tooltip-background {
    color: ${(props) => props.colors.secondaryText} !important;
    background-color: ${(props) => props.colors.background} !important;
  }
`

const IndicatorWarning = styled.div`
  max-width: 186px;
`

const WarningContent = styled.div`
  line-height: normal;
  margin-bottom: 14px;
`

const SwithButton = styled.div<{ colors: any }>`
  flex: 1 0 178px;
  height: 28px;
  max-width: 92px;
  line-height: 28px;
  border-radius: 5px;
  border: solid 1px ${(props) => props.colors.primary};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.07px;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => props.colors.primary};
`

const MobileTimeFrames = styled.div<{ colors: any }>`
  display: flex;
  justify-content: space-around;
  height: 40px;
  padding: 10px;
`

const TimeFrameItem = styled.span<{ colors: any; active: boolean }>`
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: ${(props) =>
    props.active ? props.colors.primaryText : props.colors.textfieldText};
  ${(props) =>
    props.active ? `border-bottom: 2px solid ${props.colors.primary}` : ''};
  margin: 0 10px -3px 10px;
  line-height: 20px;
  cursor: pointer;
`

const PlotLineLabel = styled.div`
  position: absolute;
  top: -65px;
  left: 20px;
  // transform: rotate(90deg);
`

const PurchaseTime = styled.div<{ colors: any; isMobile: boolean }>`
  display: flex;
  padding-left: 5px;
  margin-right: ${(props) => (props.isMobile ? '10px' : '80px')};
  align-items: center;
  background-color: ${(props) => props.colors.panelBorder};

  .purchase-time {
    display: flex;
    flex: 1;
    flex-direction: column;
    color: #fff;
    align-items: center;
    margin-right: 10px;
    font-size: 13px;
    line-height: 16px;

    .purchase-time-title {
      text-transform: uppercase;
      color: ${(props) => props.colors.secondaryText};
    }
  }

  .countdown {
    padding: 5px;
  }
`

export {
  ChartButton,
  ChartButtonBottomPanel,
  IndicatorsButton,
  LastPrice,
  InfoWrapper,
  PrimaryHolder,
  ButtonsHolder,
  PrimaryBlock,
  ControlsPanel,
  ListContainer,
  ListItem,
  SecondaryPanel,
  TooltipContainer,
  TooltipColumn,
  TooltipDataCell,
  TooltipTitle,
  IndicatorsWrapper,
  IndicatorWarning,
  WarningContent,
  SwithButton,
  MobileTimeFrames,
  TimeFrameItem,
  PlotLineLabel,
  FavIconHolder,
  PrimaryBlockHight,
  PurchaseTime,
}
