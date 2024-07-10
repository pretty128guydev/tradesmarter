import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import useSound from 'use-sound'
import sound from './sound.mp3'
import { INotification } from '../../../actions/notifications'

interface ITradeSubmittedSuccess {
  showConfetti: boolean
  notification: INotification<any>
}

const TradeSubmittedSuccess = (props: ITradeSubmittedSuccess) => {
  const [playSound] = useSound(sound, { playbackRate: 1.5, interrupt: true })

  useEffect(() => {
    if (props.showConfetti) playSound()
  }, [props.showConfetti, playSound, props.notification])

  return <></>
}

const mapStateToProps = (state: any) => ({
  showConfetti: state.container.showConfetti,
})

export default connect(mapStateToProps, {})(TradeSubmittedSuccess)
