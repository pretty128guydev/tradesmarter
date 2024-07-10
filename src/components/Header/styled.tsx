import styled from 'styled-components'
import AvatarFallbackIcon from './avatar_fallback.svg'

const Panel = styled.header<{ colors: any }>`
  display: flex;
  height: 64px;
  line-height: 64px;
  background-color: ${(props) => props.colors.panelBackground};
  border-left: 1px solid ${(props) => props.colors.panelBorder};
  border-right: 1px solid ${(props) => props.colors.panelBorder};
`
const BrandData = styled.div<any>`
  display: flex;
  flex: 1 1 auto;

  .brand-logo {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  .menu-item {
    color: ${(props) => props.colors.secondaryText};
    margin-left: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;

    span {
      padding: 8px 0;
      border-bottom: 4px solid transparent;
    }

    &.item-active {
      span {
        color: ${(props) => props.colors.primary};
        border-bottom: 4px solid ${(props) => props.colors.primary};
      }
    }
  }
`
const GuestDemoButton = styled.button<{ colors: any }>`
  flex: 0 0 auto;
  cursor: pointer;
  min-width: 130px;
  height: 32px;
  line-height: 32px;

  margin: 16px 20px;

  border: none;
  outline: none;
  text-align: center;
  border-radius: 4px;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: -0.08px;

  color: ${(props) => props.colors.primaryTextContrast};
  background-color: ${(props) => props.colors.primary};
`
/**
 * Account
 */
const AccountPanel = styled.div<any>`
  flex: 0 1 65px;
  font-size: 14px;
  font-weight: 500;
  line-height: 64px;
  height: 64px;
  letter-spacing: 0.12px;
  color: ${(props) => props.colors.secondarySubText};
  display: flex;
  cursor: pointer;
  margin-right: 20px;

  span {
    flex: 1 1 auto;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
  }
  img,
  .avatar_fallback {
    flex: 0 0 40px;
    display: inline-block;
    margin-left: 5px;
    vertical-align: middle;
  }
  .avatar_fallback {
    background: url(${AvatarFallbackIcon}) no-repeat center;
    background-size: 40px 40px;
  }
  .arrow_down {
    flex: 0 0 10px;
    margin-left: 10px;
    color: ${(props) => props.colors.primaryText};
  }
`
const LoginButton = styled.button<any>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 32px;
  padding: 0 10px;
  margin: 16px 24px 16px 0;
  font-family: Roboto, sans-serif;
  border: none;
  outline: none;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: -0.08px;
  white-space: nowrap;
  color: ${(props) => props.colors.primaryText};
  background-color: transparent;
`

const OpenAccountButton = styled.button<any>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: ${(props) => (props.isMobile ? 24 : 32)}px;
  width: ${(props) => props.isMobile && 100}px;
  padding: 0 10px;
  margin: ${(props) => (props.isMobile ? '0 10px' : '16px auto')};
  font-family: Roboto, sans-serif;
  border: none;
  outline: none;
  text-align: center;
  border-radius: 4px;
  font-size: ${(props) => (props.isMobile ? 12 : 14)}px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: -0.08px;
  white-space: nowrap;

  color: ${(props) => props.colors.primaryTextContrast};
  background-color: ${(props) => props.colors.primary};
`

const AcronymOverlay = styled.span<any>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
`

const ImgAvatar = styled.span<any>`
  position: relative;

  &:before {
    content: '${(props) => props.content}';
    position: absolute;
    top: 3px;
    left: 5px;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.color};
    font-size: 19px;
    font-weight: bold;
  }
`

const DepositButton = styled.button<any>`
  display: flex;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  margin: 16px auto;
  font-family: Roboto, sans-serif;
  border: none;
  outline: none;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: -0.08px;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.colors.primaryTextContrast};
  background-color: ${(props) => props.colors.primary};
  padding: 0 16px;

  > svg {
    margin-left: 5px;
  }
`

export {
  Panel,
  BrandData,
  GuestDemoButton,
  AccountPanel,
  LoginButton,
  OpenAccountButton,
  AcronymOverlay,
  ImgAvatar,
  DepositButton,
}
