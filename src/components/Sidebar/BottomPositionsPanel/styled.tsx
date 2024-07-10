import styled from 'styled-components'
import { convertHexToRGBA } from '../../../core/utils'

const BottomPositionPanel = styled.div<{ colors: any }>`
  background-color: ${(props) => props.colors.tradebox.widgetBackground};
  padding-bottom: 15px;

  .table-wrap {
    overflow: auto;
    padding-left: 15px;
  }
`

const HeaderTrade = styled.div<{ colors: any }>`
  display: flex;
  justify-content: space-between;
  padding: 0 20px 10px;

  .title-panel {
    color: ${(props) => {
      return props.colors.primaryText
    }};
    font-size: 15px;
    font-weight: 500;
    padding-left: 10px;
  }

  .group-button {
    padding-top: 10px;
    button {
      background-color: transparent;
      border-radius: 5px;
      font-weight: 400;
      font-size: 13px;
      text-transform: capitalize;
      color: ${(props) => props.colors.secondaryText};
      ouline: none !important;
      letter-spacing: 0.2px;

      &.active {
        background-color: ${(props) => props.colors.background};
        color: ${(props) => props.colors.primaryText};
      }

      &:hover:not(.active),
      &:active:not(.active),
      &:focus:not(.active) {
        background: transparent !important;

        &::before {
          background: transparent !important;
        }
      }
    }
  }
`

const TradeTable = styled.table<{ colors: any }>`
  width: 100%;
  border-collapse: collapse;

  thead tr th {
    position: sticky;
    top: 0;
    padding-top: 0;
    background-color: ${(props) => props.colors.tradebox.widgetBackground};
    z-index: 1;
  }

  th,
  td {
    border: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    color: ${(props) => props.colors.primaryText};
    padding-left: 10px;

    .close-button {
      background: #2b1c31;
      color: ${(props) => props.colors.secondary};
      border: 1px solid;
      border-color: ${(props) => props.colors.secondary};
      border-radius: 3px;
      font-size: 11px;
      padding-right: 10px;
      padding-left: 10px;
      font-weight: 600;
      min-height: 25px;
      max-height: 25px;
      letter-spacing: 0.2px;
      text-transform: uppercase;
    }
  }

  th {
    font-size: 12px;
    padding-bottom: 15px;
    text-transform: uppercase;
    font-weight: 600;
  }

  td {
    font-size: 14px;
    padding-bottom: 3px;
    padding-top: 3px;
    font-weight: 400;
  }

  tr {
    border-bottom: 1px solid #273346;

    &.buy-row {
      .trade_direction {
        transform: rotate(180deg) translateY(-2px);
      }
    }

    &.sell-row {
      .trade_direction {
        transform: translateY(-2px);
      }
    }

    .trade_direction {
      display: inline-block;
      font-size: 24px;
    }

    .up-color {
      color: ${(props) => props.colors.primary};
    }

    .down-color {
      color: ${(props) => props.colors.secondary};
    }

    .amount-group {
      display: flex;
      justify-content: flex-start;

      > span {
        margin-right: 8px;
      }

      > div {
        cursor: pointer;
      }
    }
  }

  .fit-width {
    width: 1px;
    white-space: nowrap;
  }

  .highlight-win {
    background-color: ${(props) => convertHexToRGBA(props.colors.primary, 0.5)};
  }
`

const LineExpandWraper = styled.div<{ colors: any }>`
  height: 3px;
  background-color: ${(props) => props.colors.panelBorder};
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: ns-resize !important;
  z-index: 2;
`

const LineExpand = styled.div<{ colors: any }>`
  display: flex;
  padding: 4px 10px 4px 25px;
  margin-bottom: 2px;
  background-color: ${(props) => props.colors.background};
  border: 1px solid ${(props) => props.colors.panelBorder};
  position: relative;
  align-items: center;
  justify-content: space-around;
  border-radius: 50px;
  cursor: pointer;
  z-index: 2;
`

const LineExpandIcon = styled.div<{ colors: any }>`
  color: ${(props) => props.colors.primaryText};
  width: 100%;
  font-size: 13px;

  > span {
    position: absolute;
    left: 10px;
    top: 4.7px;
    font-size: 16px;

    &:first-child {
      transform: rotate(180deg);
      top: 1px;
    }
  }

  .counter-container {
    display: inline-block;
  }
`

const Counter = styled.div<{ colors: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  min-width: 18px;
  height: 18px;
  font-size: 11px;
  border: 1px solid ${(props) => props.colors.primary};
  border-radius: 50%;
  color: ${(props) => props.colors.primary};
`
export {
  BottomPositionPanel,
  HeaderTrade,
  TradeTable,
  LineExpand,
  LineExpandWraper,
  LineExpandIcon,
  Counter,
}
