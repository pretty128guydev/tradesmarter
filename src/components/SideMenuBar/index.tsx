import React, { useState, useCallback } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import styled from 'styled-components'
import AccountIcon from './icons/accountIcon'
import DashboardIcon from './icons/dashboardIcon'
import EducationIcon from './icons/educationIcon'
import LogoutIcon from './icons/logoutIcon'
import ProfileIcon from './icons/profileIcon'
import TermsIcon from './icons/termsIcon'
import ToolsIcon from './icons/toolsIcon'
import TradingIcon from './icons/tradingIcon'
import DropdownIcon from './icons/dropdownIcon'
import { filter, orderBy } from 'lodash'
import { isLoggedIn } from '../selectors/loggedIn'
import CollapseButton from './CollapseButton'
import { actionSetCollapsedSideMenu } from '../../actions/container'
import { IPlatformMenu } from '../../reducers/container'
import { actionLogout } from '../../actions/account'
import { getTranslatedTitle } from '../helper'
import { IUserInfo } from '../../core/API'

const SideMenuContainer = styled.div<any>`
  width: ${(props) => (props.collapsed ? '42px' : '220px')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 1px solid ${(props) => props.colors.panelBorder};
  padding-top: 40px;
  position: relative;
  // -moz-transition: width 0.2s;
  // -ms-transition: width 0.2s;
  // -o-transition: width 0.2s;
  // -webkit-transition: width 0.2s;
  // transition: width 0.2s;

  .menu-item {
    color: ${(props) => props.colors.secondaryText};
    display: flex;
    padding: 10px;
    font-size: 16px;
    font-weight: 400;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-left: 2px solid transparent;

    &:hover {
      color: ${(props) => props.colors.primary};

      .fill-color {
        path {
          fill: ${(props) => props.colors.primary};
        }
      }
    }

    > span:first-child {
      margin-right: 10px;
      display: flex;
      align-items: center;

      > span:first-child {
        margin-right: 10px;
      }
    }

    .icon-collapse {
      display: flex;
      align-items: center;
    }

    .menu-item-label {
    }
  }

  .sub-menu-item {
    margin-left: 30px;
  }

  .item-active {
    color: ${(props) => props.colors.primary};
    border-left: 2px solid ${(props) => props.colors.primary};
  }

  .sub-item-active {
    color: ${(props) => props.colors.primary};
  }
`

interface ISideMenubarProps {
  userInfo: IUserInfo
  colors: any
  isLoggedIn: boolean
  setShowMenuContent: ({ show, link }: { show: boolean; link: string }) => void
  collapsedSideMenu: boolean
  actionSetCollapsedSideMenu: (isShow: boolean) => void
  sideMenuItems: IPlatformMenu[]
  actionLogout: (reload: boolean) => void
}

