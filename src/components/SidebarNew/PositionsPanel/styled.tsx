import styled from 'styled-components'
import expand from './arrow-expand.svg'
import collapse from './arrow-collapse.svg'

const PositionsListPanel = styled.div`
  display: block;
  padding: 10px 1px;
  box-sizing: border-box;
`

const PositionItemPanel = styled.span<{
  selected: boolean
  colors: any
  opened: boolean
  isInGroup: boolean
}>`
  position: relative;
  display: block;
  box-sizing: border-box;
  margin-bottom: 5px;
  background: ${(props) =>
    props.opened ? props.colors.sidebarElementActive : 'none'};

  &:before {
    content: '';
    position: absolute;
    height: 100%;
    background-color: ${(props) =>
      props.selected || props.isInGroup
        ? props.colors.primary
        : props.colors.background};
    width: ${(props) => (props.isInGroup ? '4px' : '')};
    z-index: 1;
  }

  &:hover {
    outline: 1px solid ${(props) => props.colors.primary};
  }
`
const ShortPositionPanel = styled.div<any>`
  display: flex;
  width: 100%;
  height: 50px;
  box-sizing: border-box;

  position: relative;
  background-color: ${(props) =>
    props.opened ? props.colors.sidebarElementActive : props.colors.background};

  img {
    margin: 5px 0 0 10px;
    width: 26px;
    height: 26px;
  }
`
const LongPositionPanel = styled.div<any>`
  padding: 10px;
  box-sizing: border-box;
  position: relative;

  .line {
    display: flex;
    div {
      flex: 1 1 auto;
      text-align: left;
      font-size: 12px;
      line-height: 1.42;
      letter-spacing: 0.01px;
      color: #646e79;
    }
    span {
      flex: 1 1 auto;
      text-align: right;
      font-size: 12px;
      line-height: 1.42;
      letter-spacing: 0.01px;
      color: ${(props) => props.colors.primaryText};
    }
  }
  .trade_line {
    display: flex;
    height: 28px;
    margin-top: 18px;
    margin-bottom: 21px;

    div:nth-child(1) {
      flex: 1 0 178px;
    }

    div:nth-child(2) {
      flex: 0 1 30%;
    }

    div:nth-child(3) {
      flex: 0 1 30%;
    }
  }
`

const TradeInfo = styled.div<{}>`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`

const TradeDetails = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 6px;

  .trade__asset_name {
    font-size: 11px;
    letter-spacing: 0.09px;
    color: ${(props) => props.colors.primaryText};
  }
  .trade__direction {
    font-size: 10px;
    letter-spacing: 0.01px;
    color: #66707a;
    text-transform: uppercase;
  }
  .trade__money {
    font-size: 10px;
    letter-spacing: 0.01px;
  }
`

const TradeInfoExpander = styled.div<{ colors: any; opened: boolean }>`
  width: 28px;
  height: 100%;
  border-left: 1px solid ${(props) => props.colors.panelBorder};
  margin-left: 10px;
  background: url(${(props) => (props.opened ? collapse : expand)}) no-repeat
    center;
  cursor: pointer;
`

const ExpandButton = styled.div<any>`
  display: block;
  width: 20px;
  height: 10px;
  position: absolute;
  bottom: 5px;
  left: calc(50% - 10px);
  cursor: pointer;

  background: url(${expand}) no-repeat center;
  color: ${(props) => props.colors.sidebarBorder};
`

const CollapseButton = styled.div<any>`
  display: block;
  width: 20px;
  height: 10px;
  position: absolute;
  bottom: 5px;
  left: calc(50% - 10px);
  cursor: pointer;

  background: url(${collapse}) no-repeat center;
  color: ${(props) => props.colors.secondaryText};
`

const SellbackButton = styled.div<{ colors: any }>`
  flex: 1 0 178px;
  height: 28px;
  line-height: 28px;
  border-radius: 2px;
  border: solid 1px ${(props) => props.colors.primary};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.07px;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => props.colors.primary};
  cursor: pointer;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    opacity: 0.7;
  }
`
const ButtonIcon = styled.div<any>`
  flex: 0 1 30%;
  text-align: right;
  margin-right: 7px;
  cursor: pointer;
`
const FloatingAmount = styled.span<{ color: string; closed: boolean }>`
  position: absolute;
  top: 14px;
  right: ${(props) => (props.closed ? 10 : 50)}px;
  bottom: 14px;
  font-weight: 500;
  color: ${(props) => props.color};
`

const TradeAmount = styled.div<{ color: string }>`
  display: flex;
  font-weight: 500;
  color: ${(props) => props.color};
  align-items: center;
`

const TradePnl = styled.div<{ color: any }>`
  display: flex;
  flex-direction: column;
  text-align: right;
  margin-right: 10px;
  color: ${(props) => props.color};

  .label {
    font-size: 10px;
    text-align: right;
    letter-spacing: 0.00641px;
    color: #66707a;
  }
`

const PositionOverlay = styled.div`
  position: absolute;
  z-index: 40;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
`

const ClosedPositionsScroller = styled.div<{ colors: any }>`
  display: flex;
  overflow: auto;
  flex-direction: column;

  .positions-actions {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    span {
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      color: ${(props) => props.colors.primaryText};
    }

    .positions_load-more {
      font-size: 14px;
      line-height: 16px;
      text-transform: uppercase;
      cursor: pointer;
      color: ${(props) => props.colors.primary};
    }
  }
`
export {
  LongPositionPanel,
  ShortPositionPanel,
  PositionItemPanel,
  PositionsListPanel,
  ExpandButton,
  CollapseButton,
  SellbackButton,
  ButtonIcon,
  FloatingAmount,
  PositionOverlay,
  ClosedPositionsScroller,
  TradeInfo,
  TradeAmount,
  TradeDetails,
  TradeInfoExpander,
  TradePnl,
}
