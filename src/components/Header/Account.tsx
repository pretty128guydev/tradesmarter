/**
 * Render account data or sign / sign up button
 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { t } from 'ttag'
import { CircularProgress } from '@react-md/progress'
import { actionLogout } from '../../actions/account'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { isLoggedIn } from '../selectors/loggedIn'
import { IUserInfo } from '../../core/API'
import Avatar from './Avatar'
import { ListContainer, ListItem } from '../ui/List'
import Backdrop from '../Backdrop'
import { IMenuItem, MenuItemsLabels } from '../Mobile/Drawer'
import { AccountPanel, LoginButton, OpenAccountButton } from './styled'
import { isArray } from 'lodash'
import { IPlatformMenu } from '../../reducers/container'
import { getTranslatedTitle } from '../helper'
import Dashboard_menuIcon from '../SideMenuBar/icons/dashoboard_menuIcon'
import SettingIcon from '../SideMenuBar/icons/settingicon'
import Logout_menuIcon from '../SideMenuBar/icons/logout_menu'
import WowTraderIcon from '../SideMenuBar/icons/wowtraderIcon'
import WithdrawalIcon from '../SideMenuBar/icons/withdrawalIcon'
import DepositIcon from '../SideMenuBar/icons/depositIcon'
import Bronze from './AccountLevel/bronze'
import Silver from './AccountLevel/silver'
import Platinum from './AccountLevel/platinum'
import Vip from './AccountLevel/vip'
import Gold from './AccountLevel/gold'
import Basic from './AccountLevel/basic'

interface IAccountProps {
  userInfo: IUserInfo | null
  isLoggedIn: Boolean
  actionShowModal: any
  partnerConfig: any
  colors: any
  actionLogout: (reload: boolean) => void
  push: (url: string) => void
  isMobile: boolean
  lang: string
  setShowOtherPlatform: ({
    show,
    link,
  }: {
    show: boolean
    link: string
  }) => void
  sideMenuItems: IPlatformMenu[]
}

const Account = (props: IAccountProps) => {
  const [menu, setMenu] = useState({ visible: false, top: 0, left: 0 })
  const {
    userInfo,
    partnerConfig,
    colors,
    setShowOtherPlatform,
    sideMenuItems,
  } = props
  const {
    customMenu,
    registrationLink,
    openAccountButton,
    depositButton,
    depositLink,
  } = partnerConfig
  const openAccountBtn = isArray(openAccountButton)
    ? openAccountButton[0]
    : openAccountButton
  const depositBtn = isArray(depositButton) ? depositButton[0] : depositButton
  const [translatedMenuItem, setTranslatedMenuItem] =
    useState<any>(MenuItemsLabels)

  const getTranslatedLabel = (label: string) => {
    switch (label) {
      case 'tm_Dashboard':
        return t`Dashboard`
      case 'tm_Account_Settings':
        return t`Settings`
      case 'tm_Deposit':
        return t`Deposit`
      case 'tm_Withdrawal':
        return t`Withdrawal`
      case 'tm_Transfer_Funds':
        return t`Transfer Funds`
      case 'tm_Add_Account':
        return t`Add Account`
      case 'tm_Privacy_Center':
        return t`Privacy Center`
      case 'tm_Transactions':
        return t`Transactions`
      default:
        return label
    }
  }

  useEffect(() => {
    let data: { [index: string]: any } = {}
    customMenu.forEach((c: any) => {
      const label = getTranslatedLabel(c.label)
      data[c.label] = label
    })
    setTranslatedMenuItem(data)
  }, [props.lang])

  const onToggleMenu = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMenu({
      visible: true,
      top: rect.bottom,
      left: rect.left,
    })
  }

  const AccountLevel = (key: number) => {
    switch (key) {
      case 0:
        return ''
      case 1:
        return <Basic />
      case 2:
        return <Bronze />
      case 3:
        return <Silver />
      case 4:
        return <Gold />
      case 5:
        return <Platinum />
      case 6:
        return <Vip />
    }
  }

  const onSignInModal = () => props.actionShowModal(ModalTypes.SIGN_IN)
  const onOpenAccountModal = () =>
    props.actionShowModal(ModalTypes.OPEN_ACCOUNT)

  if (props.isLoggedIn) {
    if (userInfo) {
      if (userInfo.isDemo) {
        return (
          <>
            <AccountPanel colors={colors} onClick={onToggleMenu}>
              <Avatar isMobile={props.isMobile} src={''} acronym={''} />
              <div className="arrow_down">▾</div>
            </AccountPanel>
            {menu.visible && (
              <>
                <Backdrop
                  onClick={() =>
                    setMenu({
                      visible: false,
                      top: 0,
                      left: 0,
                    })
                  }
                />
                <ListContainer
                  top={menu.top}
                  // left={menu.left}
                  right={20}
                  colors={colors}
                  className="scrollable"
                  isMobile={props.isMobile}
                >
                  <ListItem colors={colors}>
                    <span onClick={onSignInModal}>{t`Login`}</span>
                  </ListItem>
                  {openAccountBtn?.show && (
                    <ListItem colors={colors}>
                      <span
                        onClick={() =>
                          props.push(openAccountBtn?.link || registrationLink)
                        }
                      >
                        {openAccountBtn?.label
                          ? getTranslatedTitle(openAccountBtn?.label)
                          : t`Open Account`}
                      </span>
                    </ListItem>
                  )}
                </ListContainer>
              </>
            )}
          </>
        )
      }

      const { firstName, lastName, userImage } = userInfo

      const acronym = `${firstName} ${lastName}`.match(/\b(\w)/g)?.join('')

      const getIcon = (key: string) => {
        const { colors } = props

        switch (key) {
          case 'tm_Dashboard':
            return <Dashboard_menuIcon color={colors.primary} />
          case 'tm_Account_Settings':
            return <SettingIcon color={colors.primary} />
          case 'tm_Deposit':
            return <DepositIcon color={colors.primary} />
          case 'tm_Withdrawal':
            return <WithdrawalIcon color={colors.primary} />
          case 'WOW TRADER':
            return <WowTraderIcon color={colors.primary} />
          case 'logout':
            return <Logout_menuIcon color={colors.primary} />
        }
      }

      const clickAction = (menuItem: IMenuItem) => {
        if (menuItem.label === 'tm_Deposit') {
          setShowOtherPlatform({
            show: true,
            link: depositBtn.link || depositLink,
          })
        } else if (menuItem.label === 'WOW TRADER') {
          setShowOtherPlatform({
            show: true,
            link: menuItem.link,
          })
        } else {
          const translatedItem = translatedMenuItem[menuItem.label]
          let menu: any
          sideMenuItems.forEach((item: IPlatformMenu) => {
            const { subItems, label } = item
            const title = getTranslatedTitle(label)
            if (isArray(subItems) && subItems.length > 0) {
              subItems.forEach((subItem: IPlatformMenu) => {
                const { label } = subItem
                const title = getTranslatedTitle(label)
                if (translatedItem === title) {
                  menu = subItem
                  return
                }
              })
            } else {
              if (translatedItem === title) {
                menu = item
                return
              }
            }
          })
          if (menu && menu.link) {
            setShowOtherPlatform({
              show: true,
              link: menu.link,
            })
          } else {
            props.push(menuItem.url)
          }
        }
      }

      return (
        <>
          <AccountPanel colors={colors} onClick={onToggleMenu}>
            {/* <span>{firstName} {lastName}</span> */}
            <Avatar
              isMobile={props.isMobile}
              src={userImage}
              acronym={
                `${userInfo?.firstName[0]} ${userInfo?.lastName[0]}`
                  .match(/\b(\w)/g)
                  ?.join('') as string
              }
            />
            <div className="arrow_down">▾</div>
          </AccountPanel>
          {menu.visible && (
            <>
              <Backdrop
                zIndex={85}
                onClick={() => setMenu({ visible: false, top: 0, left: 0 })}
              />
              <ListContainer
                top={menu.top}
                // left={menu.left}
                right={20}
                zIndex={100}
                colors={colors}
                className="scrollable"
                isMobile={props.isMobile}
              >
                <div className="right-menu-user-info">
                  {/* <div>{AccountLevel(userInfo.accountLevel)}</div> */}
                  <div>{`${userInfo?.firstName}` + `${userInfo?.lastName}`}</div>
                  <div>{`${userInfo?.email}`}</div>
                  <div>{`${t`User ID`}: ${userInfo?.userID}`}</div>
                </div>
                <div className="menu-border"></div>
                {customMenu.map((menuItem: IMenuItem) => (
                  <ListItem key={menuItem.url} colors={colors}>
                    <span>{getIcon(menuItem.label)}</span>
                    <span onClick={() => clickAction(menuItem)}>
                      {translatedMenuItem[menuItem.label] || menuItem.label}    
                    </span>
                  </ListItem>
                ))}
                <ListItem
                  colors={colors}
                  onClick={() => props.actionLogout(true)}
                >
                  <span>{getIcon('logout')}</span>
                  <span>{t`Log out`}</span>
                </ListItem>
              </ListContainer>
            </>
          )}
        </>
      )
    }
    return (
      <AccountPanel colors={colors}>
        <CircularProgress id="account__loading" small={true} />
      </AccountPanel>
    )
  }

  return (
    <AccountPanel colors={colors}>
      <LoginButton colors={colors} onClick={onSignInModal}>
        {t`Login`}
      </LoginButton>
      {openAccountBtn?.show && (
        <OpenAccountButton colors={colors} onClick={onOpenAccountModal}>
          {openAccountBtn?.label
            ? getTranslatedTitle(openAccountBtn?.label)
            : t`Open Account`}
        </OpenAccountButton>
      )}
    </AccountPanel>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  userInfo: state.account.userInfo,
  partnerConfig: state.registry.data.partnerConfig,
  isMobile: state.registry.isMobile,
  lang: state.registry.data.lang,
  sideMenuItems: state.container.sideMenuItems,
})

export default connect(mapStateToProps, {
  actionShowModal,
  actionLogout,
  push,
})(Account)
