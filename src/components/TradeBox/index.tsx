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
import ExpirySelect from '../TradeBoxNew/ExpirySelect'
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
import {
  CreateTradeButton,
  Label,
  MobileDirectionPanels,
  Panel,
  PayoutLabel,
  TradeButtonPlaceHolder,
  Wrapper,
} from './styled'
import {
  formatCurrency,
  getCurrencyPrecision,
  getWalletCurrencySymbol,
} from '../selectors/currency'
// import TextInfoBlock from './TextInfoBlock'
import TradeSubmitModal from '../notifications/TradeSubmit'
import { ReactComponent as InfoIcon } from './info.svg'
import PayoutInformationBox from './PayoutInformationBox'
import InvestmentPresets from './InvestmentPresets'
import { OneClickTradeBox } from './OneclickTradeBox'
import UserStorage from '../../core/UserStorage'
import ProductTypePanel from './ProductTypePanel'
import ProductInfoPanel from './ProductInfoPanel'
import {
  isAboveBelowProductType,
  isCfdOptionsProductType,
} from '../selectors/trading'
import CfdOptionsTradeBox from './CfdOptionsTradeBox'
import BettingAmountField from './BettingAmountField'
import BettingKeyboard from './BettingKeyboard'
import { ProductType } from '../../reducers/trading'
import ReactTooltip from 'react-tooltip'
import MobilePayoutInformationBox from './MobilePayoutInformationBox'
import { isMobileLandscape } from '../../core/utils'
import {
  actionSetProductType,
  actionSelectInstrument,
} from '../../actions/trading'
import { actionSelectNextExpiry } from '../../actions/game'
import moment from 'moment'
import useSound from 'use-sound'
import sound from '../notifications/TradeSubmit/sound.mp3'
import ExpiriesSelect from '../TradeBoxNew/ExpiriesSelect'
import GroupOpenPositions from '../Sidebar/PositionsPanel/OpenPositions/GroupOpenPositions'
import Placeholder from '../Sidebar/PositionsPanel/Placeholder'
import ThemedIcon from '../ui/ThemedIcon'
import { MobileDrawers } from '../../MobileApp'
import { ITradesState } from '../../reducers/trades'
import { ExpiriesContainer } from '../TradeBoxNew/ExpiriesSelect/styled'

interface Position {
  left: number
  top: number
}

