import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { actionSelectGame } from '../../../actions/game'
import { actionAddMessage } from '../../../actions/messages'
import { actionShowModal, ModalTypes } from '../../../actions/modal'
import {
  actionSetCfdOptionsActiveDirection,
  actionSetCfdRiskAmount,
  actionSetDirection,
  actionSetSelectedCfdOptionExpiry,
  actionSubmitTrade,
} from '../../../actions/trading'
import {
  IInvestmentLimits,
  IRegistry,
  ITradeOperationsConfig,
} from '../../../core/API'
import UserStorage from '../../../core/UserStorage'
import { IGame } from '../../../reducers/games'
import { ProductType } from '../../../reducers/trading'
import TradeSubmitModal from '../../notifications/TradeSubmit'
import {
  formatCurrency,
  getCurrencyPrecision,
  getWalletCurrencySymbol,
} from '../../selectors/currency'
import {
  lastPriceForSelectedInstrument,
  practiceModeBinary,
} from '../../selectors/instruments'
import { isLoggedIn } from '../../selectors/loggedIn'
import AmountField from '../AmountField'
import ExpirySelect from '../../TradeBoxNew/ExpirySelect'
import InvestmentPresets from '../InvestmentPresets'
import MobileInfoPanel from '../MobileInfoPanel'
import { OneClickTradeBox } from '../OneclickTradeBox'
import ProductTypePanel from '../ProductTypePanel'
import {
  CreateTradeButton,
  Label,
  MobileDisableTradeTooltip,
  Panel,
  TradeButtonPlaceHolder,
  Wrapper,
} from '../styled'
import TextInfoBlock from '../TextInfoBlock'
import { ButtonsWrapper, ButtonTitle, ButtonWrapper } from './styled'
import { round, toNumber } from 'lodash'
import MobileExpirySelect from './MobileExpirySelect'
import { IOpenTrade } from '../../../core/interfaces/trades'
import ReactTooltip from 'react-tooltip'
import useSound from 'use-sound'
import sound from '../../notifications/TradeSubmit/sound.mp3'
import Placeholder from '../../Sidebar/PositionsPanel/Placeholder'
import GroupOpenPositions from '../../Sidebar/PositionsPanel/OpenPositions/GroupOpenPositions'
import { ITradesState } from '../../../reducers/trades'
import { MobileDrawers } from '../../../MobileApp'
import { isMobileLandscape } from '../../../core/utils'

enum OtionsCfdHedgeAlloweds {
  allow = '1',
  notAllow = '0',
}
interface ITradeBoxProps {
  isMobile: boolean
  colors: any
  currencySymbol: string
  minStake: number
  precision: number
  direction: number
  wallet: any
  registry: IRegistry
  loggedIn: boolean
  tradeOperationsConfig: ITradeOperationsConfig
  practiceMode: number
  instrumentID: number
  formatCurrency: (value: number) => string
  payout: number
  lastPrice: any
  game: IGame | null // selected game
  inTradingHours: boolean
  tradeSubmittedNotification: boolean
  actionSelectGame: (game: IGame) => void
  actionSubmitTrade: (trade: any) => void
  actionShowModal: (modalType: ModalTypes, args: any) => void
  actionSetDirection: (direction: number) => void
  actionAddMessage: (message: string) => void
  actionSetCfdOptionsActiveDirection: (direction: 1 | -1 | null) => void
  actionSetCfdRiskAmount: (amount: number) => void
  actionSetSelectedCfdOptionExpiry: any
  sendingTrade: boolean
  oneClickTrade: boolean
  cfdOptionsActiveDirection: 1 | -1 | null
  selectedCfdOptionInstrument: any
  selectedCfdOptionExpiry: any
  cfdRiskAmount: number
  productTypes: ProductType[]
  optionsCfdHedgeAllowed: OtionsCfdHedgeAlloweds
  openTrades: IOpenTrade[]
  controlWords: any
  showConfetti: boolean
  trades: ITradesState
  setActive: (value: MobileDrawers) => void
}

const getStakeLimitsByGameType = (investmentLimits: IInvestmentLimits) => {
  return {
    defaultStake: Number(
      investmentLimits['defaultStakeOptionsCfd' as keyof IInvestmentLimits]
    ),
    minStake: Number(
      investmentLimits['minStakeOptionsCfd' as keyof IInvestmentLimits]
    ),
    maxStake: Number(
      investmentLimits['maxStakeOptionsCfd' as keyof IInvestmentLimits]
    ),
  }
}

