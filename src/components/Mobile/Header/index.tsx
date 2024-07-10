/**
 * Implements a mobile header
 * This header consist of three panels:
 * 1) Hamburger icon, logo, user panel
 * 2) Practice vs Real switcher
 * 3) Wallet balances, position button
 */
import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { IRegistry } from '../../../core/API'
import AccountPanel from '../AccountPanel'
import { actionPracticeMode } from '../../../actions/account'
import { formatCurrency } from '../../selectors/currency'
import { isLoggedIn } from '../../selectors/loggedIn'
import {
  TopPanel,
  CompanyLogo,
  BalancePanel,
  BalanceBlock,
  InvestedBlock,
  HomeIconButton,
  MenuIconContainer,
  SidebarCounter,
  Switcher,
  KnobCaption,
  DepositButton,
} from './styled'
import { isMobileLandscape } from '../../../core/utils'
import PostionsIcon from './icon-positions.svg'
import MenuIcon from './menu.svg'
import ThemedIcon from '../../ui/ThemedIcon'
import HomeIcon from './home.svg'
import CloseIcon from './icon-close.svg'
import HamburgerIcon from './icon-hamburger.svg'
import Knob from './Knob'
import { isArray } from 'lodash'
import { OpenAccountButton } from '../../Header/styled'
import { actionShowModal, ModalTypes } from '../../../actions/modal'
import { getTranslatedTitle } from '../../helper'
import ProductTypePanel from '../../ChartContainer/MobileInstrumentsBar/ProductTypePanel'
import CfdSentimentSwitcher from '../../ChartContainer/Chart/CfdSentimentSwitcher'
import { isCfdOptionsProductType } from '../../selectors/trading'

enum MobileDrawers {
  none,
  menu,
  dashboard,
  positions,
  homeMenu,
}

interface IHeaderProps {
  showHeader: boolean
  hidePracticeButton: boolean
  allowPracticeModeChange: boolean
  practiceMode: boolean
  loggedIn: boolean
  balance: number
  invested: number
  data: IRegistry
  colors: any
  activePanel: number
  onMenuClick: () => void
  onUserMenuClick: () => void
  onHomeButtonClick: () => void
  onPositionsClick: () => void
  formatCurrency: (value: any) => string
  actionPracticeMode: (mode: boolean) => void
  isMobile: boolean
  onSearchAssetsButtonClick: () => void
  openTradesCount: number
  actionShowModal: any
  setShowMenuContent: (link: string) => void
  isHighCharts?: boolean
  isCfdOptions: boolean
}

