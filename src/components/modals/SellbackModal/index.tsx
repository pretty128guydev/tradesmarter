/**
 * Sellback Modal
 * receives position in props
 */
import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import { Overlay } from 'react-md'
import { actionDoSellback } from '../../../actions/trades'
import { actionCloseModal } from '../../../actions/modal'
import {
	ModalHolder,
	Line,
	SellbackButton,
	Caption,
	ReturnBlock,
	ButtonsBlock,
	Contents,
} from './styled'
import CircularProgress from '../../ChartContainer/Chart/Sentiment/CircularProgress'
import { formatCurrency } from '../../selectors/currency'
import CloseButton from '../../Sidebar/CloseBtn'
import { IOpenTrade } from '../../../core/interfaces/trades'

interface ISellbackModalProps {
	x: number
	y: number
	timeleft: number
	amount: any
	trade: any | IOpenTrade
	colors: any
	formatCurrency: (value: any) => string
	actionDoSellback: (trade: IOpenTrade, amount: number) => void
	actionCloseModal: () => void
}

const SellbackModal = (props: ISellbackModalProps) => {
	const { colors } = props
	const [seconds, setSeconds] = useState(props.timeleft)

	/**
	 * Close modal when timer reaches 0
	 */
	if (seconds <= 0) {
		props.actionCloseModal()
	}

	/**
	 * Implements a timer that will start when component will be mounted
	 * returns a function that will stop a timer
	 */
	useEffect(() => {
		let interval = setInterval(() => {
			setSeconds((seconds) => seconds - 1)
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	const directionColor =
		props.trade.direction === 1
			? props.colors.primary
			: props.colors.secondary
	return (
		<>
			<ModalHolder x={props.x} y={props.y} colors={colors}>
				<Caption colors={colors}>{t`Sellback`}</Caption>
				<CloseButton
					top={0}
					onClick={() => props.actionCloseModal()}
					colors={colors}
				/>
				<Contents>
					<Line colors={colors}>
						<span>{t`ID`}</span>
						<div>{props.trade.tradeID}</div>
					</Line>
					<Line colors={colors}>
						<span>{t`Type`}</span>
						<b style={{ color: directionColor }}>
							{props.trade.direction === 1 ? t`High` : t`Low`}
						</b>
					</Line>
					<Line colors={colors}>
						<span>{t`Asset`}</span>
						<b>
							<img
								width="14"
								height="14"
								className="trade__instrument_icon"
								alt={`instrument ${props.trade.instrumentID}`}
								src={`${process.env.PUBLIC_URL}/static/icons/instruments/${props.trade.instrumentID}.svg`}
							/>
							&nbsp;
							{props.trade.instrumentName}
						</b>
					</Line>
					<Line colors={colors}>
						<span>{t`Spot Price`}</span>
						<b>{props.trade.strike}</b>
					</Line>
					<ReturnBlock colors={colors}>
						<div>{t`Return`}</div>
						<span>
							{props.formatCurrency(parseFloat(props.amount))}
						</span>
					</ReturnBlock>
					<ButtonsBlock>
						<CircularProgress
							value={(seconds / props.timeleft) * 100}
							filledColor={props.colors.secondary}
							normalColor="transparent"
							size={30}
							text={String(seconds)}
							textColor={props.colors.primaryText}
							thickness={1}
						/>
						<SellbackButton
							colors={props.colors}
							onClick={() =>
								props.actionDoSellback(
									props.trade,
									props.amount
								)
							}
						>
							{t`Confirm sellback`}
						</SellbackButton>
					</ButtonsBlock>
				</Contents>
			</ModalHolder>
			<Overlay
				id="modal-overlay"
				visible={true}
				onRequestClose={props.actionCloseModal}
				style={{ zIndex: 40 }}
			/>
		</>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	formatCurrency: formatCurrency(state),
})

export default connect(mapStateToProps, {
	actionDoSellback,
	actionCloseModal,
})(SellbackModal)
