import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  Modal,
  Contents,
  Caption,
  closeIconStyles,
  SubmitButton,
  ButtonGroup,
  TextButton,
  LoginStatusNotification,
} from './styled'
import {
  actionCloseModal,
  ModalTypes,
  actionShowModal,
} from '../../../actions/modal'
import { actionSignInRequest } from '../../../actions/account'
import { Overlay } from '@react-md/overlay'
import { ReactComponent as CloseIcon } from '../close.svg'
import FieldGroup from './FieldGroup'

/**
 * Set of validators for modal input
 * @param value - string
 * @param klass - validator type
 * @param touched - is input touched
 */
export const isValid = (
  value: string,
  klass: string,
  touched: boolean
): boolean => {
  if (!touched) {
    return true
  }
  switch (klass) {
    case 'email':
      return value.length > 1 && value.includes('@') && value.includes('.')
    case 'password':
      return value.length > 1
    default:
      return true
  }
}

interface ISignInModalProps {
  authenticating: boolean
  hideForgotPassword: boolean
  forgotPasswordLink: string
  registrationLink: string // could be a false boolean
  hideRegistrationLink: boolean // true when registrationLink is false
  colors: any
  actionCloseModal: () => void
  actionSignInRequest: (email: string, password: string) => void
  actionShowModal: (mt: ModalTypes, props?: any) => void
  errorMessage: string
  successMessage: string
}

const SignInModal = (props: ISignInModalProps) => {
  const {
    registrationLink,
    hideRegistrationLink,
    colors,
    successMessage,
    errorMessage,
  } = props
  const [email, onEmailChange] = useState<string>('')
  const [password, onPasswordChange] = useState<string>('')
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false)
  const [emailTouched, setEmailTouched] = useState<boolean>(false)

  const emailValid = isValid(email, 'email', emailTouched)
  const passwordValid = isValid(password, 'password', passwordTouched)

  const isLoading = props.authenticating
  const isDisabled =
    props.authenticating ||
    email.length < 1 ||
    password.length < 1 ||
    !emailValid ||
    !passwordValid

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (!isLoading && !isDisabled) {
      props.actionSignInRequest(email, password)
    }
  }

  const onForgotPassword = (e: any) => {
    e.preventDefault()
    props.actionShowModal(ModalTypes.PASSWORD_RESET)
  }

  const onCreateAccount = (e: any) => {
    e.preventDefault()
    window.location.assign(registrationLink)
  }

  return (
    <>
      <Modal>
        <Contents backgroundColor={colors.modalBackground} onSubmit={onSubmit}>
          <Caption
            marginTop={0}
            marginBottom={35}
            color={colors.primaryText}
          >{t`Login`}</Caption>
          <CloseIcon style={closeIconStyles} onClick={props.actionCloseModal} />
          <FieldGroup
            theme={colors}
            klass="email"
            label={t`Email address`}
            validationText={t`Please enter valid email address`}
            placeholder={t`Enter your email address`}
            onChange={onEmailChange}
            onTouched={() => setEmailTouched(true)}
            valid={emailValid}
            value={email}
          />
          <FieldGroup
            theme={colors}
            klass="password"
            label={t`Password`}
            validationText={t`Please enter your password`}
            placeholder={t`Enter your password`}
            onChange={onPasswordChange}
            onTouched={() => setPasswordTouched(true)}
            valid={passwordValid}
            value={password}
          />
          <ButtonGroup>
            {!props.hideForgotPassword && (
              <TextButton
                id="account_forgot"
                onClick={onForgotPassword}
                colors={colors}
              >
                {t`Forgot password?`}
              </TextButton>
            )}
            {!hideRegistrationLink && (
              <TextButton
                id="account_create"
                onClick={onCreateAccount}
                colors={colors}
              >
                {t`Create account`}
              </TextButton>
            )}
          </ButtonGroup>
          <SubmitButton
            width={100}
            onClick={onSubmit}
            disabled={isDisabled}
            colors={colors}
          >
            {isLoading ? t`Signing in...` : t`Login`}
          </SubmitButton>
          {(errorMessage || successMessage) && (
            <LoginStatusNotification colors={colors} isError={!!errorMessage}>
              {errorMessage || successMessage}
            </LoginStatusNotification>
          )}
        </Contents>
      </Modal>
      <Overlay
        id="modal-overlay"
        visible={true}
        onRequestClose={props.actionCloseModal}
        style={{ zIndex: 40 }}
      />
    </>
  )
}
const mapStateToProps = (state: any) => ({
  authenticating: state.account.authenticating,
  hideForgotPassword: state.registry.data.hideForgotPassword,
  forgotPasswordLink: state.registry.data.loginConfig.forgotPasswordLink,
  registrationLink: state.registry.data.partnerConfig.registrationLink,
  hideRegistrationLink:
    state.registry.data.partnerConfig.registrationLink === false,
  colors: state.theme,
  errorMessage: state.account.errorMessage,
  successMessage: state.account.successMessage,
})

export default connect(mapStateToProps, {
  actionCloseModal,
  actionSignInRequest,
  actionShowModal,
})(SignInModal)
