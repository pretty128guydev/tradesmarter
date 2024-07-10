/**
 * Display current payout for current game
 * Copied from big version
 */
import React from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import { connect } from 'react-redux'

const PayoutPanel = styled.div`
  display: inline-flex;
  flex-direction: column;
  margin-left: 14px;
`
const PayoutText = styled.span<{ colors: any }>`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.colors.primary};
  line-height: 16px;
`
const PayoutCaption = styled.div<{ colors: any }>`
  font-size: 10px;
  color: ${(props) => props.colors.secondaryText};
  line-height: 16px;
`

interface ICurrentPayoutProps {
  colors: any
  payout: number
  styles?: object
}
const CurrentPayout = (props: ICurrentPayoutProps) => {
  return (
    <PayoutPanel style={props.styles || {}}>
      <PayoutText colors={props.colors}>{props.payout}%</PayoutText>
      {/* <PayoutCaption colors={props.colors}>{t`PAYOUT`}</PayoutCaption> */}
    </PayoutPanel>
  )
}
const mapStateToProps = (state: any) => ({
  payout: state.trading.currentPayout,
})

export default connect(mapStateToProps)(CurrentPayout)
