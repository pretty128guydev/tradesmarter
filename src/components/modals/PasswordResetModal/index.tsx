/**
 * Implements a password reset modal
 * State implemented without redux
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  Modal,
  Contents,
  Caption,
  FlexSubmitButton,
  ButtonGroup,
  TextButton,
  ContourButton,
  Paragraph,
  BlankSpace,
  BlankSpace30,
  VerticalSpacer,
} from '../SignInModal/styled'
import { actionCloseModal, ModalTypes } from '../../../actions/modal'
import { actionShowModal } from '../../../actions/modal'
import { Overlay } from '@react-md/overlay'
import FieldGroup from '../SignInModal/FieldGroup'
import { api } from '../../../core/createAPI'
import { CircularProgress } from 'react-md'
import { isValid } from '../SignInModal'

interface IPResetState {
  locked: boolean
  email: string
  success: boolean // if request succeded
  passwordTouched: boolean
}

interface IPResetProps {
  colors: any
  registrationLink: string
  actionCloseModal: () => void
  actionShowModal: (mt: ModalTypes, props?: any) => void
}

class PasswordResetModal extends Component<IPResetProps, IPResetState> {
  constructor(props: IPResetProps) {
    super(props)
    this.state = {
      locked: false,
      email: '',
      success: false,
      passwordTouched: false,
    }
  }
  /**
   * lock state, do request, release state
   */
  onSubmit = (e: any) => {
    if (!this.state.locked) {
      e.preventDefault()
      this.setState({ locked: true }, () => {
        api
          .resetPasswordAccount(this.state.email)
          .then((response: any) => {
            this.setState({
              success: response.success,
              locked: false,
            })
          })
          .catch((err: any) => {
            console.warn(err)
            this.setState({
              success: false,
              locked: false,
            })
          })
      })
    }
  }

  /**
   * Navigate to widgets
   */
  onCreateAccount = (e: any) => {
    e.preventDefault()
    window.location.assign(this.props.registrationLink)
  }

  /**
   * These are contents for empty state
   */
  onPromptContents = () => {
    return (
      <Contents
        backgroundColor={this.props.colors.modalBackground}
        onSubmit={this.onSubmit}
      >
        <Caption
          marginTop={25}
          marginBottom={0}
          color={this.props.colors.primaryText}
        >{t`Restore password`}</Caption>
        <Paragraph colors={this.props.colors}>
          {t`Please enter your email address and we will send you instruction on how to reset your password.`}
        </Paragraph>
        <FieldGroup
          theme={this.props.colors}
          klass="email"
          label={t`Email address`}
          validationText={t`Please enter valid email address`}
          placeholder={t`Enter your email address`}
          onTouched={() => this.setState({ passwordTouched: true })}
          onChange={(email: any) => this.setState({ email })}
          valid={isValid(this.state.email, 'email', this.state.passwordTouched)}
          value={this.state.email}
        />
        <ButtonGroup>
          <TextButton
            id="account_create"
            onClick={this.onCreateAccount}
            colors={this.props.colors}
          >
            {t`Create account`}
          </TextButton>
          <BlankSpace />
        </ButtonGroup>
        <VerticalSpacer />
        <ButtonGroup>
          <ContourButton
            id="cancel_button"
            onClick={this.props.actionCloseModal}
            colors={this.props.colors}
          >
            {t`Cancel`}
          </ContourButton>
          <BlankSpace30 />
          <FlexSubmitButton
            id="password_reset"
            width={50}
            disabled={
              !isValid(this.state.email, 'email', this.state.passwordTouched)
            }
            onClick={this.onSubmit}
            colors={this.props.colors}
          >
            {t`Submit`}
          </FlexSubmitButton>
        </ButtonGroup>
      </Contents>
    )
  }

  /**
   * Show loader
   */
  onLoadingContents = () => (
    <Contents
      backgroundColor={this.props.colors.modalBackground}
      onSubmit={this.onSubmit}
    >
      <Caption
        marginTop={25}
        marginBottom={0}
        color={this.props.colors.primaryText}
      >{t`Restore password`}</Caption>
      <CircularProgress id="account__loading" />
    </Contents>
  )

  /**
   * Show success contents
   */
  onSuccessContents = () => (
    <Contents
      backgroundColor={this.props.colors.modalBackground}
      onSubmit={this.props.actionCloseModal}
    >
      <Caption
        marginTop={25}
        marginBottom={0}
        color={this.props.colors.primaryText}
      >{t`Restore password`}</Caption>
      <Paragraph colors={this.props.colors}>
        {t`We have reset the password, please check the email`}
      </Paragraph>
      <VerticalSpacer />
      <ButtonGroup>
        <ContourButton
          id="cancel_button"
          colors={this.props.colors}
          onClick={this.props.actionCloseModal}
        >
          {t`Close`}
        </ContourButton>
      </ButtonGroup>
    </Contents>
  )

  render() {
    const { locked, success } = this.state
    return (
      <>
        <Modal>
          {!locked && !success && this.onPromptContents()}
          {locked && this.onLoadingContents()}
          {success && this.onSuccessContents()}
        </Modal>
        <Overlay
          id="modal-overlay"
          visible={true}
          onRequestClose={this.props.actionCloseModal}
          style={{ zIndex: 40 }}
        />
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  registrationLink: state.registry.data.partnerConfig.registrationLink,
  colors: state.theme,
})
export default connect(mapStateToProps, { actionCloseModal, actionShowModal })(
  PasswordResetModal
)
