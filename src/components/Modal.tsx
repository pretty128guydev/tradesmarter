/**
 * Implements a conditional logic for rendering a modal depending on a redux modal state
 */
import React from 'react'
import { connect } from 'react-redux'
import { ModalTypes } from '../actions/modal'
import NetworkErrorModal from './modals/NetworkErrorModal'
import PracticeExpiredModal from './modals/PracticeExpiredModal'
import GuestDemoExpired from './modals/GuestDemoExpiredModal'
import SellbackModal from './modals/SellbackModal'
import SignInModal from './modals/SignInModal/index'
import ThemeConfigModal from './modals/ThemeModal'
import PasswordResetModal from './modals/PasswordResetModal'
import SessionExpired from './modals/SessionExpiredModal'
import ExpiriesModal from './modals/ExpiriesModal'
import KeyboardModal from './modals/KeyboardModal'
import OpenAccountModal from './modals/OpenAccountModal'
import SwitchToRealModal from './modals/SwitchToRealModal'
import EmailConfirmationModal from './modals/EmailConfirmation'
import MakeDepositModal from './modals/MakeDepositModal'
import PractiseAccountModal from './modals/PractiseAccountModal'
import { MobileDrawers } from '../MobileApp'

interface IModalHolderProps {
  modalType: ModalTypes
  props: any
  setActive?: (value: MobileDrawers) => void
}

const ModalHolder = ({ modalType, props, setActive }: IModalHolderProps) => {
  switch (modalType) {
    case ModalTypes.SIGN_IN:
      return <SignInModal />
    case ModalTypes.NETWORK_ERROR:
      return <NetworkErrorModal />
    case ModalTypes.PRACTICE_EXPIRED:
      return <PracticeExpiredModal />
    case ModalTypes.GUESTDEMO_EXPIRED:
      return <GuestDemoExpired {...props} />
    case ModalTypes.SESSION_EXPIRED:
      return <SessionExpired {...props} />
    case ModalTypes.SELLBACK:
      return <SellbackModal {...props} />
    case ModalTypes.THEME_CONFIG:
      return <ThemeConfigModal {...props} />
    case ModalTypes.PASSWORD_RESET:
      return <PasswordResetModal {...props} />
    case ModalTypes.EXPIRIES_MODAL:
      return <ExpiriesModal {...props} />
    case ModalTypes.KEYBOARD:
      return <KeyboardModal {...props} />
    case ModalTypes.OPEN_ACCOUNT:
      return <OpenAccountModal />
    case ModalTypes.SWITCH_TO_REAL:
      return <SwitchToRealModal />
    case ModalTypes.EMAIL_CONFIRMATION:
      return <EmailConfirmationModal />
    case ModalTypes.MAKE_DEPOSIT:
      return <MakeDepositModal />
    case ModalTypes.PRACTICE_ACCOUNT:
      return <PractiseAccountModal setActive={setActive || undefined} />
    default:
      return null
  }
}

const mapStateToProps = (state: any) => ({
  modalType: state.modal.modalName,
  props: state.modal.props,
})

export default connect(mapStateToProps, {})(ModalHolder)
