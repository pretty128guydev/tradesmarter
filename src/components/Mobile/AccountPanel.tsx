/**
 * Render account data or sign / sign up button
 * Calls a parent component when user wants to open menu
 */
import React from 'react'
import { connect } from 'react-redux'
import { CircularProgress } from '@react-md/progress'
import styled, { css } from 'styled-components'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { isLoggedIn } from '../selectors/loggedIn'
import { IUserInfo } from '../../core/API'
import Avatar from '../Header/Avatar'
import AvatarFallbackIcon from '../Header/avatar_fallback.svg'
import ThemedIcon from '../ui/ThemedIcon'
import { isMobileLandscape } from '../../core/utils'

const AccountPanel = styled.div<{ isMobile: boolean; isLoggedout?: boolean }>`
  ${(props) =>
    props.isMobile
      ? props.isLoggedout
        ? css`
            display: flex;
            flex: 1;
            justify-content: flex-end;
            line-height: 46px;
            height: 46px;
            @media (orientation: landscape) {
              flex: 0 0 40px;
              padding-right: 7px;
              line-height: 40px;
              height: 40px;
            }
          `
        : css`
            flex: 0 0 42px;
            line-height: 46px;
            height: 46px;
            @media (orientation: landscape) {
              flex: 0 0 40px;
              padding-right: 7px;
              line-height: 40px;
              height: 40px;
            }
          `
      : css`
          flex: 0 0 60px;
          padding-right: 10px;
          line-height: 64px;
          height: 64px;
        `}
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.12px;
  color: #e0e1e2;
  display: flex;

  span {
    flex: 1 1 auto;
    display: inline-block;
  }
  img {
    ${(props) =>
      props.isMobile
        ? css`
            flex: 0 0 40px;
            @media (orientation: landscape) {
              flex: 0 0 30px;
            }
          `
        : css`
            flex: 0 0 40px;
          `}
    display: inline-block;
    margin-left: 5px;
    vertical-align: middle;
  }
  .avatar_fallback {
    background: url(${AvatarFallbackIcon}) no-repeat center;
    background-size: 40px 40px;
  }

  .themed_icon {
    margin: 10px;
  }

  .avatar-mobile {
    @media (orientation: landscape) {
      width: 30px !important;
      height: 30px !important;
      margin-top: 5px !important;
    }
  }
`

interface IAccountProps {
  userInfo: IUserInfo | null
  isLoggedIn: Boolean
  isMobile: boolean
  actionShowModal: any
  onMenuClick: () => void
  colors: any
}
const Account = (props: IAccountProps) => {
  const { userInfo, colors } = props

  if (props.isLoggedIn) {
    if (userInfo) {
      const acronym = `${userInfo.firstName} ${userInfo.lastName}`
        .match(/\b(\w)/g)
        ?.join('')

      return (
        <AccountPanel
          isMobile={props.isMobile}
          onClick={props.onMenuClick}
          isLoggedout={!props.isLoggedIn}
        >
          <Avatar
            src={userInfo.userImage}
            isMobile={props.isMobile}
            acronym={acronym as string}
          />
        </AccountPanel>
      )
    }
    return (
      <AccountPanel isMobile={props.isMobile} isLoggedout={!props.isLoggedIn}>
        <CircularProgress id="account__loading" />
      </AccountPanel>
    )
  }

  const onSignInModal = () => props.actionShowModal(ModalTypes.SIGN_IN)
  return (
    <AccountPanel
      isMobile={props.isMobile}
      onClick={onSignInModal}
      isLoggedout={!props.isLoggedIn}
    >
      <ThemedIcon
        fill={colors.primary}
        width={30}
        height={30}
        type="avatar"
        src={`${process.env.PUBLIC_URL}/static/icons/avatar_fallback.svg`}
      />
    </AccountPanel>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  userInfo: state.account.userInfo,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, { actionShowModal })(Account)
