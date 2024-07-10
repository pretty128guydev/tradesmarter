import React from 'react'
import { formatStringCurrency } from '../../selectors/currency'
import { connect } from 'react-redux'
import { TradeSubmittedModal } from './styled'
import { t } from 'ttag'
import {
  actionCloseNotification,
  INotification,
} from '../../../actions/notifications'
import { ITradeNotificationErrorProps } from './interfaces'

interface ITradeSubmittedErrorProps {
  isMobile: boolean
  colors: any
  notification: INotification<ITradeNotificationErrorProps>
  actionCloseNotification: (id: number) => void
  formatCurrency: (input: string) => string
  tradingPanelType: number
}

/**
 * Sanitize input: replace <br> to '\n'
 * @param input
 */
const sanitizeMessage = (input: string | undefined): string => {
  if (input) {
    return input.replace(/<br>/gi, '\n')
  }
  return ''
}

const TradeSubmittedError = (props: ITradeSubmittedErrorProps) => {
  const message = props.notification.props.message
    ? sanitizeMessage(props.notification.props.message)
    : props.notification.props.minStake
    ? `${t`Minimum investment amount`}: ${props.formatCurrency(
        String(props.notification.props.minStake)
      )}`
    : `${t`Maximum investment amount`}: ${props.formatCurrency(
        String(props.notification.props.maxStake)
      )}`

  return (
    <TradeSubmittedModal
      colors={props.colors}
      success={false}
      isMobile={props.isMobile}
      tradingPanelType={props.tradingPanelType}
    >
      <div
        className="closeButton"
        onClick={() => props.actionCloseNotification(props.notification.id)}
      />
      <span>{message}</span>
    </TradeSubmittedModal>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  formatCurrency: formatStringCurrency(state),
  isMobile: state.registry.isMobile,
  tradingPanelType: state.registry.data.partnerConfig.tradingPanelType,
})

export default connect(mapStateToProps, { actionCloseNotification })(
  TradeSubmittedError
)
