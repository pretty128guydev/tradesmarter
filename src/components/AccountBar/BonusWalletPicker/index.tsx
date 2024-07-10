/**
 * Implements a bonus wallet picker dropdown list
 * All this markup required to match design
 * Active item has a ball with ball inside
 */
import React from 'react'
import { t } from 'ttag'
import { ActiveProgress } from '../ProgressPercents'
import { BONUS_NAMES } from '../index'
import {
	ListPanel,
	Heading,
	BonusItem,
	BallContainer,
	BallActive,
	BallNormal,
	CaptionContainer,
	Caption,
	BarHolder,
} from './styled'

interface IBonusWalletPicker {
	colors: any
	formatCurrency: (value: number) => string
	bonusWallet: any
	bonusesInfo: any[]
	onSelect: (object: any) => void
	onHover: (mouseEvent: any, bonus: any) => void
}

const BonusWalletPicker = (props: IBonusWalletPicker) => (
	<ListPanel colors={props.colors}>
		<Heading colors={props.colors}>
			<div>{t`Available bonus`}</div>
			<span>{props.formatCurrency(props.bonusWallet.activeAmount)}</span>
		</Heading>
		{props.bonusesInfo.map((bonus: any) => (
			<BonusItem
				key={bonus.bonusID}
				onClick={() => props.onSelect(bonus)}
				onMouseEnter={(e: any) => props.onHover(e, bonus)}
				colors={props.colors}
			>
				<BallContainer>
					{bonus.bonusID === props.bonusWallet.bonusID ? (
						<BallActive colors={props.colors} />
					) : (
						<BallNormal colors={props.colors} />
					)}
				</BallContainer>
				<CaptionContainer>
					<Caption colors={props.colors}>
						{BONUS_NAMES[bonus.name]}{' '}
						{props.formatCurrency(bonus.originalAmount)}
					</Caption>
					<BarHolder colors={props.colors}>
						<ActiveProgress
							colors={props.colors}
							value={bonus.volumeTraded / bonus.volumeRequired}
						/>
					</BarHolder>
				</CaptionContainer>
			</BonusItem>
		))}
	</ListPanel>
)

export default BonusWalletPicker
