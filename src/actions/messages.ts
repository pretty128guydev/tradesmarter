import { action } from 'typesafe-actions'

const entity = 'messages'

const ADD_MESSAGE = `${entity}/ADD`
const CLEAR_MESSAGES = `${entity}/CLEAR`

const actionAddMessage = (message: string) => action(ADD_MESSAGE, message)
const actionClearMessages = () => action(CLEAR_MESSAGES)

export { ADD_MESSAGE, CLEAR_MESSAGES, actionAddMessage, actionClearMessages }
