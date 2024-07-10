/**
 * Floating tooltip which shows information about bonus wallet
 */
import React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'

const BonusWalletPanel = styled.div<{ colors: any }>`
	display: block;
	z-index: 41;
	position: absolute;
	top: 64px;
	left: -232px;
	width: 228px;
	padding: 10px;
	border-radius: 2px;
	box-sizing: border-box;
	font-size: 12px;
	letter-spacing: 0.01px;
	box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
	background-color: ${(props) => props.colors.modalBackground};
`
const LinePanel = styled.div`
	display: flex;
	height: 17px;
	line-height: 17px;
`
const Title = styled.p`
	margin: 0 0 0 0;
	color: #646e79;
`
const Spacer = styled.div`
	flex: 1 1 auto;
	opacity: 0.5;
	border-bottom: dotted 1px #979797;
	padding-left: 5px;
	padding-right: 5px;
	margin-bottom: 2px;
`
const Value = styled.span<{ colors: any }>`
	text-align: right;
	color: ${(props) => props.colors.primaryText};
`
interface IBonusWalletInfoProps {
	colors: any
	bonus: any
	formatCurrency: (input: any) => any
}

/**
 * Single line component
 * @param param0
 */
const Line = ({ name, value, colors }: any) => (
	<LinePanel>
		<Title>{name}</Title>
		<Spacer />
		<Value colors={colors}>{value}</Value>
	</LinePanel>
)

const BonusWalletInfo = ({
	colors,
	bonus,
	formatCurrency,
}: IBonusWalletInfoProps) => (
	<BonusWalletPanel colors={colors}>
		<Line
			name={t`Available bonus`}
			colors={colors}
			value={formatCurrency(bonus.activeAmount)}
		/>
		<Line
			name={t`Released bonus`}
			colors={colors}
			value={formatCurrency(bonus.releasedAmount)}
		/>
		<Line
			name={t`Original bonus`}
			colors={colors}
			value={formatCurrency(bonus.originalAmount)}
		/>
		<Line
			name={t`Volume traded`}
			colors={colors}
			value={formatCurrency(bonus.volumeTraded)}
		/>
		<Line
			name={t`Volume required`}
			colors={colors}
			value={formatCurrency(bonus.volumeRequired)}
		/>
	</BonusWalletPanel>
)

export default BonusWalletInfo
