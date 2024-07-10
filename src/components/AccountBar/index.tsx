/**
 * Implements a bar under the header with user data:
 * connected status, practice-real switch, balance, invested, equity, p&l, available, profit bonus
 * AccountBar > TextGroup > Caption ^ Value
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { formatCurrency } from '../selectors/currency'
import { actionPracticeMode } from '../../actions/account'
import { actionSelectBonusWalletRemote } from '../../actions/trading'
import ProgressPercents from './ProgressPercents'
import { AccountBarContainer, TextGroup, Oval, Value, Caption } from './styled'
import Backdrop from '../Backdrop'
import BonusWalletPicker from './BonusWalletPicker'
import Knob from './Knob'
import { ThemeContextConsumer } from '../ThemeContext'
import BonusWalletInfo from './BonusWalletPicker/BonusWalletInfo'

export const BONUS_NAMES: any = {
	'bonus-name-Balance Bonus': t`Balance Bonus`,
	'bonus-name-Smart Bonus': t`Smart Bonus`,
	'bonus-name-Pending Bonus': t`Pending Bonus`,
	'bonus-name-Profit Bonus': t`Profit Bonus`,
	'bonus-name-Sticky Bonus': t`Sticky Bonus`,
	'bonus-name-No Deposit Bonus': t`No Deposit Bonus`,
}

interface IAccountBarProps {
	wallets: null | any
	bonusWallet: any
	practiceMode: boolean
	hidePracticeButton: boolean
	hideBonusWallet: boolean
	allowPracticeModeChange: boolean
	formatCurrency: (input: number) => string
	actionSelectBonusWalletRemote: (wallet: any) => void
	actionPracticeMode: (mode: boolean) => void
}
const AccountBar = (props: IAccountBarProps) => {
	const [walletsPicker, setWalletsPicker] = useState(false)
	const [bonusDetails, setBonusDetails] = useState({
		visible: false,
		bonus: null,
	})

	if (!props.wallets) {
		return null
	}

	const {
		formatCurrency,
		hidePracticeButton,
		practiceMode,
		bonusWallet,
		allowPracticeModeChange,
		hideBonusWallet,
	} = props

	const {
		availableCash,
		availableBonus,
		reserved,
		bonusesInfo,
	} = props.wallets

	// Apply the same value as we do in mobile header
	const balance = props.wallets.availableCash + props.wallets.availableBonus

	/**
	 * Hide picker & select wallet
	 * @param bWallet
	 */
	const onSelectBonusWallet = (bWallet: any) => {
		setWalletsPicker(false)
		props.actionSelectBonusWalletRemote(bWallet)
	}
	/**
	 * Allow changing practice mode only if this is available in user info
	 */
	const onPracticeChange = () => {
		if (allowPracticeModeChange) {
			props.actionPracticeMode(!practiceMode)
		}
	}

	/**
	 * When customer hover on bonus inside modal
	 * @param mouseEvent
	 * @param bonus
	 */
	const onBonusHover = (mouseEvent: any, bonus: any) =>
		setBonusDetails({
			bonus,
			visible: true,
		})

	const onWalletsPickerClose = () => {
		setWalletsPicker(false)
		setBonusDetails((bDetails) => ({ ...bDetails, visible: false }))
	}

	return (
		<ThemeContextConsumer>
			{(colors: any) => (
				<AccountBarContainer colors={colors}>
					<TextGroup>
						<Oval colors={colors} />
						<Caption colors={colors}>{t`Connected`}</Caption>
					</TextGroup>
					{!hidePracticeButton && (
						<TextGroup>
							<Caption
								active={practiceMode}
								colors={colors}
							>{t`Practice`}</Caption>
							<Value colors={colors}>
								<div
									style={{
										position: 'relative',
										top: 4,
										display: 'inline-block',
										textTransform: 'uppercase',
									}}
								>
									<Knob
										backgroundColor={
											allowPracticeModeChange
												? colors.primary
												: colors.secondaryText
										}
										pinColor={colors.primaryText}
										knobOnLeft={practiceMode}
										onChange={onPracticeChange}
									/>
								</div>
								<div
									style={{
										marginLeft: 10,
										fontSize: '11px',
										display: 'inline-block',
										color: practiceMode
											? colors.secondaryText
											: colors.primary,
									}}
								>
									{t`REAL`}
								</div>
							</Value>
						</TextGroup>
					)}
					<TextGroup>
						<Caption colors={colors}>{t`Balance`}:</Caption>
						<Value colors={colors} primary={true}>
							{formatCurrency(balance)}
						</Value>
					</TextGroup>
					<TextGroup>
						<Caption colors={colors}>{t`Invested`}:</Caption>
						<Value colors={colors}>
							{formatCurrency(reserved)}
						</Value>
					</TextGroup>
					<TextGroup>
						<Caption colors={colors}>{t`Available cash`}:</Caption>
						<Value colors={colors} primary={true}>
							{formatCurrency(availableCash)}
						</Value>
					</TextGroup>
					{!hideBonusWallet && (
						<TextGroup>
							<Caption colors={colors}>
								{t`Available bonus`}:
							</Caption>
							<Value colors={colors}>
								{formatCurrency(availableBonus)}
							</Value>
						</TextGroup>
					)}
					{bonusWallet && (
						<TextGroup>
							<Caption colors={colors}>
								{BONUS_NAMES[bonusWallet.name]}:
							</Caption>
							<Value colors={colors} className="cursor-hand">
								<ProgressPercents
									colors={colors}
									value={
										bonusWallet.volumeTraded /
										bonusWallet.volumeRequired
									}
									onClick={() => setWalletsPicker(true)}
								/>
							</Value>
							{walletsPicker && (
								<>
									<Backdrop onClick={onWalletsPickerClose} />
									<BonusWalletPicker
										formatCurrency={formatCurrency}
										bonusWallet={bonusWallet}
										bonusesInfo={bonusesInfo}
										onSelect={onSelectBonusWallet}
										onHover={onBonusHover}
										colors={colors}
									/>
									{bonusDetails.visible && (
										<BonusWalletInfo
											formatCurrency={formatCurrency}
											bonus={bonusDetails.bonus}
											colors={colors}
										/>
									)}
								</>
							)}
						</TextGroup>
					)}
				</AccountBarContainer>
			)}
		</ThemeContextConsumer>
	)
}

const mapStateToProps = (state: any) => ({
	wallets: state.wallets,
	bonusWallet: state.trading.bonusWallet,
	practiceMode: state.account.userInfo?.practiceMode,
	hidePracticeButton: state.registry.data.partnerConfig.hidePracticeButton,
	hideBonusWallet: state.registry.data.partnerConfig.hideBonusWallet,
	allowPracticeModeChange: state.account.userInfo?.allowPracticeModeChange,
	formatCurrency: formatCurrency(state),
})

export default connect(mapStateToProps, {
	actionPracticeMode,
	actionSelectBonusWalletRemote,
})(AccountBar)