const Header = (props: IHeaderProps) => {
  const {
    showHeader,
    hidePracticeButton,
    allowPracticeModeChange,
    loggedIn,
    practiceMode,
    balance,
    invested,
    colors,
    formatCurrency,
    activePanel,
    isMobile,
    onPositionsClick,
    onHomeButtonClick,
    onUserMenuClick,
    onMenuClick,
    data,
    onSearchAssetsButtonClick,
    openTradesCount,
    actionShowModal,
    actionPracticeMode,
    setShowMenuContent,
    isCfdOptions,
    isHighCharts,
  } = props
  const { partnerConfig } = data
  const showKnob = allowPracticeModeChange && !hidePracticeButton

  const { openAccountButton, depositButton, depositLink } = partnerConfig

  const openAccountBtn = isArray(openAccountButton)
    ? openAccountButton[0]
    : openAccountButton

  const depositBtn = isArray(depositButton) ? depositButton[0] : depositButton

  const onOpenAccountModal = () => actionShowModal(ModalTypes.OPEN_ACCOUNT)

  return (
    <>
      {showHeader && (
        <TopPanel colors={colors} isMobile={isMobile} loggedIn={loggedIn}>
          <HomeIconButton onClick={onMenuClick}>
            <ThemedIcon
              width={20}
              height={20}
              fill={colors.primary}
              src={HamburgerIcon}
            />
          </HomeIconButton>

          {/* {!loggedIn && openAccountBtn?.show && (
          <OpenAccountButton
            colors={colors}
            isMobile={true}
            onClick={onOpenAccountModal}
          >
            {openAccountBtn?.label
              ? getTranslatedTitle(openAccountBtn?.label)
              : t`Open Account`}
          </OpenAccountButton>
        )} */}
          {!loggedIn && partnerConfig.logoUrlPrimary && (
            <CompanyLogo isMobile={isMobile}>
              <a href={partnerConfig.logoUrl}>
                <img height={30} src={partnerConfig.logoUrlPrimary} alt="" />
              </a>
            </CompanyLogo>
          )}
          {loggedIn && (
            <div className="chart-option-select">
              <ProductTypePanel colors={props.colors} />
              {props.isCfdOptions && props.isHighCharts && (
                <CfdSentimentSwitcher colors={props.colors} />
              )}
            </div>
          )}

          {/* <CompanyLogo isMobile={isMobile}>
            {!loggedIn && partnerConfig.logoUrlPrimary && (
              <a href={partnerConfig.logoUrl}>
                <img height={30} src={partnerConfig.logoUrlPrimary} alt="" />
              </a>
            )}
            {depositBtn?.show &&
              ((depositBtn?.afterLoginOnly && loggedIn) ||
                !depositBtn?.afterLoginOnly) && (
                <div className="menu-item">
                  <DepositButton
                    colors={colors}
                    onClick={() =>
                      setShowMenuContent(depositBtn?.link || depositLink)
                    }
                  >
                    {depositBtn?.label
                      ? getTranslatedTitle(depositBtn?.label)
                      : t`Deposit`}
                  </DepositButton>
                </div>
              )}
          </CompanyLogo> */}
          {loggedIn ? (
            <HomeIconButton onClick={onHomeButtonClick}>
              {Number(activePanel) === Number(MobileDrawers.homeMenu) ? (
                <ThemedIcon
                  width={16}
                  height={16}
                  stroke={colors.primary}
                  src={CloseIcon}
                />
              ) : (
                <ThemedIcon
                  width={24}
                  height={24}
                  stroke={colors.primary}
                  src={HomeIcon}
                />
              )}
            </HomeIconButton>
          ) : (
            <AccountPanel onMenuClick={onUserMenuClick} colors={colors} />
          )}
        </TopPanel>
      )}
      {loggedIn && (
        <BalancePanel colors={colors} isMobile={isMobile} loggedIn={loggedIn}>
          <div className="flex-center">
            {loggedIn && (
              <BalanceBlock colors={colors}>
                <span>{t`Balance`}</span>
                <div>{formatCurrency(balance)}</div>
              </BalanceBlock>
            )}
            {loggedIn && (
              <div
                style={{
                  margin: '0px 10px',
                  width: '0.5px',
                  height: '30px',
                  background: `${colors.secondaryText}`,
                }}
              ></div>
            )}
            {/* <MenuIconContainer
            colors={colors}
            onClick={onSearchAssetsButtonClick}
          >
            <ThemedIcon
              width={20}
              height={20}
              fill={colors.primary}
              stroke={colors.primary}
              src={MenuIcon}
            />
          </MenuIconContainer> */}
            {showKnob && (
              <Switcher>
                <div className="knobContainer">
                  <Knob
                    backgroundColor={colors.primary}
                    pinColor="#FFFFFF"
                    knobOnLeft={practiceMode}
                    onChange={() => actionPracticeMode(!practiceMode)}
                  />
                </div>
                <KnobCaption
                  active={practiceMode}
                  colors={colors}
                >{t`Practice`}</KnobCaption>
                <KnobCaption
                  active={!practiceMode}
                  colors={colors}
                >{t`Real`}</KnobCaption>
              </Switcher>
            )}
          </div>
          {/* {loggedIn && (
          <InvestedBlock colors={colors}>
            <span>{t`Invested`}</span>
            <div>{formatCurrency(invested)}</div>
          </InvestedBlock>
        )} */}
          {/* {loggedIn && (
          <MenuIconContainer colors={colors} onClick={onPositionsClick}>
            <ThemedIcon
              width={24}
              height={24}
              fill={colors.primary}
              stroke={colors.primary}
              src={PostionsIcon}
            />
            {openTradesCount && openTradesCount > 0 ? (
              <SidebarCounter colors={colors} top={3} right={3} size={14}>
                {openTradesCount}
              </SidebarCounter>
            ) : null}
          </MenuIconContainer>
        )} */}
          <CompanyLogo isMobile={isMobile}>
            {depositBtn?.show &&
              ((depositBtn?.afterLoginOnly && loggedIn) ||
                !depositBtn?.afterLoginOnly) && (
                // <div className="menu-item">
                <DepositButton
                  colors={colors}
                  onClick={() =>
                    setShowMenuContent(depositBtn?.link || depositLink)
                  }
                >
                  {depositBtn?.label
                    ? getTranslatedTitle(depositBtn?.label)
                    : t`Deposit`}
                </DepositButton>
                // </div>
              )}
          </CompanyLogo>
        </BalancePanel>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  data: state.registry.data,
  allowPracticeModeChange: state.account.userInfo?.allowPracticeModeChange,
  practiceMode: state.account.userInfo?.practiceMode,
  hidePracticeButton: state.registry.data.partnerConfig.hidePracticeButton,
  loggedIn: isLoggedIn(state),
  balance: state.wallets
    ? state.wallets.availableCash + state.wallets.availableBonus
    : 0,
  invested: state.wallets ? state.wallets.reserved : 0,
  formatCurrency: formatCurrency(state),
  colors: state.theme,
  isMobile: state.registry.isMobile,
  openTradesCount: state.trades.open.length,
  isCfdOptions: isCfdOptionsProductType(state),
})

export default connect(mapStateToProps, {
  actionPracticeMode,
  actionShowModal,
})(Header)
