/**
 * React to practice expired event
 * Normally we should use accountSwitchRedirectUrl, but
 */
import React from 'react'
import { t } from 'ttag'
import { Overlay } from '@react-md/overlay'
import { connect } from 'react-redux'
import { Modal, Contents, Caption, SubmitButton, SubCaption } from './styled'
import { actionCloseModal } from '../../../actions/modal'
import { actionPracticeMode } from '../../../actions/account'
import { actionSetShowMenuContentIFrame } from '../../../actions/container'
import CloseButton from '../../SidebarNew/CloseBtn'
import { isArray } from 'lodash'

interface IMakeDepositModalProps {
  colors: any
  isMobile: boolean
  actionCloseModal: () => void
  partnerConfig: any
  actionSetShowMenuContentIFrame: ({
    show,
    link,
  }: {
    show: boolean
    link: string
  }) => void
}

const MakeDepositModal = (props: IMakeDepositModalProps) => {
  const {
    colors,
    isMobile,
    partnerConfig,
    actionCloseModal,
    actionSetShowMenuContentIFrame,
  } = props
  const { depositButton, depositLink } = partnerConfig
  const depositBtn = isArray(depositButton) ? depositButton[0] : depositButton

  return (
    <>
      <Modal isMobile={isMobile}>
        <Contents backgroundColor={colors.modalBackground}>
          <Caption
            color={colors.primaryText}
          >{t`This is your real account`}</Caption>
          <SubCaption color={colors.secondaryText}>
            {t`Add funds to your real account, so you can start making real profit on the market`}
          </SubCaption>
          <CloseButton
            colors={colors}
            onClick={actionCloseModal}
            top={20}
            right={20}
          />
          <SubmitButton
            colors={colors}
            onClick={() => {
              actionCloseModal()
              actionSetShowMenuContentIFrame({
                show: true,
                link: depositBtn?.link || depositLink,
              })
            }}
          >
            {t`Make a deposit`}
          </SubmitButton>
        </Contents>
      </Modal>
      <Overlay
        id="modal-overlay"
        visible={true}
        onRequestClose={actionCloseModal}
        style={{ zIndex: 40 }}
      />
    </>
  )
}

const mapStateToProps = (state: any) => ({
  partnerConfig: state.registry.data.partnerConfig,
  colors: state.theme,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionCloseModal,
  actionPracticeMode,
  actionSetShowMenuContentIFrame,
})(MakeDepositModal)
