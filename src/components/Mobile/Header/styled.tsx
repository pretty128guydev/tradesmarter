/**
 * Implements a components from mobile header:
 * 3 panels, containers, captions
 */
import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'
import HamburgerIcon from './icon-hamburger.svg'

const TopPanel = styled.header<{
  colors: any
  isMobile: boolean
  loggedIn: boolean
}>`
  display: flex;
  width: 100%;
  flex: 0 0 60px;
  box-sizing: border-box;
  border-radius: 0px 0px 8px 8px;
  background-color: #514a4a38;
  padding: ${(props) => !props.loggedIn && '5px 0px'};
  margin-bottom: ${(props) => !props.loggedIn && '4px'};
  //   @media (orientation: landscape) {
  //     background-color: #141f2c !important;
  //   }
  .chart-option-select {
    flex: 1;
    justify-content: center;
    margin: 15px;
  }
`

const Hamburger = styled.div`
  flex: 0 0 58px;
  background: url(${HamburgerIcon}) no-repeat 20px center;
`

const HomeIconButton = styled.div<any>`
  flex: 0 0 58px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const MenuIconContainer = styled.div<{ colors: any }>`
  display: flex;
  width: 45px;
  height: 45px;
  justify-content: center;
  align-items: center;
  position: relative;
`

const CompanyLogo = styled.div<{ isMobile: boolean }>`
  flex: 1 1 auto;
  text-align: center;
  a {
    display: block;
    ${(props) =>
      props.isMobile && isMobileLandscape(props.isMobile)
        ? css`
            margin: 5px auto;
            @media (orientation: landscape) {
              margin: 5px auto;
            }
          `
        : css`
            margin: 5px auto;
          `}

    img {
      ${(props) =>
        props.isMobile && isMobileLandscape(props.isMobile)
          ? css`
              height: 30px;
              @media (orientation: landscape) {
                height: 30px;
              }
            `
          : css`
              height: 30px;
            `}
      width: auto;
    }
  }
`
const Switcher = styled.section`
  display: grid;
  grid-template-columns: 28px auto;
  grid-template-rows: auto auto;

  .knobContainer {
    grid-column: 1;
    grid-row: 1 / 3;
    transform: rotate(90deg);
  }
`
const InnerContainer = styled.div`
  display: flex;
  width: 120px;
  height: 12px;
  line-height: 12px;
  margin: 12px auto 0;
`
const KnobCaption = styled.span<any>`
  flex: 1 1 auto;
  height: 18px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: -0.17px;
  text-transform: uppercase;
  color: ${(props) =>
    props.active ? props.colors.primary : props.colors.secondaryText};
`

const BalancePanel = styled.section<{
  colors: any
  isMobile: boolean
  loggedIn: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 1px solid ${(props) => props.colors.panelBorder};
  border-bottom: 1px solid ${(props) => props.colors.panelBorder};
  padding: ${(props) => (isMobileLandscape(props.isMobile) ? '4px 15px' : '0')};
  background-color: #514a4a38;
  border-radius: 8px;
  margin: 3px;
  padding: ${(props) => (!props.loggedIn ? '10px 0px' : '7px 11px 7px 11px')};

  .flex-center {
    display: flex;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
    height: 30px;
    padding: ${(props) => !props.loggedIn && '10px 0px'};
  }
`

const BalanceBlock = styled.div<any>`
  span {
    display: block;
    font-size: 12px;
    letter-spacing: 0.01px;
    color: ${(props) => props.colors.secondaryText};
  }
  div {
    display: block;
    font-size: 19px;
    font-weight: 500;
    letter-spacing: 0.01px;
    color: ${(props) => props.colors.primary};
    max-width: 145px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`
const InvestedBlock = styled.div<any>`
  span {
    display: block;
    font-size: 12px;
    letter-spacing: 0.01px;
    color: ${(props) => props.colors.secondaryText};
  }
  div {
    display: block;
    font-size: 19px;
    font-weight: 500;
    letter-spacing: 0.01px;
    text-align: center;
    white-space: nowrap;

    color: ${(props) => props.colors.primary};
  }
`

const HomeButton = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`

const SidebarCounter = styled.div<{
  colors: any
  size?: number
  top?: number
  right?: number
}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: ${(props) => props.top || -10}px;
  right: ${(props) => props.right || -10}px;
  width: ${(props) => props.size || 18}px;
  height: ${(props) => props.size || 18}px;
  font-size: 12px;
  padding: 0 2px;
  border: 1px solid ${(props) => props.colors.primary};
  border-radius: 50%;
  color: ${(props) => props.colors.primary};
  background-color: ${(props) => props.colors.panelBackground};
`

const DepositButton = styled.button<any>`
  display: flex;
  cursor: pointer;
  height: 37px;
  width: 100px;
  line-height: 23px;
  margin-left: auto;
  font-family: Roboto, sans-serif;
  border: none;
  outline: none;
  text-align: center;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: -0.08px;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.colors.primaryTextContrast};
  background-color: ${(props) => props.colors.primary};
  padding: 0 5px;

  > svg {
    margin-left: 5px;
  }
`

export {
  HomeIconButton,
  HomeButton,
  BalanceBlock,
  InvestedBlock,
  BalancePanel,
  KnobCaption,
  InnerContainer,
  Switcher,
  CompanyLogo,
  Hamburger,
  TopPanel,
  SidebarCounter,
  MenuIconContainer,
  DepositButton,
}
