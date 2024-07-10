import { action } from 'typesafe-actions'

const entity = `modal`

export enum ModalTypes {
  SIGN_IN = 'SIGN_IN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PRACTICE_EXPIRED = 'PRACTICE_EXPIRED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SELLBACK = 'SELLBACK',
  THEME_CONFIG = 'THEME_CONFIG',
  GUESTDEMO_EXPIRED = 'GUESTDEMO_EXPIRED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EXPIRIES_MODAL = 'EXPIRIES_MODAL',
  KEYBOARD = 'KEYBOARD',
  OPEN_ACCOUNT = 'OPEN_ACCOUNT',
  SWITCH_TO_REAL = 'SWITCH_TO_REAL',
  EMAIL_CONFIRMATION = 'EMAIL_CONFIRMATION',
  MAKE_DEPOSIT = 'MAKE_DEPOSIT',
  PRACTICE_ACCOUNT = 'PRACTICE_ACCOUNT',
}

const SHOW = `${entity}/SHOW`
const HIDE = `${entity}/HIDE`

const actionShowModal = (modalName: ModalTypes, props: any) =>
  action(SHOW, { modalName, props })

const actionCloseModal = () => action(HIDE, {})

export { SHOW, HIDE, actionShowModal, actionCloseModal }