const TradeBox = (props: ITradeBoxProps) => {
  const {
    payout,
    loggedIn,
    direction,
    colors,
    inTradingHours,
    instrumentID,
    practiceMode,
    registry,
    precision,
    isMobile,
    tradeSubmittedNotification,
    sendingTrade,
    cfdOptionsActiveDirection,
    selectedCfdOptionInstrument,
    selectedCfdOptionExpiry,
    cfdRiskAmount,
    actionSetCfdRiskAmount,
    optionsCfdHedgeAllowed,
    openTrades,
    controlWords,
    showConfetti,
    setActive,
  } = props

  const [playSound] = useSound(sound, { playbackRate: 1.5, interrupt: true })

  // const [amountChanged, setAmountChanged] = useState(false)
  const [disableUp, setDisableUp] = useState(false)
  const [disableDown, setDisableDown] = useState(false)

  useEffect(() => {
    if (
      optionsCfdHedgeAllowed === OtionsCfdHedgeAlloweds.notAllow &&
      openTrades.length > 0
    ) {
      const instrumentTrades = openTrades.filter(
        (op) =>
          toNumber(op.instrumentID) === toNumber(instrumentID) &&
          (op.optionValue || 0) > 0
      )
      if (instrumentTrades.length > 0) {
        const direction = instrumentTrades[0].direction
        if (direction === 1) {
          setDisableDown(true)
          setDisableUp(false)
        } else {
          setDisableUp(true)
          setDisableDown(false)
        }
        return
      }
    }
    setDisableDown(false)
    setDisableUp(false)
  }, [optionsCfdHedgeAllowed, openTrades, instrumentID])

  const tradePossible = inTradingHours
  const createTradeCaption = tradePossible
    ? t`Trade`
    : t`Trading is not available`
  const { defaultStake, minStake, maxStake } = getStakeLimitsByGameType(
    registry.investmentLimits
  )

  const [oneClickTrade, setOneClickTrade] = useState(() => {
    const storeOneClickTrade = UserStorage.getOneClickTrade()
    if (storeOneClickTrade !== null) return storeOneClickTrade
    return props.isMobile ? true : props.oneClickTrade
  })

  const canTrade = oneClickTrade
    ? !sendingTrade
    : tradePossible && !sendingTrade // possible, but no direction selected
  const canTradeButton = canTrade && direction !== 0

  /**
   * Don't update default amount when we have changed amount
   * That is how pro4 works
   */
  // useEffect(() => {
  //   if (!amountChanged) {
  //     if (props.game && wallet) {
  //       const stake = getDefaultStake(12, registry, wallet)
  //       actionSetCfdRiskAmount(stake)
  //     }
  //   }
  // }, [instrumentID, props.game, wallet, registry, amountChanged])

  const onSignIn = (e: any) => {
    e.preventDefault()
    props.actionShowModal(ModalTypes.SESSION_EXPIRED, {})
  }

  const onSubmitTrade = (e: any) => {
    e.preventDefault()

    if (!loggedIn) {
      return props.actionShowModal(ModalTypes.SESSION_EXPIRED, {})
    }

    const option_prices = selectedCfdOptionInstrument[selectedCfdOptionExpiry]

    if (canTradeButton) {
      showConfetti && playSound()

      props.actionSubmitTrade({
        type: 12,
        userCurrencyStake: cfdRiskAmount,
        userCurrency: 1,
        instrumentID,
        direction, // high, low todo: check -1
        distance: 0, // for 3,4,5,6 gameTypes
        gameType: 12,
        practice: practiceMode,
        strike: props.lastPrice,
        payout, // potential profit in %
        stake: cfdRiskAmount, // amount
        expiry: option_prices.expiry,
        optionValue: option_prices.price,
        source: 'Simple-Trader',
        wow: true,
      })
    }
  }

  const onChangeAmount = (value: number) => {
    actionSetCfdRiskAmount(value)
    // if (!amountChanged) {
    //   setAmountChanged(true)
    // }
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
        showConfetti && playSound()

        const option_prices =
          selectedCfdOptionInstrument[selectedCfdOptionExpiry]
        props.actionSubmitTrade({
          type: 12,
          userCurrencyStake: cfdRiskAmount,
          userCurrency: 1,
          instrumentID,
          direction: targetDirection, // high, low todo: check -1
          distance: 0, // for 3,4,5,6 gameTypes
          gameType: 12,
          practice: practiceMode,
          strike: props.lastPrice,
          payout, // potential profit in %
          stake: cfdRiskAmount, // amount
          expiry: option_prices.expiry,
          optionValue: option_prices.price,
          source: 'Simple-Trader',
          wow: true,
          openPanel: !isMobile,
        })
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

  const onTrade = (direction: any) =>
    oneClickTrade
      ? onSubmitOneClickTrade(direction)
      : props.actionSetDirection(direction)

  const numberOfOpenPosition = props.trades.open.length

  const option_prices = selectedCfdOptionInstrument?.[selectedCfdOptionExpiry]
  const currentGame = {
    round: 0,
    expiry: 0,
    deadPeriod: 0,
    payout: '',
    rebate: '',
    gameType: 12,
    cdfExpiry: selectedCfdOptionExpiry,
    timestamp: option_prices?.expiry && new Date(option_prices.expiry),
    isCfdOptions: true,
    disabled: false,
  }

  return (
    <Wrapper isMobile={isMobile} colors={colors}>
      {!isMobile && (
        <ProductTypePanel colors={colors} productTypes={props.productTypes} />
      )}
      <Panel
        id="tradebox_panel"
        colors={colors}
        isMobile={isMobile}
        isCfdOptions={true}
      >
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
        {!isMobile && (
          <ExpirySelect
            game={currentGame}
            games={Object.keys(selectedCfdOptionInstrument ?? []).map(
              (key) => ({
                round: 0,
                expiry: 0,
                deadPeriod: 0,
                payout: '',
                rebate: '',
                gameType: 12,
                cdfExpiry: key,
                timestamp: selectedCfdOptionInstrument[key].expiry,
                isCfdOptions: true,
                disabled: false,
              })
            )}
            colors={colors}
            isMobile={isMobile}
            disableShortLong={true}
            disabled={!inTradingHours}
            isCfdOptions={true}
          />
        )}
        <div className="amount_expiration">
          {!isMobileLandscape(isMobile) ? (
            <>
              <div className="my_expiration">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Label top={2} colors={colors}>{t`Time Duration`}</Label>
                  <div>
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
                {isMobile && (
                  <ExpirySelect
                    noOpen={'tradebox'}
                    game={currentGame}
                    games={Object.keys(selectedCfdOptionInstrument ?? []).map(
                      (key) => ({
                        round: 0,
                        expiry: 0,
                        deadPeriod: 0,
                        payout: '',
                        rebate: '',
                        gameType: 12,
                        cdfExpiry: key,
                        timestamp: selectedCfdOptionInstrument[key].expiry,
                        isCfdOptions: true,
                        disabled: false,
                      })
                    )}
                    colors={colors}
                    isMobile={isMobile}
                    disableShortLong={true}
                    disabled={!inTradingHours}
                    isCfdOptions={true}
                  />
                )}
              </div>
              {/* {isMobile && (
                <MobileExpirySelect
                    colors={colors}
                    game={currentGame}
                    games={Object.keys(selectedCfdOptionInstrument ?? []).map(
                    (key) => ({
                        round: 0,
                        expiry: 0,
                        deadPeriod: 0,
                        payout: '',
                        rebate: '',
                        gameType: 12,
                        cdfExpiry: key,
                        timestamp: selectedCfdOptionInstrument[key].expiry,
                        isCfdOptions: true,
                        disabled: false,
                    })
                    )}
                    actionSetSelectedCfdOptionExpiry={
                    props.actionSetSelectedCfdOptionExpiry
                    }
                />
                )} */}
              <div className="btamex"></div>
              <div className="my_amount">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Label top={0} colors={colors}>{t`Amount`}</Label>
                  <div>
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
                <AmountField
                  isCfdOptions={true}
                  colors={colors}
                  currencySymbol={props.currencySymbol}
                  precision={precision}
                  value={cfdRiskAmount}
                  isMobile={isMobile}
                  minStake={minStake}
                  defaultStake={defaultStake}
                  maxStake={maxStake}
                  onChange={onChangeAmount}
                  loggedIn={loggedIn}
                />
              </div>
            </>
          ) : (
            <>
              <div className="my_amount" style={{ marginTop: '5px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Label top={0} colors={colors}>{t`Amount`}</Label>
                  <div>
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
                <AmountField
                  isCfdOptions={true}
                  colors={colors}
                  currencySymbol={props.currencySymbol}
                  precision={precision}
                  value={cfdRiskAmount}
                  isMobile={isMobile}
                  minStake={minStake}
                  defaultStake={defaultStake}
                  maxStake={maxStake}
                  onChange={onChangeAmount}
                  loggedIn={loggedIn}
                />
              </div>
              <div className="my_expiration">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Label top={2} colors={colors}>{t`Time Duration`}</Label>
                  <div>
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
                {isMobile && (
                  <ExpirySelect
                    noOpen={'tradebox'}
                    game={currentGame}
                    games={Object.keys(selectedCfdOptionInstrument ?? []).map(
                      (key) => ({
                        round: 0,
                        expiry: 0,
                        deadPeriod: 0,
                        payout: '',
                        rebate: '',
                        gameType: 12,
                        cdfExpiry: key,
                        timestamp: selectedCfdOptionInstrument[key].expiry,
                        isCfdOptions: true,
                        disabled: false,
                      })
                    )}
                    colors={colors}
                    isMobile={isMobile}
                    disableShortLong={true}
                    disabled={!inTradingHours}
                    isCfdOptions={true}
                  />
                )}
              </div>
            </>
          )}
        </div>
        {/* {props.currencySymbol !== 'Ƀ' && (
          <InvestmentPresets
            maxValue={maxStake}
            curValue={cfdRiskAmount}
            colors={colors}
            loggedIn={loggedIn}
            onClick={(value: number) =>
              actionSetCfdRiskAmount(cfdRiskAmount + value)
            }
          />
        )} */}
        {!isMobile && (
          <TextInfoBlock
            colors={colors}
            game={currentGame}
            disableStrikePrice={true}
            lastPrice={props.lastPrice}
          />
        )}
        {tradeSubmittedNotification && <TradeSubmitModal />}
        {!isMobile && (
          <ButtonsWrapper>
            <div
              data-tip=""
              data-for="high_trade_button_tooltip"
              style={{ flex: 1, marginRight: 5 }}
            >
              <ButtonWrapper
                direction={1}
                className={
                  cfdOptionsActiveDirection === 1 && !disableUp ? 'hover' : ''
                }
                colors={colors}
                activeButton={direction}
                onClick={() => onTrade(1)}
                onMouseEnter={() => props.actionSetCfdOptionsActiveDirection(1)}
                onMouseLeave={() =>
                  props.actionSetCfdOptionsActiveDirection(null)
                }
                disable={disableUp}
              >
                <ButtonTitle direction={1} colors={colors} isMobile={isMobile}>
                  <span className="dp__arrow">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 9 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 8L8 1" strokeLinecap="round" />
                      <path
                        d="M2 1H8V7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {controlWords['up'] || t`Up`}
                </ButtonTitle>
                <ReactTooltip id="high_trade_button_tooltip" place="bottom">
                  {disableUp
                    ? t`It is not allowed to make trades in the opposite direction while you have active open trades`
                    : ''}
                </ReactTooltip>
              </ButtonWrapper>
            </div>
            <div
              data-tip=""
              data-for="low_trade_button_tooltip"
              style={{ flex: 1, marginLeft: 5 }}
            >
              <ButtonWrapper
                direction={-1}
                className={
                  cfdOptionsActiveDirection === -1 && !disableDown
                    ? 'hover'
                    : ''
                }
                colors={colors}
                activeButton={direction}
                onClick={() => onTrade(-1)}
                onMouseEnter={() =>
                  props.actionSetCfdOptionsActiveDirection(-1)
                }
                onMouseLeave={() =>
                  props.actionSetCfdOptionsActiveDirection(null)
                }
                disable={disableDown}
              >
                <ButtonTitle direction={-1} colors={colors} isMobile={isMobile}>
                  <span className="dp__arrow">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 9 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 1L8 8" strokeLinecap="round" />
                      <path
                        d="M2 8H8V2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {controlWords['down'] || t`Down`}
                </ButtonTitle>
              </ButtonWrapper>
              <ReactTooltip id="low_trade_button_tooltip" place="bottom">
                {disableDown
                  ? t`It is not allowed to make trades in the opposite direction while you have active open trades`
                  : ''}
              </ReactTooltip>
            </div>
          </ButtonsWrapper>
        )}
        {isMobile && (
          <ButtonsWrapper>
            <ButtonWrapper
              direction={-1}
              className={
                cfdOptionsActiveDirection === -1 && !disableDown ? 'hover' : ''
              }
              colors={colors}
              activeButton={direction}
              onClick={() => onTrade(-1)}
              disable={disableDown}
              isMobile={isMobile}
            >
              <ButtonTitle direction={-1} colors={colors} isMobile={isMobile}>
                <span className="dp__arrow">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 9 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L8 8" strokeLinecap="round" />
                    <path
                      d="M2 8H8V2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {t`Down`}
              </ButtonTitle>
            </ButtonWrapper>
            <ButtonWrapper
              direction={1}
              className={
                cfdOptionsActiveDirection === 1 && !disableUp ? 'hover' : ''
              }
              colors={colors}
              activeButton={direction}
              onClick={() => onTrade(1)}
              disable={disableUp}
              isMobile={isMobile}
            >
              <ButtonTitle direction={1} colors={colors} isMobile={isMobile}>
                <span className="dp__arrow">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 9 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 8L8 1" strokeLinecap="round" />
                    <path
                      d="M2 1H8V7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {t`Up`}
              </ButtonTitle>
            </ButtonWrapper>
          </ButtonsWrapper>
        )}
        {isMobile && (disableDown || disableUp) && (
          <MobileDisableTradeTooltip colors={props.colors}>
            {disableDown || disableUp
              ? t`It is not allowed to make trades in the opposite direction while you have active open trades`
              : ''}
          </MobileDisableTradeTooltip>
        )}
        {isMobile ? (
          !oneClickTrade ? (
            canTradeButton ? (
              <CreateTradeButton
                colors={colors}
                disabled={!canTradeButton}
                onClick={loggedIn ? onSubmitTrade : onSignIn}
                isMobile={isMobile}
              >
                {createTradeCaption}
              </CreateTradeButton>
            ) : (
              <TradeButtonPlaceHolder colors={colors} isMobile={isMobile}>
                {t`Tap up or down`}
              </TradeButtonPlaceHolder>
            )
          ) : null
        ) : null}
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
        {!isMobile
          ? !oneClickTrade && (
              <CreateTradeButton
                colors={colors}
                disabled={!canTradeButton}
                onClick={onSubmitTrade}
                isMobile={isMobile}
              >
                {createTradeCaption}
              </CreateTradeButton>
            )
          : null}

        {/* <OneClickTradeBox
          isMobile={isMobile}
          active={oneClickTrade}
          colors={colors}
          onChange={onChangeOneClickTrade}
        /> */}

        {/* {isMobile && (
          <MobileInfoPanel
            isMobile={isMobile}
            game={currentGame}
            colors={colors}
            lastPrice={props.lastPrice}
            breakevenPrice={round(
              Number(props.lastPrice) + Number(option_prices?.price ?? 0),
              3
            )}
          />
        )} */}
      </Panel>
    </Wrapper>
  )
}

const mapStateToProps = (state: any) => ({
  direction: state.trading.direction,
  minStake: Number(state.registry.data.investmentLimits.minStake),
  wallet: state.wallets,
  registry: state.registry.data,
  colors: state.theme,
  loggedIn: isLoggedIn(state),
  game: state.game,
  instrumentID: state.trading.selected,
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
  cfdOptionsActiveDirection: state.trading.cfdOptionsActiveDirection,
  selectedCfdOptionInstrument: state.trading.selectedCfdOptionInstrument,
  cfdRiskAmount: state.trading.cfdRiskAmount,
  selectedCfdOptionExpiry: state.trading.selectedCfdOptionExpiry,
  optionsCfdHedgeAllowed:
    state.registry.data.partnerConfig.optionsCfdHedgeAllowed,
  openTrades: state.trades.open || [],
  controlWords: state.registry.data.controlWords,
  showConfetti: state.container.showConfetti,
  trades: state.trades,
})

export default connect(mapStateToProps, {
  actionSubmitTrade,
  actionSelectGame,
  actionSetDirection,
  actionShowModal,
  actionAddMessage,
  actionSetCfdRiskAmount,
  actionSetCfdOptionsActiveDirection,
  actionSetSelectedCfdOptionExpiry,
})(TradeBox)
