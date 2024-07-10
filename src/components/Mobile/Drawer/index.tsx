/**
 * Implements a side menu which opens from App.tsx
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { IRegistry, IUserInfo } from '../../../core/API'
import { actionShowModal, ModalTypes } from '../../../actions/modal'
import {
  Panel,
  TopBar,
  CloseBtn,
  MenuItems,
  MenuItem,
  CurrentLanguage,
  LanguageListWrapper,
  AccountPanel,
} from './styled'
import { actionGuestDemoRequest, actionLogout } from '../../../actions/account'
import UserStorage from '../../../core/UserStorage'
import Backdrop from '../../Backdrop'
import { LanguageList } from '../../ui/LanguageList'
import { isLoggedIn } from '../../selectors/loggedIn'
import Avatar from './Avatar'
import { IPlatformMenu } from '../../../reducers/container'
import DrawerMenu from './drawerMenu'
import SoundSwitch from '../../ChartContainer/Chart/SoundSwitch'
import Bronze from '../../Header/AccountLevel/bronze'
import Silver from '../../Header/AccountLevel/silver'
import Platinum from '../../Header/AccountLevel/platinum'
import Vip from '../../Header/AccountLevel/vip'
import Gold from '../../Header/AccountLevel/gold'
import Basic from '../../Header/AccountLevel/basic'
import { OpenAccountButton } from '../../Header/styled'
import { isArray } from 'lodash'
import { getTranslatedTitle } from '../../helper'

interface IDrawerProps {
  data: IRegistry
  userInfo: IUserInfo
  actionShowModal: any
  onClose: () => void
  actionGuestDemoRequest: () => void
  actionLogout: (flag: boolean) => void
  colors: any
  loggedIn: boolean
  sideMenuItems: IPlatformMenu[]
  setShowMenuContent: (link: string) => void
  showConfetti: boolean
}

export interface IMenuItem {
  icon: string // "account_balance"
  isExternal: boolean
  label: string // "tm_Dashboard"
  url: string // "https://bpw-staging2.tradesmarter.com/en#!/dashboard"
  link: string
}

export interface ILanguagePickerProps {
  langs: any
  lang: any
  colors: any
}

export const MenuItemsLabels: any = {
  tm_Dashboard: t`Dashboard`,
  tm_Account_Settings: t`Settings`,
  tm_Deposit: t`Deposit`,
  tm_Withdrawal: t`Withdrawal`,
  tm_Transfer_Funds: t`Transfer Funds`,
  tm_Add_Account: t`Add Account`,
  tm_Privacy_Center: t`Privacy Center`,
  tm_Transactions: t`Transactions`,
}

const guestDemoItems = (onLogin: any, onRegister: any) => (
  <MenuItems>
    {/* <MenuItem onClick={onLogin}>{t`Login`}</MenuItem> */}
    {/* <MenuItem onClick={onRegister}>{t`Sign up`}</MenuItem> */}
  </MenuItems>
)

const loggedOutMenu = (
  onLogin: any,
  onRegister: any,
  allowDemo: boolean,
  onDemo: any,
  data: IRegistry,
  colors: any,
  actionShowModal: any
) => {
  const { partnerConfig } = data
  const { openAccountButton } = partnerConfig

  const openAccountBtn = isArray(openAccountButton)
    ? openAccountButton[0]
    : openAccountButton

  const onOpenAccountModal = () => actionShowModal(ModalTypes.OPEN_ACCOUNT)

  return (
    <>
      {openAccountBtn?.show && (
        <OpenAccountButton
          colors={colors}
          isMobile={true}
          onClick={onOpenAccountModal}
        >
          {openAccountBtn?.label
            ? getTranslatedTitle(openAccountBtn?.label)
            : t`Open Account`}
        </OpenAccountButton>
      )}
      <MenuItems>
        {/* <MenuItem onClick={onLogin}>{t`Login`}</MenuItem> */}
        {/* <MenuItem onClick={onRegister}>{t`Sign up`}</MenuItem> */}
        {allowDemo && <MenuItem onClick={onDemo}>{t`Guest demo`}</MenuItem>}
      </MenuItems>
    </>
  )
}

