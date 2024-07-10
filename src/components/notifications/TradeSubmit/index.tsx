/**
 * This modal is shown only when trade was accepted by backend
 * Allows to cancel trade in some period of time
 */

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import TradeSubmittedError from './TradeSubmittedError'
import TradeSubmittedPositionClosed from './TradeSubmittedPositionClosed'
import {
  actionCloseNotification,
  INotification,
  NotificationTypes,
} from '../../../actions/notifications'
import {
  ITradeNotificationErrorProps,
  ITradeNotificationSuccessProps,
  PnlNotificationProps,
} from './interfaces'
import TradeSubmittedSuccess from './TradeSubmittedSuccess'
import TradeSubmittedSellback from './TradeSubmittedSellback'

interface ITradeSubmitProps {
  notifications: INotification<
    | ITradeNotificationSuccessProps
    | PnlNotificationProps
    | ITradeNotificationErrorProps
  >[]

  actionCloseNotification: (id: number) => void
}

/**
 * Data layer with effect
 * @param notifications
 * @param actionCloseNotification
 */
const useNotification = (
  notifications: any[],
  actionCloseNotification: any
) => {
  const [current, setCurrent] = useState<any | null>(null)
  /**
   * Each time array changes we pick NEW current notification
   */
  useEffect(() => {
    const [currentNotification] = notifications
    if (currentNotification) {
      if (current?.id !== currentNotification.id) {
        setCurrent(currentNotification)
      }
    } else {
      setCurrent(null)
    }
  }, [notifications])
  /**
   * When we pick new notification, start timer
   */
  useEffect(() => {
    if (current) {
      let timer1 = setTimeout(
        () => actionCloseNotification(current.id),
        current.type === NotificationTypes.TRADE_SUBMITTED_POSITION_CLOSED
          ? 5000
          : 3000
      )
      return () => {
        clearTimeout(timer1)
      }
    }
  }, [current])

  return {
    current,
  }
}

/**
 * Render layer
 * @param props
 * @constructor
 */
const TradeSubmitModal = (props: ITradeSubmitProps) => {
  const { current } = useNotification(
    props.notifications,
    props.actionCloseNotification
  )

  if (!current) {
    return null
  }

  switch (current.type) {
    case NotificationTypes.TRADE_SUBMITTED_ERROR:
      return <TradeSubmittedError notification={current} />
    case NotificationTypes.TRADE_SUBMITTED_SUCCESS:
      return <TradeSubmittedSuccess notification={current} />
    case NotificationTypes.TRADE_SUBMITTED_SELLBACK:
      return <TradeSubmittedSellback notification={current} />
    case NotificationTypes.TRADE_SUBMITTED_POSITION_CLOSED:
      return <TradeSubmittedPositionClosed notification={current} />
    default:
      return null
  }
}

const mapStateToProps = (state: any) => ({
  notifications: state.notifications.notifications,
})

export default connect(mapStateToProps, { actionCloseNotification })(
  TradeSubmitModal
)
