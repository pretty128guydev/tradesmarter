import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getCurrentPayout } from '../../../../core/currentPayout'
import { InstrumentPayoutItem } from './styled'
import { IInstrument } from '../../../../core/API'
import { isAboveBelowProductType } from '../../../selectors/trading'

interface IInstrumentPayoutProps {
  gameType: number
  instrumentId: number
  instrument: IInstrument
  payoutDeltas: number
  maxClientPayouts: number
  color: any
  payoutState: number
  isAboveBelow: boolean
}

const InstrumentPayout = ({
  gameType,
  instrument,
  payoutDeltas,
  maxClientPayouts,
  color,
  isAboveBelow,
  payoutState,
}: IInstrumentPayoutProps) => {
  const [payout, setPayout] = useState<number | null>(null)

  const currentPayout = getCurrentPayout(
    gameType,
    instrument,
    payoutDeltas,
    maxClientPayouts
  )

  useEffect(() => {
    if (isAboveBelow) {
      setPayout(payoutState)
    } else {
      setPayout(currentPayout)
    }
  }, [currentPayout, isAboveBelow, payoutState])

  return payout ? (
    <InstrumentPayoutItem color={color}>{payout}%</InstrumentPayoutItem>
  ) : (
    <span>...</span>
  )
}

const mapStateToProps = (
  state: any,
  { instrumentId }: { instrumentId: number }
) => ({
  payoutDeltas: state.registry.data.payoutDeltas,
  maxClientPayouts: state.registry.data.maxClientPayouts,
  gameType: state.game?.gameType,
  instrument: state.instruments[instrumentId],
  isAboveBelow: isAboveBelowProductType(state),
  payoutState: state.trading.currentPayout,
})

export default connect(mapStateToProps)(InstrumentPayout)