interface ITradeBoxProps {
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
  mobileTradeHeight?: number
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
  trades: ITradesState
  setActive: (value: MobileDrawers) => void
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

const TradeBox = (props: ITradeBoxProps) => {
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
    onKeyboardOpened,
    hideBonusWallet,
    productTypes,
    mobileTradeHeight,
    isFirstTimeOpenWeb,
    actionSetProductType,
    actionSetDirection,
    actionSelectInstrument,
    isAboveBelow,
    distances,
    controlWords,
    showConfetti,
    setActive,
    trades,
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
      if (Number(amount) < minStake) {
        setAmount(minStake)
      } else if (Number(amount) > maxStake) {
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

  const AmountFieldComponent =
    hideBonusWallet && isMobile ? BettingAmountField : AmountField

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

  const numberOfOpenPosition = props.trades.open.length

  if (!isMobile && productTypes.length === 0) {
    return null
  }

  return isCfdProductType ? (
    <CfdOptionsTradeBox
      isMobile={isMobile}
      productTypes={productTypes}
      setActive={() => {}}
    />
  ) : (
    <Wrapper isMobile={isMobile} colors={colors}>
      {!isMobile && (
        <ProductTypePanel productTypes={productTypes} colors={colors} />
      )}
      <Panel
        id="tradebox_panel"
        colors={colors}
        isMobile={isMobile}
        isCfdOptions={false}
      >
        {(!isMobile || isMobileLandscape(isMobile)) && (
          <ProductInfoPanel isCfdOptions={false} colors={colors} />
        )}
        {!isMobileLandscape(isMobile) && (
          <div className="tradebox_position">
            {/* {
                    numberOfOpenPosition == 0 && 
                    <Placeholder
                        color={props.colors.primaryText}
                        noOpen="tradebox"
                    />
                } */}
            <GroupOpenPositions
              isMobile={props.isMobile}
              noOpen={'tradebox'}
              setActive={() => setActive(MobileDrawers.positions)}
            />
          </div>
        )}
        <div className="amount_expiration">
          {!isMobileLandscape(isMobile) ? (
            <>
              <div className="my_expiration">
                {/* <ExpiriesSelect 
                        items={items}
                        colors={colors}
                        disabled={disabled}
                        selected={(game: IGame) => isSameGame(props.game, game)}
                        onSelect={(game: IGame) => onExpirySelect(game)}
                        getPositionsForExpiry={getPositionsForExpiry}
                        isMobile={isMobile}
                        isCfdOptions={isCfdOptions}
                    /> */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Label
                    top={isMobileLandscape(isMobile) ? 11 : isMobile ? 0 : 21}
                    colors={colors}
                  >{t`Expiration`}</Label>
                  <div className="infoIcon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="#8b9097"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#8b9097"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.66954 5.33691C9.44923 5.5459 9.18391 5.65039 8.87356 5.65039C8.56322 5.65039 8.29693 5.5459 8.07471 5.33691C7.85249 5.12793 7.74138 4.875 7.74138 4.57812C7.74138 4.28125 7.85249 4.02734 8.07471 3.81641C8.29693 3.60547 8.56322 3.5 8.87356 3.5C9.18391 3.5 9.44923 3.60547 9.66954 3.81641C9.88985 4.02734 10 4.28125 10 4.57812C10 4.875 9.88985 5.12793 9.66954 5.33691ZM8.84483 12.6084C8.61877 12.6885 8.35632 12.7285 8.05747 12.7285C7.5977 12.7285 7.24042 12.6143 6.98563 12.3857C6.73084 12.1572 6.60345 11.8672 6.60345 11.5156C6.60345 11.3789 6.61303 11.2393 6.63218 11.0967C6.65134 10.9541 6.68199 10.793 6.72414 10.6133L7.1954 8.90234C7.23755 8.73828 7.27299 8.58301 7.30172 8.43652C7.33046 8.29004 7.34483 8.15625 7.34483 8.03516C7.34483 7.81641 7.30077 7.66406 7.21264 7.57812C7.12452 7.49219 6.95594 7.44922 6.7069 7.44922C6.58429 7.44922 6.45881 7.46875 6.33046 7.50781C6.20211 7.54688 6.09195 7.58398 6 7.61914L6.12644 7.0918C6.43678 6.96289 6.73372 6.85254 7.01724 6.76074C7.30077 6.66895 7.56897 6.62305 7.82184 6.62305C8.27778 6.62305 8.62931 6.73535 8.87644 6.95996C9.12356 7.18457 9.24713 7.47656 9.24713 7.83594C9.24713 7.91016 9.23851 8.04102 9.22126 8.22852C9.20402 8.41602 9.17241 8.58789 9.12644 8.74414L8.65517 10.4492C8.61686 10.5859 8.58238 10.7422 8.55172 10.918C8.52107 11.0938 8.50575 11.2266 8.50575 11.3164C8.50575 11.543 8.55556 11.6973 8.65517 11.7793C8.75479 11.8613 8.9272 11.9023 9.17241 11.9023C9.28736 11.9023 9.41762 11.8818 9.56322 11.8408C9.70881 11.7998 9.81418 11.7637 9.87931 11.7324L9.75287 12.2598C9.37356 12.4121 9.07088 12.5283 8.84483 12.6084Z"
                        fill="current"
                        stroke="none"
                      ></path>
                      <circle
                        cx="8"
                        cy="8"
                        r="7.5"
                        stroke="current"
                        fill="none"
                      ></circle>
                    </svg>
                  </div>
                </div>
                {game && isMobile && (
                  <ExpirySelect
                    game={game}
                    games={games}
                    colors={colors}
                    isMobile={isMobile}
                    isCfdOptions={false}
                    disabled={!inTradingHours}
                    disableShortLong={true}
                    // mobileTradeHeight={mobileTradeHeight}
                  />
                )}
                {!isMobile && (
                  <>
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
                  </>
                )}
              </div>
              <div className="btamex"></div>
              <div className="my_amount">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Label
                    top={isMobileLandscape(isMobile) ? 11 : isMobile ? 0 : 21}
                    colors={colors}
                  >
                    {t`Amount`}
                  </Label>
                  <div className="infoIcon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="#8b9097"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#8b9097"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.66954 5.33691C9.44923 5.5459 9.18391 5.65039 8.87356 5.65039C8.56322 5.65039 8.29693 5.5459 8.07471 5.33691C7.85249 5.12793 7.74138 4.875 7.74138 4.57812C7.74138 4.28125 7.85249 4.02734 8.07471 3.81641C8.29693 3.60547 8.56322 3.5 8.87356 3.5C9.18391 3.5 9.44923 3.60547 9.66954 3.81641C9.88985 4.02734 10 4.28125 10 4.57812C10 4.875 9.88985 5.12793 9.66954 5.33691ZM8.84483 12.6084C8.61877 12.6885 8.35632 12.7285 8.05747 12.7285C7.5977 12.7285 7.24042 12.6143 6.98563 12.3857C6.73084 12.1572 6.60345 11.8672 6.60345 11.5156C6.60345 11.3789 6.61303 11.2393 6.63218 11.0967C6.65134 10.9541 6.68199 10.793 6.72414 10.6133L7.1954 8.90234C7.23755 8.73828 7.27299 8.58301 7.30172 8.43652C7.33046 8.29004 7.34483 8.15625 7.34483 8.03516C7.34483 7.81641 7.30077 7.66406 7.21264 7.57812C7.12452 7.49219 6.95594 7.44922 6.7069 7.44922C6.58429 7.44922 6.45881 7.46875 6.33046 7.50781C6.20211 7.54688 6.09195 7.58398 6 7.61914L6.12644 7.0918C6.43678 6.96289 6.73372 6.85254 7.01724 6.76074C7.30077 6.66895 7.56897 6.62305 7.82184 6.62305C8.27778 6.62305 8.62931 6.73535 8.87644 6.95996C9.12356 7.18457 9.24713 7.47656 9.24713 7.83594C9.24713 7.91016 9.23851 8.04102 9.22126 8.22852C9.20402 8.41602 9.17241 8.58789 9.12644 8.74414L8.65517 10.4492C8.61686 10.5859 8.58238 10.7422 8.55172 10.918C8.52107 11.0938 8.50575 11.2266 8.50575 11.3164C8.50575 11.543 8.55556 11.6973 8.65517 11.7793C8.75479 11.8613 8.9272 11.9023 9.17241 11.9023C9.28736 11.9023 9.41762 11.8818 9.56322 11.8408C9.70881 11.7998 9.81418 11.7637 9.87931 11.7324L9.75287 12.2598C9.37356 12.4121 9.07088 12.5283 8.84483 12.6084Z"
                        fill="current"
                        stroke="none"
                      ></path>
                      <circle
                        cx="8"
                        cy="8"
                        r="7.5"
                        stroke="current"
                        fill="none"
                      ></circle>
                    </svg>
                  </div>
                </div>
                {/* <PayoutLabel colors={colors} isMobile={isMobile}>
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
                    </PayoutLabel> */}
                <AmountFieldComponent
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
                  onClick={() => {
                    onKeyboardOpened(true)
                    setKeyboard(true)
                  }}
                />
                {hideBonusWallet && isMobile && keyboard && (
                  <BettingKeyboard
                    onInput={keyboardInput}
                    onClose={() => {
                      onKeyboardOpened(false)
                      setKeyboard(false)
                    }}
                    onTouch={onChangeAmount}
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="my_amount" style={{ marginTop: '5px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Label
                    top={isMobileLandscape(isMobile) ? 11 : isMobile ? 0 : 21}
                    colors={colors}
                  >
                    {t`Amount`}
                  </Label>
                  <div className="infoIcon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="#8b9097"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#8b9097"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.66954 5.33691C9.44923 5.5459 9.18391 5.65039 8.87356 5.65039C8.56322 5.65039 8.29693 5.5459 8.07471 5.33691C7.85249 5.12793 7.74138 4.875 7.74138 4.57812C7.74138 4.28125 7.85249 4.02734 8.07471 3.81641C8.29693 3.60547 8.56322 3.5 8.87356 3.5C9.18391 3.5 9.44923 3.60547 9.66954 3.81641C9.88985 4.02734 10 4.28125 10 4.57812C10 4.875 9.88985 5.12793 9.66954 5.33691ZM8.84483 12.6084C8.61877 12.6885 8.35632 12.7285 8.05747 12.7285C7.5977 12.7285 7.24042 12.6143 6.98563 12.3857C6.73084 12.1572 6.60345 11.8672 6.60345 11.5156C6.60345 11.3789 6.61303 11.2393 6.63218 11.0967C6.65134 10.9541 6.68199 10.793 6.72414 10.6133L7.1954 8.90234C7.23755 8.73828 7.27299 8.58301 7.30172 8.43652C7.33046 8.29004 7.34483 8.15625 7.34483 8.03516C7.34483 7.81641 7.30077 7.66406 7.21264 7.57812C7.12452 7.49219 6.95594 7.44922 6.7069 7.44922C6.58429 7.44922 6.45881 7.46875 6.33046 7.50781C6.20211 7.54688 6.09195 7.58398 6 7.61914L6.12644 7.0918C6.43678 6.96289 6.73372 6.85254 7.01724 6.76074C7.30077 6.66895 7.56897 6.62305 7.82184 6.62305C8.27778 6.62305 8.62931 6.73535 8.87644 6.95996C9.12356 7.18457 9.24713 7.47656 9.24713 7.83594C9.24713 7.91016 9.23851 8.04102 9.22126 8.22852C9.20402 8.41602 9.17241 8.58789 9.12644 8.74414L8.65517 10.4492C8.61686 10.5859 8.58238 10.7422 8.55172 10.918C8.52107 11.0938 8.50575 11.2266 8.50575 11.3164C8.50575 11.543 8.55556 11.6973 8.65517 11.7793C8.75479 11.8613 8.9272 11.9023 9.17241 11.9023C9.28736 11.9023 9.41762 11.8818 9.56322 11.8408C9.70881 11.7998 9.81418 11.7637 9.87931 11.7324L9.75287 12.2598C9.37356 12.4121 9.07088 12.5283 8.84483 12.6084Z"
                        fill="current"
                        stroke="none"
                      ></path>
                      <circle
                        cx="8"
                        cy="8"
                        r="7.5"
                        stroke="current"
                        fill="none"
                      ></circle>
                    </svg>
                  </div>
                </div>
                {/* <PayoutLabel colors={colors} isMobile={isMobile}>
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
                    </PayoutLabel> */}
                <AmountFieldComponent
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
                  onClick={() => {
                    onKeyboardOpened(true)
                    setKeyboard(true)
                  }}
                />
                {hideBonusWallet && isMobile && keyboard && (
                  <BettingKeyboard
                    onInput={keyboardInput}
                    onClose={() => {
                      onKeyboardOpened(false)
                      setKeyboard(false)
                    }}
                    onTouch={onChangeAmount}
                  />
                )}
              </div>
              <div className="my_expiration">
                {/* <ExpiriesSelect 
                        items={items}
                        colors={colors}
                        disabled={disabled}
                        selected={(game: IGame) => isSameGame(props.game, game)}
                        onSelect={(game: IGame) => onExpirySelect(game)}
                        getPositionsForExpiry={getPositionsForExpiry}
                        isMobile={isMobile}
                        isCfdOptions={isCfdOptions}
                    /> */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Label
                    top={isMobileLandscape(isMobile) ? 11 : isMobile ? 0 : 21}
                    colors={colors}
                  >{t`Expiration`}</Label>
                  <div className="infoIcon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="#8b9097"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#8b9097"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.66954 5.33691C9.44923 5.5459 9.18391 5.65039 8.87356 5.65039C8.56322 5.65039 8.29693 5.5459 8.07471 5.33691C7.85249 5.12793 7.74138 4.875 7.74138 4.57812C7.74138 4.28125 7.85249 4.02734 8.07471 3.81641C8.29693 3.60547 8.56322 3.5 8.87356 3.5C9.18391 3.5 9.44923 3.60547 9.66954 3.81641C9.88985 4.02734 10 4.28125 10 4.57812C10 4.875 9.88985 5.12793 9.66954 5.33691ZM8.84483 12.6084C8.61877 12.6885 8.35632 12.7285 8.05747 12.7285C7.5977 12.7285 7.24042 12.6143 6.98563 12.3857C6.73084 12.1572 6.60345 11.8672 6.60345 11.5156C6.60345 11.3789 6.61303 11.2393 6.63218 11.0967C6.65134 10.9541 6.68199 10.793 6.72414 10.6133L7.1954 8.90234C7.23755 8.73828 7.27299 8.58301 7.30172 8.43652C7.33046 8.29004 7.34483 8.15625 7.34483 8.03516C7.34483 7.81641 7.30077 7.66406 7.21264 7.57812C7.12452 7.49219 6.95594 7.44922 6.7069 7.44922C6.58429 7.44922 6.45881 7.46875 6.33046 7.50781C6.20211 7.54688 6.09195 7.58398 6 7.61914L6.12644 7.0918C6.43678 6.96289 6.73372 6.85254 7.01724 6.76074C7.30077 6.66895 7.56897 6.62305 7.82184 6.62305C8.27778 6.62305 8.62931 6.73535 8.87644 6.95996C9.12356 7.18457 9.24713 7.47656 9.24713 7.83594C9.24713 7.91016 9.23851 8.04102 9.22126 8.22852C9.20402 8.41602 9.17241 8.58789 9.12644 8.74414L8.65517 10.4492C8.61686 10.5859 8.58238 10.7422 8.55172 10.918C8.52107 11.0938 8.50575 11.2266 8.50575 11.3164C8.50575 11.543 8.55556 11.6973 8.65517 11.7793C8.75479 11.8613 8.9272 11.9023 9.17241 11.9023C9.28736 11.9023 9.41762 11.8818 9.56322 11.8408C9.70881 11.7998 9.81418 11.7637 9.87931 11.7324L9.75287 12.2598C9.37356 12.4121 9.07088 12.5283 8.84483 12.6084Z"
                        fill="current"
                        stroke="none"
                      ></path>
                      <circle
                        cx="8"
                        cy="8"
                        r="7.5"
                        stroke="current"
                        fill="none"
                      ></circle>
                    </svg>
                  </div>
                </div>
                {game && isMobile && (
                  <ExpirySelect
                    game={game}
                    games={games}
                    colors={colors}
                    isMobile={isMobile}
                    isCfdOptions={false}
                    disabled={!inTradingHours}
                    disableShortLong={true}
                    // mobileTradeHeight={mobileTradeHeight}
                  />
                )}
                {!isMobile && (
                  <>
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
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {/* {props.currencySymbol !== 'Ƀ' && (
          <InvestmentPresets
            maxValue={limitStakeByGameType.maxStake}
            curValue={Number(amount)}
            colors={colors}
            loggedIn={loggedIn}
            onClick={(value: number) => {
              setAmount(Number(amount) + value)
              if (!amountChanged) {
                setAmountChanged(true)
              }
            }}
          />
        )} */}
        {isMobile && (
          <MobileDirectionPanels isMobile={isMobile}>
            <DirectionPanel.Low
              colors={colors}
              isMobile={isMobile}
              value={direction}
              payout={payout}
              disabled={!canTrade}
              onChange={onTrade}
              onHover={() => {}}
              sendingTrade={sendingTrade}
              isAboveBelow={isAboveBelow}
              controlWords={controlWords}
            />
            <DirectionPanel.High
              colors={colors}
              isMobile={isMobile}
              value={direction}
              payout={payout}
              disabled={!canTrade}
              onChange={onTrade}
              onHover={() => {}}
              sendingTrade={sendingTrade}
              isAboveBelow={isAboveBelow}
              controlWords={controlWords}
            />
          </MobileDirectionPanels>
        )}

        {isMobileLandscape(isMobile) && (
          <div className="tradebox_position">
            {/* {
                    numberOfOpenPosition == 0 && 
                    <Placeholder
                        color={props.colors.primaryText}
                        noOpen="tradebox"
                    />
                } */}
            <GroupOpenPositions
              isMobile={props.isMobile}
              noOpen={'tradebox'}
              setActive={() => setActive(MobileDrawers.positions)}
            />
          </div>
        )}

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
        {/* <OneClickTradeBox
          isMobile={isMobile}
          active={oneClickTrade}
          colors={colors}
          onChange={onChangeOneClickTrade}
        /> */}

        {/* {isMobile && (
          <MobileInfoPanel
            game={props.game}
            colors={colors}
            lastPrice={props.lastPrice}
            potentialProfit={`+${formatCurrency(potentialProfit)}`}
          />
        )} */}
        {isMobile && isMobileLandscape(isMobile) && (
          <PayoutLabel colors={colors} isMobile={isMobile}>
            <span data-tip="" data-for="payout_information">
              <span>
                {t`Payout information`}
                <InfoIcon />
              </span>
              <ReactTooltip
                id="payout_information"
                className="react-tooltip-nopadding"
                overridePosition={(pos: Position) => {
                  return {
                    top: pos.top,
                    left: isMobileLandscape(isMobile)
                      ? window.innerWidth - 180
                      : (window.innerWidth - 260) / 2,
                  }
                }}
                clickable
              >
                <MobilePayoutInformationBox
                  colors={colors}
                  payout={payout}
                  amount={amount}
                  potentialProfit={potentialProfit}
                  formatCurrency={formatCurrency}
                />
              </ReactTooltip>
            </span>
          </PayoutLabel>
        )}
        {isMobile ? (
          // <PayoutLabel colors={colors} isMobile={isMobile}>
          //   <span data-tip="" data-for="payout_information">
          //     <span>
          //       {t`Payout information`}
          //       <InfoIcon />
          //     </span>
          //     <ReactTooltip
          //       id="payout_information"
          //       className="react-tooltip-nopadding"
          //       overridePosition={(pos: Position) => {
          //         return {
          //           top: pos.top,
          //           left: isMobileLandscape(isMobile)
          //             ? window.innerWidth - 180
          //             : (window.innerWidth - 260) / 2,
          //         }
          //       }}
          //       clickable
          //     >
          //       <MobilePayoutInformationBox
          //         colors={colors}
          //         payout={payout}
          //         amount={amount}
          //         potentialProfit={potentialProfit}
          //         formatCurrency={formatCurrency}
          //       />
          //     </ReactTooltip>
          //   </span>
          // </PayoutLabel>
          ''
        ) : (
          <PayoutLabel colors={colors} isMobile={isMobile}>
            <span
              onMouseOver={() => !!payout && setPayoutInformation(true)}
              onMouseLeave={() => setPayoutInformation(false)}
            >
              {t`Payout information`}
              <InfoIcon />
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
        )}
      </Panel>
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
  trades: state.trades,
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
})(TradeBox)
