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
import InvestmentPresets from '../InvestmentPresets'
import MobileInfoPanel from '../MobileInfoPanel'
import { OneClickTradeBox } from '../OneclickTradeBox'
import ProductTypePanel from '../ProductTypePanel'
import {
  CreateTradeButton,
  MobileDisableTradeTooltip,
  PayoutLabel,
  TradeButtonPlaceHolder,
  Wrapper,
} from '../styled'
import TextInfoBlock from '../TextInfoBlock'
import { ButtonsWrapper, ButtonTitle, ButtonWrapper } from './styled'
import { round, toNumber } from 'lodash'
import MobileExpirySelect from './MobileExpirySelect'
import { IOpenTrade } from '../../../core/interfaces/trades'
import ReactTooltip from 'react-tooltip'
import ExpirySelect from '../ExpirySelect'
import ThemedIcon from '../../ui/ThemedIcon'
import InfoIcon from '../info.svg'
import useSound from 'use-sound'
import sound from '../../notifications/TradeSubmit/sound.mp3'

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
      <PayoutLabel colors={colors} isMobile={isMobile}>
        <span>
          {t`Time Duration`}
          <ThemedIcon
            width={12}
            height={12}
            fill={colors.sidebarLabelText}
            stroke={colors.sidebarLabelText}
            src={InfoIcon}
          />
        </span>
      </PayoutLabel>
      {!isMobile && (
        <ExpirySelect
          game={currentGame}
          games={Object.keys(selectedCfdOptionInstrument ?? []).map((key) => ({
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
          }))}
          colors={colors}
          isMobile={isMobile}
          isCfdOptions={true}
          disabled={!inTradingHours}
          disableShortLong={true}
        />
      )}
      {isMobile && (
        <MobileExpirySelect
          colors={colors}
          game={currentGame}
          games={Object.keys(selectedCfdOptionInstrument ?? []).map((key) => ({
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
          }))}
          actionSetSelectedCfdOptionExpiry={
            props.actionSetSelectedCfdOptionExpiry
          }
        />
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
      {props.currencySymbol !== 'Ƀ' && (
        <InvestmentPresets
          maxValue={maxStake}
          curValue={cfdRiskAmount}
          colors={colors}
          loggedIn={loggedIn}
          onClick={(value: number) =>
            actionSetCfdRiskAmount(cfdRiskAmount + value)
          }
        />
      )}
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
        <ButtonsWrapper isMobile={isMobile}>
          <div data-tip="" data-for="high_trade_button_tooltip">
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
                    width="19"
                    height="15"
                    viewBox="0 0 19 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.0157 2.09084L12.8651 0H18.5V5.4782L16.3494 3.38736L10.4329 9.13033L6.67635 5.4782L0.500191 11.3477L0.5 8.9999L6.67635 2.89432L10.4329 6.54644L15.0157 2.09084Z"
                      stroke="none"
                    />
                    <path
                      d="M18.4998 6.6521L16.152 4.6956V14.0868H18.4998V6.6521Z"
                      stroke="none"
                    />
                    <path
                      d="M8.326 8.6086L10.6738 10.5651V14.0868H8.326V8.6086Z"
                      stroke="none"
                    />
                    <path
                      d="M12.239 9.3912L14.5868 7.0434V14.0868H12.239V9.3912Z"
                      stroke="none"
                    />
                    <path
                      d="M6.7608 7.0434L4.413 9.3912V14.0868H6.7608V7.0434Z"
                      stroke="none"
                    />
                    <path
                      d="M0.5 12.5216L2.8478 10.1738V14.0868H0.5V12.5216Z"
                      stroke="none"
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
          <div data-tip="" data-for="low_trade_button_tooltip">
            <ButtonWrapper
              direction={-1}
              className={
                cfdOptionsActiveDirection === -1 && !disableDown ? 'hover' : ''
              }
              colors={colors}
              activeButton={direction}
              onClick={() => onTrade(-1)}
              onMouseEnter={() => props.actionSetCfdOptionsActiveDirection(-1)}
              onMouseLeave={() =>
                props.actionSetCfdOptionsActiveDirection(null)
              }
              disable={disableDown}
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              <ButtonTitle direction={-1} colors={colors} isMobile={isMobile}>
                <span className="dp__arrow">
                  <svg
                    width="19"
                    height="15"
                    viewBox="0 0 18 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.913 10.9565L14.8696 9.3913L9.93298 4.63575L6.17642 8.16198L0 2.26686L0.000191067 0L6.17642 5.66718L9.93298 2.14092L16.4348 8.21739L18 7.04348V10.9565H12.913Z"
                      stroke="none"
                    />
                    <path
                      d="M2.34783 6.26087L0 4.30435V10.9565H2.34783V6.26087Z"
                      stroke="none"
                    />
                    <path
                      d="M3.91304 7.82609L6.26087 9.78261V10.9565H3.91304V7.82609Z"
                      stroke="none"
                    />
                    <path
                      d="M13.3043 9.78261L11.7391 8.21739V10.9565L13.3043 9.78261Z"
                      stroke="none"
                    />
                    <path
                      d="M10.1739 6.65217L7.82609 8.6087V10.9565H10.1739V6.65217Z"
                      stroke="none"
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
        <ButtonsWrapper isMobile={isMobile}>
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

      {isMobile && (
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
      )}
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
