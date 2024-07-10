/**
 * TradeBox panel styles
 */
import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../core/utils'

const Wrapper = styled.div<any>`
  width: ${(props) => (props.isMobile ? '100%' : '140px')};
  padding: ${(props) => (props.isMobile ? '10px 20px 20px 20px' : '10px')};
  box-sizing: border-box;
  background-color: ${(props) => props.colors.tradebox.widgetBackground};
  border-left: 1px solid ${(props) => props.colors.panelBorder};
  position: relative;

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            width: 180px !important;
            padding: 9px !important;
            background-color: #1d2834 !important;
            height: ${window.innerHeight}px;
            overflow: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
            &::-webkit-scrollbar {
              display: none;
            }
          }
        `
      : css``}
`

const Label = styled.span<{ colors: any; top: number }>`
  display: block;
  margin-top: ${(props) => props.top}px;
  height: 14px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.1px;
  color: ${(props) => props.colors.sidebarLabelText};

  div {
    display: inline-block;
    margin-left: 10px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1px;

    color: ${(props) => props.colors.primary};
  }
  svg,
  img {
    vertical-align: middle;
    margin-left: 5px;
    width: 14px;
    height: 14px;
  }
`
const PotentialProfit = styled.div<{ colors: any }>`
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 35px;
  line-height: 35px;
  border-radius: 3px;
  background-color: ${(props) => props.colors.tradebox.expiryBackground};
  color: ${(props) => props.colors.primary};

  h2 {
    height: 28px;
    flex: 1 1 auto;
    text-align: right;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 6px;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 0.2px;
  }
  h3 {
    height: 28px;
    flex: 1 1 auto;
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 6px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1px;
  }
`

const PayoutLabel = styled.div<{ colors: any; isMobile: boolean }>`
  display: block;
  height: 14px;
  margin-top: 20px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.colors.sidebarLabelText};

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            margin: 20px auto 0 auto;
          }
        `
      : css``}

  span {
    display: flex;
    justify-content: space-between;

    svg {
      cursor: pointer;
    }
  }

  svg,
  img {
    margin-left: 7px;
    vertical-align: middle;
  }
`

const PayoutValue = styled.div<{ colors: any }>`
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.colors.primary};
`

const CreateTradeButton = styled.div<{
  disabled: boolean
  colors: any
  isMobile: boolean
}>`
  display: block;
  margin-top: ${(props) => (isMobileLandscape(props.isMobile) ? 10 : 20)}px;
  height: 42px;
  line-height: 42px;
  border-radius: 4px;

  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.09px;
  text-align: center;
  text-transform: uppercase;
  user-select: none;

  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  color: ${(props) =>
    props.disabled ? props.colors.btnDisabledText : props.colors.btnNormalText};
  background: ${(props) =>
    props.disabled
      ? props.colors.tradebox.btnDisabled
      : props.colors.tradebox.btnNormal};

  &:hover {
    color: ${(props) => (props.disabled ? '' : props.colors.primaryText)};
    background: ${(props) =>
      props.disabled ? '' : props.colors.tradebox.highHover};
  }
`

const TradeButtonPlaceHolder = styled.div<{ colors: any; isMobile: boolean }>`
  display: flex;
  margin-top: ${(props) => (isMobileLandscape(props.isMobile) ? 10 : 20)}px;
  margin-left: 10px;
  margin-right: 10px;
  height: 42px;
  line-height: 18px;
  border-radius: 4px;
  border: 2px dashed ${(props) => props.colors.secondaryText};
  font-size: 14px;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  user-select: none;
  color: ${(props) => props.colors.secondaryText};
  background: transparent;
  padding: 6px;
`

const MobileDirectionPanels = styled.div<any>`
  display: flex;
  div {
    flex: 1;
    ${(props) =>
      isMobileLandscape(props.isMobile)
        ? css`
            flex-wrap: wrap;
            align-items: center;
          `
        : css``}
    &:first-of-type {
      margin-right: 10px;
    }
  }
`
const PayoutInformationPanel = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: column;
  z-index: 41;
  position: relative;
  left: -365px;
  top: -60px;
  width: 322px;
  padding: 10px;
  border-radius: 2px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) => props.colors.modalBackground};

  &:after {
    content: '';
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%);
    background-color: ${(props) => props.colors.modalBackground};
    position: absolute;
    z-index: 1000;
    width: 36px;
    height: 36px;
    right: -18px;
    top: 35px;
  }
`
const PayoutBoxLabel = styled.span<{ colors: any }>`
  display: block;
  margin: 5px auto 15px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  letter-spacing: 0.1px;
  color: ${(props) => props.colors.sidebarLabelText};
`
const MobilePayoutInformationPanel = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  border-radius: 2px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) => props.colors.modalBackground};
  z-index: 9999;
  padding: 0 8px;
`
const MobileDisableTradeTooltip = styled.div<{ colors: any }>`
  display: flex;
  text-align: center;
  margin-top: 10px;
  margin-bottom: -10px;
  color: ${(props) => props.colors.secondaryText};
`

export {
  Wrapper,
  Label,
  CreateTradeButton,
  PotentialProfit,
  MobileDirectionPanels,
  PayoutLabel,
  PayoutInformationPanel,
  PayoutBoxLabel,
  TradeButtonPlaceHolder,
  MobilePayoutInformationPanel,
  MobileDisableTradeTooltip,
  PayoutValue,
}
