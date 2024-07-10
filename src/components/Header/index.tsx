/**
 * Implements a header bar containing brand logo, time, language picker, user sign in & menu
 */
import React, { useState, useCallback } from 'react'
import { t } from 'ttag'

import { connect } from 'react-redux'
import Account from './Account'
import Time from './Time'
import LanguageSelect from './LanguageSelect'
import { IRegistry } from '../../core/API'
import { isLoggedIn } from '../selectors/loggedIn'
import { actionGuestDemoRequest } from '../../actions/account'
import { ThemeContextConsumer } from '../ThemeContext'
import { DepositButton, BrandData, GuestDemoButton, Panel } from './styled'
import { IPlatformMenu } from '../../reducers/container'
import { filter, isArray, orderBy } from 'lodash'
import { getTranslatedTitle } from '../helper'

interface IHeaderProps {
  data: IRegistry
  signedIn: boolean
  actionGuestDemoRequest: () => void
  practiceMode: boolean
  showTopMenu: boolean
  topMenuItems: IPlatformMenu[]
  setShowMenuContent: ({ show, link }: { show: boolean; link: string }) => void
  setShowOtherPlatform: ({
    show,
    link,
  }: {
    show: boolean
    link: string
  }) => void
}

const Header = (props: IHeaderProps) => {
  const {
    data,
    practiceMode,
    signedIn,
    showTopMenu,
    topMenuItems,
    setShowMenuContent,
    setShowOtherPlatform,
    actionGuestDemoRequest,
  } = props

  const { partnerConfig, alias } = data
  const {
    allowDemo,
    logoUrlSecondary,
    logoUrlPrimary,
    depositLink,
    depositButton,
  } = partnerConfig
  const guestDemoBtn = allowDemo && !signedIn

  const menuItems = useCallback(() => {
    return orderBy(
      filter(topMenuItems, ({ show }) => !!show).map((item: IPlatformMenu) => {
        return item
      }),
      'order'
    )
  }, [topMenuItems])

  const [activeItem, setActiveItem] = useState<string>(menuItems()[0]?.label)

  const depositBtn = isArray(depositButton) ? depositButton[0] : depositButton

  return (
    <ThemeContextConsumer>
      {(colors: any) => (
        <Panel colors={colors}>
          <BrandData colors={colors}>
            {practiceMode
              ? logoUrlSecondary && (
                  <a className="brand-logo" href={partnerConfig.logoUrl}>
                    <img height="42" src={logoUrlSecondary} alt={alias} />
                  </a>
                )
              : logoUrlPrimary && (
                  <a className="brand-logo" href={partnerConfig.logoUrl}>
                    <img height="42" src={logoUrlPrimary} alt={alias} />
                  </a>
                )}
            {showTopMenu &&
              menuItems().map(({ label, link, iframe }) => (
                <div
                  key={label}
                  className={`menu-item ${
                    activeItem === label ? 'item-active' : ''
                  }`}
                  onClick={() => {
                    activeItem !== label && setActiveItem(label)
                    setShowOtherPlatform({
                      show: iframe,
                      link,
                    })
                  }}
                >
                  <span>{label}</span>
                </div>
              ))}
            {depositBtn?.show &&
              ((depositBtn?.afterLoginOnly && signedIn) ||
                !depositBtn?.afterLoginOnly) && (
                <div className="menu-item">
                  <DepositButton
                    colors={colors}
                    onClick={() =>
                      setShowMenuContent({
                        show: true,
                        link: depositBtn?.link || depositLink,
                      })
                    }
                  >
                    {depositBtn?.label
                      ? getTranslatedTitle(depositBtn?.label)
                      : t`Deposit`}
                  </DepositButton>
                </div>
              )}
          </BrandData>
          {guestDemoBtn && (
            <GuestDemoButton
              colors={colors}
              onClick={actionGuestDemoRequest}
            >{t`Guest demo`}</GuestDemoButton>
          )}
          <Time colors={colors} />
          <LanguageSelect colors={colors} />
          <Account
            colors={colors}
            setShowOtherPlatform={setShowOtherPlatform}
          />
        </Panel>
      )}
    </ThemeContextConsumer>
  )
}

const mapStateToProps = (state: any) => ({
  data: state.registry.data,
  signedIn: isLoggedIn(state),
  practiceMode: state.account.userInfo?.practiceMode,
  showTopMenu: state.container.showTopMenu,
  topMenuItems: state.container.topMenuItems,
})

export default connect(mapStateToProps, { actionGuestDemoRequest })(Header)
