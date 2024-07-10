/**
 * Main trading component which allows to submit order:
 * Naming:
 * dead period before expiry
 * timeleft: time left before dead period
 * payout is potential profit
 * gameTypes 1,2 & long term (7,8)
 * for each gameType:
 * round - seconds backwards to game start
 * expiry - seconds forward to game expiry
 * deadPeriod - seconds before expiry where we can't bet
 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  actionHoverDirection,
  actionSetDirection,
  actionSubmitTrade,
} from '../../actions/trading'
import ExpirySelect from './ExpirySelect'
import AmountField from './AmountField'
// import MarketPrice from './MarketPrice'
import * as DirectionPanel from './DirectionPanels'
import { IGame } from '../../reducers/games'
import {
  firstOpenCfdInstrument,
  lastPriceForSelectedInstrument,
  practiceModeBinary,
} from '../selectors/instruments'
import {
  IInvestmentLimits,
  IRegistry,
  ITradeOperationsConfig,
} from '../../core/API'
import { isLoggedIn } from '../selectors/loggedIn'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { actionSelectGame } from '../../actions/game'
import { actionAddMessage } from '../../actions/messages'
import { getDefaultStake } from '../../core/getDefaultStake'
import {
  CreateTradeButton,
  PayoutLabel,
  PayoutValue,
  TradeButtonPlaceHolder,
  Wrapper,
} from './styled'
import {
  formatCurrency,
  getCurrencyPrecision,
  getWalletCurrencySymbol,
} from '../selectors/currency'
import TradeSubmitModal from '../notifications/TradeSubmit'
import InfoIcon from './info.svg'
import PayoutInformationBox from './PayoutInformationBox'
import { OneClickTradeBox } from './OneclickTradeBox'
import UserStorage from '../../core/UserStorage'
import ProductTypePanel from './ProductTypePanel'
import {
  isAboveBelowProductType,
  isCfdOptionsProductType,
} from '../selectors/trading'
import CfdOptionsTradeBox from './CfdOptionsTradeBox'
import { ProductType } from '../../reducers/trading'
import {
  actionSetProductType,
  actionSelectInstrument,
} from '../../actions/trading'
import { actionSelectNextExpiry } from '../../actions/game'
import moment from 'moment'
import ThemedIcon from '../ui/ThemedIcon'
import useSound from 'use-sound'
import sound from '../notifications/TradeSubmit/sound.mp3'

interface Position {
  left: number
  top: number
}

interface ITradeBoxNewProps {
  isMobile: boolean
  colors: any
  currencySymbol: string
  precision: number
  direction: number
  wallet: any
  registry: IRegistry
  loggedIn: boolean
  tradeOperationsConfig: ITradeOperationsConfig
  practiceMode: number
  instrumentID: string | null
  formatCurrency: (value: number) => string
  payout: number
  lastPrice: any
  game: IGame | null // selected game
  games: any
  inTradingHours: boolean
  gameEnteredDeadPeriod: boolean
  tradeSubmittedNotification: boolean
  actionSelectGame: (game: IGame) => void
  actionSubmitTrade: (trade: any) => void
  actionShowModal: (modalType: ModalTypes, args: any) => void
  actionSetDirection: (direction: number) => void
  actionSelectInstrument: (id: any) => void
  actionHoverDirection: (direction: number) => void
  actionAddMessage: (message: string) => void
  sendingTrade: boolean
  oneClickTrade: boolean
  isCfdProductType: boolean
  hideBonusWallet: boolean
  partnerConfig: any
  enabledPlatformTypes: any
  onKeyboardOpened: (val: boolean) => void
  selectedProductType: ProductType
  productTypes: ProductType[]
  actionSetProductType: (type: ProductType) => void
  firstOpenCfdInstrument: string
  isFirstTimeOpenWeb: boolean
  actionSelectNextExpiry: () => void
  isAboveBelow: boolean
  distances: any
  controlWords: any
  showConfetti: boolean
}

const getStakeLimitsByGameType = (
  gameType: number,
  investmentLimits: IInvestmentLimits
) => {
  const gameTypeToDefaultStake: any = {
    1: ['defaultStake', 'minStake', 'maxStake'],
    2: ['defaultStake60sec', 'minStake60sec', 'maxStake60sec'],
    3: ['defaultStakeStrategic', 'minStakeStrategic', 'maxStakeStrategic'],
    11: ['defaultStakeLongTerm', 'minStakeLongTerm', 'maxStakeLongTerm'],
    12: ['defaultStakeOptionsCfd', 'minStakeOptionsCfd', 'maxStakeOptionsCfd'],
  }

  const [defaultStake, minStake, maxStake] = (gameTypeToDefaultStake as any)[
    gameType
  ]

  return {
    defaultStake: Number(
      investmentLimits[defaultStake as keyof IInvestmentLimits]
    ),
    minStake: Number(investmentLimits[minStake as keyof IInvestmentLimits]),
    maxStake: Number(investmentLimits[maxStake as keyof IInvestmentLimits]),
  }
}

const TradeBoxNew = (props: ITradeBoxNewProps) => {
  const {
    direction,
    payout,
    loggedIn,
    game,
    games,
    colors,
    inTradingHours,
    instrumentID,
    practiceMode,
    registry,
    formatCurrency,
    precision,
    gameEnteredDeadPeriod,
    isMobile,
    tradeSubmittedNotification,
    sendingTrade,
    isCfdProductType,
    productTypes,
    isFirstTimeOpenWeb,
    actionSetProductType,
    actionSetDirection,
    actionSelectInstrument,
    isAboveBelow,
    distances,
    controlWords,
    showConfetti,
  } = props

  const [playSound] = useSound(sound, { playbackRate: 1.5, interrupt: true })

  const [limitStakeByGameType, setLimitStakeByGameType] = useState<any>(
    getStakeLimitsByGameType(game?.gameType || 2, registry.investmentLimits)
  )

  useEffect(() => {
    const { defaultStake, minStake, maxStake } = getStakeLimitsByGameType(
      game?.gameType || 2,
      registry.investmentLimits
    )
    if (amountChanged) {
      if (amount < minStake) {
        setAmount(minStake)
      } else if (amount > maxStake) {
        setAmount(maxStake)
      }
    } else {
      setAmount(defaultStake)
      setAmountChanged(false)
    }
    setLimitStakeByGameType({ defaultStake, minStake, maxStake })
  }, [game])

  const [amount, setAmount] = useState<string | number>(
    limitStakeByGameType.defaultStake
  )
  const [amountChanged, setAmountChanged] = useState(false)
  const [payoutInformationBox, setPayoutInformation] = useState<boolean>(false)
  const [keyboard, setKeyboard] = useState<boolean>(false)

  const potentialProfit = payout ? (Number(amount) * payout) / 100.0 : 0.0
  const tradePossible = inTradingHours && !gameEnteredDeadPeriod // not dead period and not timeout,
  const createTradeCaption = tradePossible
    ? t`Trade`
    : t`Trading is not available`

  const [oneClickTrade, setOneClickTrade] = useState(
    UserStorage.getOneClickTrade() ?? isMobile ? true : props.oneClickTrade
  )
  const canTrade = oneClickTrade
    ? !sendingTrade
    : tradePossible && !sendingTrade // possible, but no direction selected
  const canTradeButton = canTrade && direction !== 0

  /**
   * Don't update default amount when we have changed amount
   * That is how pro4 works
   */
  useEffect(() => {
    const { partnerConfig } = registry
    const { optionsDefaultPlatform } = partnerConfig
    if (optionsDefaultPlatform === 'options_cfd' && isFirstTimeOpenWeb) {
      actionSetProductType(ProductType.cfdOptions)
      actionSetDirection(0)
      if (inTradingHours) {
        actionSelectInstrument(firstOpenCfdInstrument)
      }
    }
  }, [])

  useEffect(() => {
    if (isAboveBelow && game?.isAboveBelow && gameEnteredDeadPeriod)
      actionSelectNextExpiry()
  }, [isAboveBelow, game, gameEnteredDeadPeriod])

  const onSignIn = (e: any) => {
    e.preventDefault()
    props.actionShowModal(ModalTypes.SESSION_EXPIRED, {})
  }

  const onSubmitTrade = (e: any) => {
    e.preventDefault()
    if (canTradeButton) {
      const params = {
        type: game?.gameType,
        userCurrencyStake: amount,
        userCurrency: 1,
        instrumentID,
        direction, // high, low todo: check -1
        distance: 0, // for 3,4,5,6 gameTypes
        gameType: game?.gameType,
        practice: practiceMode,
        rebate: game?.rebate || 0,
        strike: props.lastPrice,
        payout, // potential profit in %
        stake: amount, // amount
        expiry: Number(game?.timestamp),
        source: 'Simple-Trader',
        wow: true,
        openPanel: !isMobile,
      }
      if (isAboveBelow) {
        if (game?.isAboveBelow) {
          const distance = distances.find((d: any) =>
            moment(d.timestamp).isSame(moment(game.timestamp))
          )
          params.distance = distance?.distance || 0
        } else {
          return
        }
      }
      showConfetti && playSound()
      props.actionSubmitTrade(params)
    }
  }

  const onChangeAmount = (value: number | string) => {
    setAmount(value)
    if (!amountChanged) {
      setAmountChanged(true)
    }
  }

  /**
   * Create a trade from high/low button
   * @param targetDirection
   */
  const onSubmitOneClickTrade = (targetDirection: number) => {
    if (!loggedIn) {
      props.actionShowModal(ModalTypes.SESSION_EXPIRED, {})
    } else {
      if (tradePossible) {
        const params = {
          type: game?.gameType,
          userCurrencyStake: amount,
          userCurrency: 1,
          instrumentID,
          direction: targetDirection, // high, low todo: check -1
          distance: 0, // for 3,4,5,6 gameTypes
          gameType: game?.gameType,
          practice: practiceMode,
          rebate: game?.rebate || 0,
          strike: props.lastPrice,
          payout, // potential profit in %
          stake: amount, // amount
          expiry: Number(game?.timestamp),
          source: 'Simple-Trader',
          wow: true,
          openPanel: !isMobile,
        }
        if (isAboveBelow) {
          if (game?.isAboveBelow) {
            const distance = distances.find((d: any) =>
              moment(d.timestamp).isSame(moment(game.timestamp))
            )
            params.distance = distance?.distance || 0
          } else {
            return
          }
        }
        showConfetti && playSound()
        props.actionSubmitTrade(params)
      } else {
        props.actionAddMessage('Could not create a trade')
      }
    }
  }

  const onChangeOneClickTrade = (state: boolean): void => {
    UserStorage.setOneClickTrade(state)
    setOneClickTrade(state)
    if (state) {
      props.actionSetDirection(0)
    }
  }

  const onTrade = (e: any) =>
    oneClickTrade ? onSubmitOneClickTrade(e) : props.actionSetDirection(e)

  const keyboardInput = (val: string) => {
    if (val === '.' && amount.toString().includes('.')) {
      return
    }
    const value: string | number =
      Number(val) !== -1
        ? String(amount) + String(val)
        : String(amount).slice(0, -1)
    onChangeAmount(value)
  }

  if (!isMobile && productTypes.length === 0) {
    return null
  }

  return isCfdProductType ? (
    <CfdOptionsTradeBox isMobile={isMobile} productTypes={productTypes} />
  ) : (
    <Wrapper isMobile={isMobile} colors={colors}>
      {!isMobile && (
        <ProductTypePanel productTypes={productTypes} colors={colors} />
      )}
      <PayoutLabel colors={colors} isMobile={isMobile}>
        <span>
          {t`Amount`}
          <ThemedIcon
            width={12}
            height={12}
            fill={colors.sidebarLabelText}
            stroke={colors.sidebarLabelText}
            src={InfoIcon}
          />
        </span>
      </PayoutLabel>
      <AmountField
        colors={colors}
        currencySymbol={props.currencySymbol}
        precision={precision}
        value={amount}
        isMobile={isMobile}
        minStake={limitStakeByGameType.minStake}
        defaultStake={limitStakeByGameType.defaultStake}
        maxStake={limitStakeByGameType.maxStake}
        onChange={onChangeAmount}
        isCfdOptions={false}
        loggedIn={loggedIn}
      />

      <PayoutLabel colors={colors} isMobile={isMobile}>
        <span>
          {t`Expiration`}
          <ThemedIcon
            width={12}
            height={12}
            fill={colors.sidebarLabelText}
            stroke={colors.sidebarLabelText}
            src={InfoIcon}
          />
        </span>
      </PayoutLabel>
      {game && (
        <ExpirySelect
          game={game}
          games={games}
          colors={colors}
          isMobile={isMobile}
          isCfdOptions={false}
          disabled={!inTradingHours}
          disableShortLong={true}
        />
      )}

      <PayoutLabel colors={colors} isMobile={isMobile}>
        <span>
          {t`Payout`}
          <span
            onMouseOver={() => !!payout && setPayoutInformation(true)}
            onMouseLeave={() => setPayoutInformation(false)}
          >
            <ThemedIcon
              width={12}
              height={12}
              fill={colors.sidebarLabelText}
              stroke={colors.sidebarLabelText}
              src={InfoIcon}
            />
          </span>
        </span>

        {payoutInformationBox && (
          <PayoutInformationBox
            colors={colors}
            payout={payout}
            amount={amount}
            potentialProfit={potentialProfit}
            formatCurrency={formatCurrency}
            onClose={() => setPayoutInformation(false)}
          />
        )}
      </PayoutLabel>

      <PayoutValue colors={colors}>{payout}%</PayoutValue>

      <DirectionPanel.High
        colors={colors}
        isMobile={isMobile}
        value={direction}
        payout={payout}
        disabled={!canTrade}
        onChange={onTrade}
        onHover={props.actionHoverDirection}
        isAboveBelow={isAboveBelow}
        controlWords={controlWords}
      />
      <DirectionPanel.Low
        colors={colors}
        isMobile={isMobile}
        value={direction}
        payout={payout}
        disabled={!canTrade}
        onChange={onTrade}
        onHover={props.actionHoverDirection}
        isAboveBelow={isAboveBelow}
        controlWords={controlWords}
      />

      {tradeSubmittedNotification && <TradeSubmitModal />}
      {!oneClickTrade ? (
        direction !== 0 ? (
          canTradeButton && (
            <CreateTradeButton
              colors={colors}
              disabled={!canTradeButton}
              onClick={loggedIn ? onSubmitTrade : onSignIn}
              isMobile={isMobile}
            >
              {createTradeCaption}
            </CreateTradeButton>
          )
        ) : (
          <TradeButtonPlaceHolder colors={colors} isMobile={isMobile}>
            {isAboveBelow ? t`tap above or below` : t`Tap high or low`}
          </TradeButtonPlaceHolder>
        )
      ) : null}
      <OneClickTradeBox
        isMobile={isMobile}
        active={oneClickTrade}
        colors={colors}
        onChange={onChangeOneClickTrade}
      />
    </Wrapper>
  )
}

