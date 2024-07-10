/**
 * Display current payout for current game
 */
import React from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import { connect } from 'react-redux'

const PayoutPanel = styled.div`
	display: block;
	float: left;
	min-width: 45px;
	max-width: 60px;
	height: 38px;
	margin-left: 15px;
	margin-right: 19px;
	position: relative;
`
const PayoutText = styled.span<{ colors: any }>`
	display: block;
	height: 30px;
	line-height: 30px;
	text-align: center;
	font-size: 24px;
	font-weight: 500;
	color: ${(props) => props.colors.primary};
`
const PayoutCaption = styled.div<{ colors: any }>`
	display: block;
	margin-top: -13px;
	height: 14px;
	font-size: 12px;
	white-space: nowrap;
	color: ${(props) => props.colors.secondaryText};
`

interface ICurrentPayoutProps {
	colors: any
	payout: number
}
const CurrentPayout = (props: ICurrentPayoutProps) => {
	return (
		<PayoutPanel>
			<PayoutText colors={props.colors}>{props.payout}%</PayoutText>
			<PayoutCaption colors={props.colors}>{t`PAYOUT`}</PayoutCaption>
		</PayoutPanel>
	)
}
const mapStateToProps = (state: any) => ({
	payout: state.trading.currentPayout,
})

export default connect(mapStateToProps)(CurrentPayout)
