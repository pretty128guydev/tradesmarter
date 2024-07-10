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
import { MobileDrawers } from '../../../MobileApp'

interface IPracticeAccountModalProps {
  colors: any
  isMobile: boolean
  actionCloseModal: () => void
  partnerConfig: any
  setActive?: (value: MobileDrawers) => void
  actionSetShowMenuContentIFrame: ({
    show,
    link,
  }: {
    show: boolean
    link: string
  }) => void
}

const PracticeAccountModal = (props: IPracticeAccountModalProps) => {
  const {
    colors,
    isMobile,
    partnerConfig,
    actionCloseModal,
    actionSetShowMenuContentIFrame,
    setActive,
  } = props
  const { depositButton, depositLink } = partnerConfig
  const depositBtn = isArray(depositButton) ? depositButton[0] : depositButton

  return (
    <>
      <Modal isMobile={isMobile}>
        <Contents backgroundColor={colors.modalBackground}>
          <Caption
            color={colors.primaryText}
          >{t`This is your Practice account`}</Caption>
          <SubCaption color={colors.secondaryText}>
            {t`You are at a practice account make a deposit to operate in real account`}
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
              setActive && setActive(MobileDrawers.iframePanel)
              actionSetShowMenuContentIFrame({
                show: true,
                link: depositBtn?.link || depositLink,
              })
            }}
          >
            {isMobile &&
              console.log(`----mobile ${depositBtn?.link || depositLink}`)}
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
})(PracticeAccountModal)