const mapStateToProps = (state: any) => ({
  direction: state.trading.direction,
  wallet: state.wallets,
  registry: state.registry.data,
  colors: state.theme,
  loggedIn: isLoggedIn(state),
  game: state.game,
  games: state.games,
  instrumentID: state.trading.selected,
  selectedProductType: state.trading.selectedProductType,
  productTypes: state.trading.productTypes,
  gameEnteredDeadPeriod: state.trading.gameEnteredDeadPeriod,
  inTradingHours: state.trading.inTradingHours,
  payout: state.trading.currentPayout,
  practiceMode: practiceModeBinary(state),
  lastPrice: lastPriceForSelectedInstrument(state),
  tradeOperationsConfig: state.registry.data.tradeOperationsConfig,
  formatCurrency: formatCurrency(state),
  currencySymbol: getWalletCurrencySymbol(state),
  precision: getCurrencyPrecision(state),
  tradeSubmittedNotification: state.notifications.notifications.length > 0,
  sendingTrade: state.trading.sendingTrade,
  oneClickTrade: state.registry.data.partnerConfig.oneClickTrade,
  isCfdProductType: isCfdOptionsProductType(state),
  hideBonusWallet: state.registry.data.partnerConfig.hideBonusWallet,
  partnerConfig: state.registry.data.partnerConfig,
  enabledPlatformTypes: state.registry.data.enabledPlatformTypes,
  firstOpenCfdInstrument: firstOpenCfdInstrument(state)?.instrumentID,
  isFirstTimeOpenWeb: state.container.isFirstTimeOpenWeb,
  isAboveBelow: isAboveBelowProductType(state),
  distances: state.trading.distances,
  controlWords: state.registry.data.controlWords,
  showConfetti: state.container.showConfetti,
})

export default connect(mapStateToProps, {
  actionSubmitTrade,
  actionSelectGame,
  actionSetDirection,
  actionHoverDirection,
  actionShowModal,
  actionAddMessage,
  actionSetProductType,
  actionSelectInstrument,
  actionSelectNextExpiry,
})(TradeBoxNew)