const SideMenuBar = (props: ISideMenubarProps) => {
  const {
    userInfo,
    colors,
    isLoggedIn,
    setShowMenuContent,
    collapsedSideMenu,
    actionSetCollapsedSideMenu,
    sideMenuItems,
    actionLogout,
  } = props

  const menuItems = useCallback(() => {
    return orderBy(
      filter(sideMenuItems, ({ show }) => !!show).map((item: IPlatformMenu) => {
        const { subItems } = item
        const orderSubItems = orderBy(
          filter(subItems, ({ show }) => !!show),
          'order'
        )
        return { ...item, subItems: orderSubItems }
      }),
      'order'
    )
  }, [sideMenuItems])

  const [currentActiveItem, setCurrentActiveItem] = useState<string>('')
  const [activeItems, setActiveItems] = useState<string[]>([])
  const [activeSubItem, setActiveSubItem] = useState<string | null>('')

  const getIcon = (key: string, isActive: boolean) => {
    const { colors } = props

    switch (key) {
      case 'Dashboard':
        return (
          <DashboardIcon
            color={isActive ? colors.primary : colors.secondaryText}
          />
        )
      case 'My Profile':
        return (
          <ProfileIcon
            color={isActive ? colors.primary : colors.secondaryText}
          />
        )
      case 'Accounts':
        return (
          <AccountIcon
            color={isActive ? colors.primary : colors.secondaryText}
          />
        )
      case 'Trading':
        return (
          <TradingIcon
            color={isActive ? colors.primary : colors.secondaryText}
          />
        )
      case 'Tools':
        return (
          <ToolsIcon color={isActive ? colors.primary : colors.secondaryText} />
        )
      case 'Education':
        return (
          <EducationIcon
            color={isActive ? colors.primary : colors.secondaryText}
          />
        )
      case 'Terms & Privacy':
        return (
          <TermsIcon color={isActive ? colors.primary : colors.secondaryText} />
        )
    }
  }

  const onClickMenuItem = (item: IPlatformMenu) => {
    const { label, subItems } = item
    currentActiveItem !== label && setCurrentActiveItem(label)
    collapsedSideMenu && actionSetCollapsedSideMenu(false)
    if (activeItems.includes(label)) {
      const items = filter(activeItems, (item) => item !== label)
      setActiveItems(items)
    } else {
      setActiveItems([...activeItems, label])
    }
    if (!subItems || !(subItems && subItems.length > 0)) {
      onClickSubMenuItem(item)
    }
  }

  const onClickSubMenuItem = (item: IPlatformMenu) => {
    collapsedSideMenu && actionSetCollapsedSideMenu(false)
    setActiveSubItem(item.label)
    setShowMenuContent({ show: true, link: item.link })
  }

  return (
    <SideMenuContainer colors={colors} collapsed={collapsedSideMenu}>
      <CollapseButton
        colors={colors}
        collapsed={collapsedSideMenu}
        onClick={() => actionSetCollapsedSideMenu(!collapsedSideMenu)}
      />
      <div className="top-menu">
        {menuItems().map((menuItem: IPlatformMenu) => {
          const { afterLoginOnly, label, subItems } = menuItem

          if (afterLoginOnly && !isLoggedIn) return null

          return (
            <div key={label}>
              <div
                className={`menu-item ${
                  currentActiveItem === label ? 'item-active' : ''
                }`}
                onClick={() => onClickMenuItem(menuItem)}
              >
                <span className="fill-color">
                  <span>{getIcon(label, currentActiveItem === label)}</span>
                  <span className="menu-item-label">
                    {getTranslatedTitle(label)}
                  </span>
                </span>
                {subItems && subItems.length > 0 && (
                  <span
                    className="icon-collapse"
                    style={
                      activeItems.includes(label)
                        ? { transform: 'rotate(180deg)' }
                        : {}
                    }
                  >
                    <DropdownIcon
                      width={8}
                      height={4}
                      color={colors.secondaryText}
                    />
                  </span>
                )}
              </div>
              {activeItems.includes(label) &&
                !collapsedSideMenu &&
                subItems &&
                subItems.map(
                  (item: IPlatformMenu) =>
                    ((item.afterLoginOnly && isLoggedIn) ||
                      !item.afterLoginOnly) && (
                      <div
                        key={item.label}
                        className={`menu-item sub-menu-item ${
                          activeSubItem === item.label ? 'sub-item-active' : ''
                        }`}
                        onClick={() => onClickSubMenuItem(item)}
                      >
                        <span className="menu-item-label">
                          {getTranslatedTitle(item.label)}
                        </span>
                      </div>
                    )
                )}
            </div>
          )
        })}
      </div>
      <div className="bottom-menu">
        {isLoggedIn && (
          <div className="menu-item" onClick={() => actionLogout(true)}>
            <span className="fill-color">
              <span>
                <LogoutIcon color={colors.secondaryText} />
              </span>
              <span className="menu-item-label">{t`Log out`}</span>
            </span>
          </div>
        )}
      </div>
    </SideMenuContainer>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  userInfo: state.account.userInfo,
  isLoggedIn: isLoggedIn(state),
  collapsedSideMenu: state.container.collapsedSideMenu,
  sideMenuItems: state.container.sideMenuItems,
})

export default connect(mapStateToProps, {
  actionSetCollapsedSideMenu,
  actionLogout,
})(SideMenuBar)
