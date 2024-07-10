/**
 * Actions for select/unselect expiry in sidebar
 */
import { action } from 'typesafe-actions'

const entity = 'expiry'

const SELECT_EXPIRY = `${entity}/SELECT`
const UNSET_EXPIRY = `${entity}/UNSET`
const REVIEW_EXPIRY = `${entity}/REVIEW`
const EXPIRY_TIME = `${entity}/EXPIRY_TIME`

const actionSelectExpiry = (expiry: number | null) =>
  action(SELECT_EXPIRY, expiry)

const actionSetExpiryTime = (html: string) => action(EXPIRY_TIME, html)

const actionDeselectExpiry = () => action(UNSET_EXPIRY)

const actionReviewExpiryForTrades = (ids: any) => action(REVIEW_EXPIRY, ids)

export {
  SELECT_EXPIRY,
  UNSET_EXPIRY,
  REVIEW_EXPIRY,
  EXPIRY_TIME,
  actionSetExpiryTime,
  actionSelectExpiry,
  actionDeselectExpiry,
  actionReviewExpiryForTrades,
}