const LanguagePicker = (props: ILanguagePickerProps) => {
  const [picker, setPicker] = useState<boolean>(false)
  const lang = UserStorage.getLanguage() || props.lang
  const title = props.langs[lang]?.name

  return (
    <>
      <CurrentLanguage onClick={() => setPicker(true)} colors={props.colors}>
        {title}
        <img
          src={`${process.env.PUBLIC_URL}/static/icons/languages/${lang}.svg`}
          alt={`select a ${lang}`}
        />
      </CurrentLanguage>
      {picker && (
        <>
          <Backdrop onClick={() => setPicker(false)} />
          <LanguageListWrapper colors={props.colors} className="scrollable">
            <LanguageList
              langs={props.langs}
              onSelect={() => setPicker(false)}
            />
          </LanguageListWrapper>
        </>
      )}
    </>
  )
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

const Drawer = (props: IDrawerProps) => {
  const {
    colors,
    data,
    userInfo,
    loggedIn,
    onClose,
    actionShowModal,
    actionGuestDemoRequest,
    setShowMenuContent,
    showConfetti,
  } = props

  const { partnerConfig } = data
  const { registrationLink, allowDemo } = partnerConfig

  const onLogin = () => actionShowModal(ModalTypes.SESSION_EXPIRED, {})
  const onRegister = () => {
    window.location.href = registrationLink
  }
  const onDemo = () => actionGuestDemoRequest()

  const menuItems = userInfo ? (
    userInfo.isDemo ? (
      guestDemoItems(onLogin, onRegister)
    ) : (
      <DrawerMenu setShowMenuContent={setShowMenuContent} />
    )
  ) : (
    loggedOutMenu(
      onLogin,
      onRegister,
      allowDemo,
      onDemo,
      data,
      colors,
      actionShowModal
    )
  )

  return (
    <Panel colors={colors}>
      <TopBar colors={colors}>
        <div className="language-container">
          <CloseBtn onClick={onClose} />
          {/* {loggedIn && showConfetti && (
            <div className="sound-switch-container">
              <SoundSwitch />
            </div>
          )} */}
          <LanguagePicker langs={data.langs} lang={data.lang} colors={colors} />
        </div>
        {loggedIn && (
          <div className="user-container">
            <AccountPanel colors={colors} onClick={() => {}}>
              <div className="avatar-container">
                <Avatar
                  isMobile={true}
                  src={userInfo?.userImage}
                  acronym={
                    `${userInfo?.firstName[0]} ${userInfo?.lastName[0]}`
                      .match(/\b(\w)/g)
                      ?.join('') as string
                  }
                />
                {/* <div className="account_level">
                  {AccountLevel(userInfo.accountLevel)}
                </div> */}
              </div>
              <div className="user-info-container">
                <span>{`${userInfo?.firstName}`}</span>
                <span>{`${userInfo?.email}`}</span>
                <span>{`${t`User ID`}: ${userInfo?.userID}`}</span>
              </div>
            </AccountPanel>
            <div className="user-account-level">
              {loggedIn && showConfetti && (
                <div className="sound-switch-container">
                  <SoundSwitch />
                </div>
              )}
            </div>
          </div>
        )}
      </TopBar>
      {menuItems}
    </Panel>
  )
}

const mapStateToProps = (state: any) => ({
  data: state.registry.data,
  userInfo: state.account.userInfo,
  colors: state.theme,
  loggedIn: isLoggedIn(state),
  sideMenuItems: state.container.sideMenuItems,
  showConfetti: state.registry.data.partnerConfig.showConfetti,
})

export default connect(mapStateToProps, {
  actionShowModal,
  actionGuestDemoRequest,
  actionLogout,
})(Drawer)
