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
import CloseButton from '../../SidebarNew/CloseBtn'

interface ISwitchToRealModalProps {
  colors: any
  isMobile: boolean
  actionPracticeMode: (state: boolean) => void
  actionCloseModal: () => void
}

const SwitchToRealModal = (props: ISwitchToRealModalProps) => {
  const { colors, isMobile } = props

  return (
    <>
      <Modal isMobile={isMobile}>
        <Contents backgroundColor={colors.modalBackground}>
          <Caption
            color={colors.primaryText}
          >{t`Switch to real account`}</Caption>
          <SubCaption color={colors.secondaryText}>
            {t`Switch to real account, so you can start making real profit on the market`}
          </SubCaption>
          <CloseButton
            colors={colors}
            onClick={props.actionCloseModal}
            top={20}
            right={20}
          />
          <SubmitButton
            colors={colors}
            onClick={() => props.actionPracticeMode(false)}
          >
            {t`Switch to real`}
          </SubmitButton>
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
  registry: state.registry.data,
  colors: state.theme,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionCloseModal,
  actionPracticeMode,
})(SwitchToRealModal)
