/**
 * React to practice expired event
 * Normally we should use accountSwitchRedirectUrl, but
 */
import React from 'react'
import { t } from 'ttag'
import { Overlay } from '@react-md/overlay'
import { connect } from 'react-redux'
import {
  Modal,
  Contents,
  Caption,
  // closeIconStyles,
  SubmitButton,
  SubCaption,
} from './styled'
import { actionCloseModal } from '../../../actions/modal'
import { actionPracticeMode } from '../../../actions/account'

interface IEmailConfirmationModalProps {
  colors: any
  isMobile: boolean
  actionPracticeMode: (state: boolean) => void
  actionCloseModal: () => void
}

const EmailConfirmationModal = (props: IEmailConfirmationModalProps) => {
  const { colors, isMobile, actionCloseModal } = props

  return (
    <>
      <Modal isMobile={isMobile}>
        <Contents backgroundColor={colors.modalBackground}>
          <Caption color={colors.primaryText}>{t`Email Confirmation`}</Caption>
          <SubCaption color={colors.secondaryText}>
            {t`Please complete your email address confirmation in order to secure your account and fund on it`}
          </SubCaption>
          <SubmitButton colors={colors} onClick={actionCloseModal}>
            {t`Confirm Your Email`}
          </SubmitButton>
        </Contents>
      </Modal>
      <Overlay
        id="modal-overlay"
        visible={true}
        onRequestClose={() => {}}
        style={{ zIndex: 40 }}
      />
    </>
  )
}

const mapStateToProps = (state: any) => ({
  registry: state.registry.data,
  colors: state.theme,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionCloseModal,
  actionPracticeMode,
})(EmailConfirmationModal)
