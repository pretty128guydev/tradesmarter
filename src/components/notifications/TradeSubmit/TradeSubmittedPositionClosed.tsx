import React, { useEffect } from 'react'
import { TradeSubmittedPositionClosedModal } from './styled'
import { t } from 'ttag'
import { formatStringCurrency } from '../../selectors/currency'
import { connect } from 'react-redux'
import { SidebarState } from '../../../reducers/sidebar'
import { actionSetSidebar } from '../../../actions/sidebar'
import {
  actionCloseNotification,
  INotification,
} from '../../../actions/notifications'
import { PnlNotificationProps } from './interfaces'
import useSound from 'use-sound'
import sound from './sound.mp3'

interface ITradeSubmittedPositionClosed {
  isMobile: boolean
  colors: any
  actionCloseNotification: (id: number) => void
  formatCurrency: (input: any) => string
  notification: INotification<PnlNotificationProps>
  actionSetSidebar: (state: SidebarState, props: any) => void
  tradingPanelType: number
  showConfetti: boolean
}

const TradeSubmittedPositionClosed = (props: ITradeSubmittedPositionClosed) => {
  const [playSound] = useSound(sound, { playbackRate: 1.5, interrupt: true })

  useEffect(() => {
    if (props.showConfetti) playSound()
  }, [props.showConfetti, playSound, props.notification])

  const time = new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
  const message = t`${props.notification.props.amount} positions were closed at ${time}. Total profit `

  return (
    <TradeSubmittedPositionClosedModal
      colors={props.colors}
      isMobile={props.isMobile}
      tradingPanelType={props.tradingPanelType}
    >
      <div
        className="closeButton"
        onClick={() => props.actionCloseNotification(props.notification.id)}
      />
      <p>
        {message}
        <span className="profit">
          {props.formatCurrency(props.notification.props.profit.toFixed(2))}
        </span>
      </p>
      <div
        onClick={() =>
          props.actionSetSidebar(SidebarState.positions, { tab: 1 })
        }
      >{t`Go to the closed positions`}</div>
    </TradeSubmittedPositionClosedModal>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  formatCurrency: formatStringCurrency(state),
  isMobile: state.registry.isMobile,
  tradingPanelType: state.registry.data.partnerConfig.tradingPanelType,
  showConfetti: state.container.showConfetti,
})

export default connect(mapStateToProps, {
  actionCloseNotification,
  actionSetSidebar,
})(TradeSubmittedPositionClosed)
