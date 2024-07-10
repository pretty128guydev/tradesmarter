/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Text, Button, Overlay } from 'react-md'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  BottomPositionPanel,
  Counter,
  HeaderTrade,
  LineExpand,
  LineExpandIcon,
  LineExpandWraper,
  TradeTable,
} from './styled'
import { delay, round } from 'lodash'
import {
  actionTradeSellBack,
  actionTradeHedge,
  actionTradeDoubleUp,
  actionRefrechTrades,
} from '../../../actions/trades'
import { formatCurrency, formatStringCurrency } from '../../selectors/currency'
import {
  cfdMoneyStateGetColor,
  dateFormatter,
  formatExpiryTimestamp,
  formatPayout,
  getCfdMoneyStateString,
  getFloatingAmount,
  getMoneyState,
  getMoneyStateString,
  moneyStateGetColor,
} from '../PositionsPanel/OpenPositionItem'
import { actionSelectExpiry } from '../../../actions/expiry'
import Countdown from '../PositionsPanel/Countdown'
import { ButtonIcon, SellbackButton } from '../PositionsPanel/styled'
import ReactTooltip from 'react-tooltip'
import { DoubleUpIcon, HedgeIcon } from '../PositionsPanel/Icons'
import { api } from '../../../core/createAPI'
import UserStorage from '../../../core/UserStorage'
import { getClosedMoneyStateString } from '../services/TradeStatus'
import { moneyStatusColors } from '../PositionsPanel/ClosedPositionItem'
import { actionSetSidebar } from '../../../actions/sidebar'
import {
  actionSetShowBottomPanel,
  actionSetBottomPanelHeight,
} from '../../../actions/container'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { getDifference } from '../../../core/utils'
import { SidebarState } from '../../../reducers/sidebar'
import EventEmitter from '../../../core/EventEmitter'

const BottomPositionsPanel = (props: any) => {
  const [TabNameSelected, setTabNameSelected] = useState<string>('open')
  const [newClosedPositions, setNewClosedPositions] = useState<number>(0)
  const [mouseDown, setMouseDown] = useState(false)
  const [mouseMove, setMouseMove] = useState(false)
  const [tbodyWidth, setTbodyWidth] = useState(window.innerWidth - 370)
  const [newTrades, setNewTrades] = useState([])
  const [showOverlay, setShowOverlay] = useState(false)

  const tbodyRef = useRef()
  const selectedSidebarRef = useRef()

  const { sellbackInstruments, doubleupInstruments } =
    props.tradeOperationsConfig

  const handleResize = useCallback(
    (e: any) => {
      !mouseMove && setMouseMove(true)
      const tbody: any = tbodyRef.current
      if (!tbody) return

      const ratio = window.devicePixelRatio
      const movementY = e.movementY / ratio
      const { height } = tbody.getBoundingClientRect()
      const windowHeight = (window.innerHeight * 33) / 100 - 100
      const adjustHeight = height - movementY
      if (!(adjustHeight < 75 || adjustHeight > windowHeight)) {
        props.actionSetBottomPanelHeight(adjustHeight)
      }
    },
    [mouseMove]
  )

  const usePrevious = (value: any) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  const prevTrades = usePrevious(props.trades)

  useEffect(() => {
    if (prevTrades) {
      // @ts-ignore
      const { open: prevOpen }: { prevOpen: IOpenTrade[] } = prevTrades
      const { open } = props.trades

      if (open.length > prevOpen.length) {
        setTabNameSelected('open')
        const newItems = getDifference(open, prevOpen)
        // @ts-ignore
        setNewTrades([...newTrades, ...newItems])
      }
    }
  }, [props.trades])

  useEffect(() => {
    if (mouseDown) {
      window.addEventListener('mousemove', handleResize)
    }

    return () => {
      window.removeEventListener('mousemove', handleResize)
    }
  }, [mouseDown, handleResize])

  useEffect(() => {
    const handleMouseUp = () => {
      setMouseDown(false)
      setShowOverlay(false)
      delay(() => setMouseMove(false), 200)
    }

    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const setWidthTable = useCallback(() => {
    const minusWidth =
      selectedSidebarRef.current === SidebarState.markets ? 270 : 0
    let width = window.innerWidth - 372 - minusWidth
    width =
      width - (props.showSideMenu ? (props.collapsedSideMenu ? 42 : 220) : 0)
    setTbodyWidth(width)
  }, [props.showSideMenu, props.collapsedSideMenu])

  useEffect(() => {
    window.addEventListener('resize', setWidthTable)

    return () => window.removeEventListener('resize', setWidthTable)
  }, [])

  useEffect(() => {
    setWidthTable()
  }, [props.showSideMenu, props.collapsedSideMenu])

  useEffect(() => {
    selectedSidebarRef.current = props.selectedSidebar
    setWidthTable()
  }, [props.selectedSidebar, setWidthTable])

  useEffect(() => {
    const emitter: any = EventEmitter.addListener(
      'setBottomPositionsTab',
      (event: any) => {
        setTabNameSelected(event.tab)
        setNewClosedPositions(event.trades)
      }
    )

    return () => {
      emitter.removeListener('setBottomPositionsTab', () => {})
    }
  }, [])

  const handleMouseDown = () => {
    setMouseDown(true)
    setShowOverlay(true)
  }

  const onCloseCfdTrade = (e: any, tradeID: number) => {
    e.stopPropagation()

    if (props.userID) {
      return api
        .closeTrades(
          [[+tradeID, +props.userID]],
          UserStorage.getOneClickTrade() ?? false
        )
        .then(() => {
          props.actionRefrechTrades()
        })
    }
  }

  const onSellBack = (e: any, positionInstrument: any, position: any) => {
    if (sellbackInstruments.includes(positionInstrument)) {
      const { nativeEvent } = e
      const { target } = nativeEvent
      const sidebarElement = target.closest('.bottom-position-panel')
      if (sidebarElement) {
        const rect = sidebarElement.getBoundingClientRect()
        const { width, left, top } = rect
        props.actionTradeSellBack(position, left + width / 2 - 105, top - 270)
      } else {
        props.actionTradeSellBack(
          position,
          window.innerWidth / 2,
          window.innerHeight / 2
        )
      }
    }
  }

  const renderOpenTradesTable = () => {
    return (
      <TradeTable colors={props.colors}>
        <thead>
          <tr>
            <th className="fit-width">
              <div data-tip="" data-for={'open-id-tooltip'}>
                {t`Trade ID`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-id-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Trade ID`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-symbol-tooltip'}>
                {t`Symbol`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-symbol-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Symbol`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width" style={{ textAlign: 'center' }}>
              <div data-tip="" data-for={'open-direction-tooltip'}>
                {t`Direction`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-direction-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Direction`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-status-tooltip'}>
                {t`Status`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-status-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Status`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-investment-tooltip'}>
                {t`Investment`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-investment-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Investment`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-strike-tooltip'}>
                {t`Strike`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-strike-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Strike`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-price-tooltip'}>
                {t`Crnt Price`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-price-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Crnt Price`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-payout-tooltip'}>
                {t`Payout`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-payout-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Payout`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-pnl-tooltip'}>
                {t`PnL`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-pnl-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`PnL`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-trade-tooltip'}>
                {t`Trade Time`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-trade-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Trade Time`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-expiry-tooltip'}>
                {t`Expiry Time`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-expiry-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Expiry Time`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'open-action-tooltip'}>
                {t`Actions`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'open-action-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Actions`}
                </ReactTooltip>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.trades[TabNameSelected]?.map(
            (position: any, index: number) => {
              const {
                instrumentName,
                direction,
                instrumentID,
                userCurrencyStake,
                allowSellback,
                expiryTimestamp,
                optionManualCloseAllowed,
                payout,
                createdTimestamp,
                strike,
                tradeID,
                optionValue,
                stake,
              } = position
              const quote = props.quotes[instrumentID]
              const isOptionsCfd = !!optionValue

              // Option
              const moneyState: number = quote
                ? getMoneyState(position, quote.last)
                : -1
              const moneyStateStr: string = getMoneyStateString(moneyState)
              const moneyStateColor = moneyStateGetColor(
                moneyState,
                props.colors
              )
              const floatingAmount = getFloatingAmount(position, moneyState)

              // Cfd
              const currentCfdOptionsPnL = Math.max(
                (((quote.last - strike) * direction) / optionValue!) * stake -
                  stake,
                -1 * stake
              )
              const cfdMoneyStateStr =
                getCfdMoneyStateString(currentCfdOptionsPnL)
              const cfdMoneyStateColor = cfdMoneyStateGetColor(
                currentCfdOptionsPnL,
                props.colors
              )
              const directionUpText = '▾'
              const directionDownText = '▾'
              const directionDecorated =
                direction === 1 ? directionUpText : directionDownText

              return (
                <tr
                  key={tradeID}
                  className={`fit-width ${
                    direction === 1 ? 'buy-row' : 'sell-row'
                  } ${moneyState < 0 ? 'highlight-win' : ''}`}
                >
                  <td className="fit-width">{tradeID}</td>
                  <td className="fit-width">{instrumentName}</td>
                  <td className="fit-width" style={{ textAlign: 'center' }}>
                    <span className="trade_direction">
                      <b
                        style={{
                          color:
                            direction > 0
                              ? props.colors.primary
                              : props.colors.secondary,
                        }}
                      >
                        {directionDecorated}
                      </b>
                    </span>
                  </td>
                  <td className="fit-width">
                    <span
                      className="trade__money"
                      style={{
                        color: isOptionsCfd
                          ? cfdMoneyStateColor
                          : moneyStateColor,
                      }}
                    >
                      <b>{isOptionsCfd ? cfdMoneyStateStr : moneyStateStr}</b>
                    </span>
                  </td>
                  <td className="fit-width">
                    {props.formatCurrency(userCurrencyStake)}
                  </td>
                  <td className="fit-width">{strike}</td>
                  <td className="fit-width">{quote?.last}</td>
                  <td className="fit-width">
                    {!isOptionsCfd ? formatPayout(payout) : ''}
                  </td>
                  <td className="fit-width">
                    {isOptionsCfd
                      ? props.formatCurrency(currentCfdOptionsPnL)
                      : props.formatCurrency(floatingAmount)}
                  </td>
                  <td className="fit-width">
                    {dateFormatter(createdTimestamp)}
                  </td>
                  <td className="fit-width">
                    {formatExpiryTimestamp(expiryTimestamp)}
                  </td>
                  <td className="fit-width">
                    <div style={{ display: 'flex' }}>
                      {isOptionsCfd && optionManualCloseAllowed === 1 && (
                        <div style={{ marginRight: 7 }}>
                          <div data-tip="" data-for={'close-trade-tooltip'}>
                            <SellbackButton
                              style={{ width: 100 }}
                              colors={props.colors}
                              onClick={(e) => onCloseCfdTrade(e, tradeID)}
                            >{t`Close Trade`}</SellbackButton>
                            <ReactTooltip
                              id={'close-trade-tooltip'}
                              place="top"
                              className="react-tooltip-small"
                            >
                              {t`Close Trade`}
                            </ReactTooltip>
                          </div>
                        </div>
                      )}
                      {!isOptionsCfd && (
                        <div style={{ display: 'flex' }}>
                          {sellbackInstruments.includes(
                            String(instrumentID)
                          ) && (
                            <div data-tip="" data-for={'sellback-icon-tooltip'}>
                              <SellbackButton
                                colors={props.colors}
                                style={{
                                  opacity: allowSellback ? 1.0 : 0.5,
                                  marginRight: 7,
                                  width: 100,
                                }}
                                onClick={
                                  allowSellback
                                    ? (e) =>
                                        onSellBack(
                                          e,
                                          String(instrumentID),
                                          position
                                        )
                                    : () => {}
                                }
                              >{t`Sell back`}</SellbackButton>

                              <ReactTooltip
                                id={'sellback-icon-tooltip'}
                                place="top"
                                className="react-tooltip-small"
                              >
                                {t`Sellback`}
                              </ReactTooltip>
                            </div>
                          )}
                          <div data-tip="" data-for={'hedge-icon-tooltip'}>
                            <ButtonIcon>
                              <HedgeIcon
                                primary={props.colors.primary}
                                style={{ 'margin-right': 7 }}
                                onClick={() => props.actionTradeHedge(position)}
                              />
                            </ButtonIcon>
                            <ReactTooltip
                              id={'hedge-icon-tooltip'}
                              place="top"
                              className="react-tooltip-small"
                            >
                              {t`Hedge`}
                            </ReactTooltip>
                          </div>
                          <div data-tip="" data-for={'double-up-icon-tooltip'}>
                            <ButtonIcon>
                              <DoubleUpIcon
                                primary={props.colors.primary}
                                style={{ 'margin-right': 7 }}
                                onClick={() =>
                                  doubleupInstruments.includes(
                                    String(instrumentID)
                                  ) && props.actionTradeDoubleUp(position)
                                }
                              />
                            </ButtonIcon>
                            <ReactTooltip
                              id={'double-up-icon-tooltip'}
                              place="top"
                              className="react-tooltip-small"
                            >
                              {t`Double Up`}
                            </ReactTooltip>
                          </div>
                        </div>
                      )}
                      <Countdown
                        created={createdTimestamp}
                        expiry={expiryTimestamp}
                        moneyState={
                          isOptionsCfd ? currentCfdOptionsPnL : moneyState
                        }
                        colors={props.colors}
                      />
                    </div>
                  </td>
                </tr>
              )
            }
          )}
        </tbody>
      </TradeTable>
    )
  }

  const renderClosedTradesTable = () => {
    return (
      <TradeTable colors={props.colors}>
        <thead>
          <tr>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-trade-tooltip'}>
                {t`Trade ID`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-expiry-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Expiry Time`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-symbol-tooltip'}>
                {t`Symbol`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-symbol-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Symbol`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width" style={{ textAlign: 'center' }}>
              <div data-tip="" data-for={'closed-direction-tooltip'}>
                {t`Direction`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-direction-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Direction`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-status-tooltip'}>
                {t`Status`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-status-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Status`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-investment-tooltip'}>
                {t`Investment`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-investment-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Investment`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-strike-tooltip'}>
                {t`Strike`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-strike-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Strike`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-price-tooltip'}>
                {t`Closed Price`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-price-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Closed Price`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-payout-tooltip'}>
                {t`Payout`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-payout-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Payout`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-return-tooltip'}>
                {t`Return`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-return-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Return`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-trade-tooltip'}>
                {t`Trade Time`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-trade-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Trade Time`}
                </ReactTooltip>
              </div>
            </th>
            <th className="fit-width">
              <div data-tip="" data-for={'closed-trade-tooltip'}>
                {t`Expiry Time`}
                <ReactTooltip
                  offset={{ top: 5 }}
                  id={'closed-expiry-tooltip'}
                  place="top"
                  class="react-tooltip-small-position"
                >
                  {t`Expiry Time`}
                </ReactTooltip>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.trades[TabNameSelected]?.map(
            (position: any, index: number) => {
              const {
                instrumentName,
                direction,
                userCurrencyStake,
                expiryTimestamp,
                payout,
                createdTimestamp,
                strike,
                tradeID,
                status,
                optionValue,
                closedPrice,
                stake,
                userCurrencyReturn,
              } = position
              const isOptionsCfd = !!optionValue
              const moneyStateStr: string = getClosedMoneyStateString(
                Number(status)
              )
              const moneyStateColor = moneyStatusColors(
                Number(status),
                props.colors
              )
              const positionReturn = round(
                userCurrencyReturn - (isOptionsCfd ? stake : 0),
                4
              )
              const cfdMoneyStateStr = getCfdMoneyStateString(positionReturn)
              const cfdMoneyStateColor = cfdMoneyStateGetColor(
                positionReturn,
                props.colors
              )
              const directionUpText = '▾'
              const directionDownText = '▾'
              const directionDecorated =
                direction === 1 ? directionUpText : directionDownText

              return (
                <tr
                  key={tradeID}
                  className={Number(status) === 1 ? 'highlight-win' : ''}
                >
                  <td className="fit-width">{tradeID}</td>
                  <td className="fit-width">{instrumentName}</td>
                  <td className="fit-width" style={{ textAlign: 'center' }}>
                    <span className="trade_direction">
                      <b
                        style={{
                          color:
                            direction > 0
                              ? props.colors.primary
                              : props.colors.secondary,
                        }}
                      >
                        {directionDecorated}
                      </b>
                    </span>
                  </td>
                  <td className="fit-width">
                    <span
                      style={{
                        color: isOptionsCfd
                          ? cfdMoneyStateColor
                          : moneyStateColor,
                      }}
                    >
                      <b>{isOptionsCfd ? cfdMoneyStateStr : moneyStateStr}</b>
                    </span>
                  </td>
                  <td className="fit-width">
                    {props.formatStringCurrency(userCurrencyStake)}
                  </td>
                  <td className="fit-width">{strike}</td>
                  <td className="fit-width">{closedPrice}</td>
                  <td className="fit-width">
                    {!isOptionsCfd ? formatPayout(payout) : ''}
                  </td>
                  <td className="fit-width">
                    {props.formatStringCurrency(positionReturn)}
                  </td>
                  <td className="fit-width">
                    {dateFormatter(createdTimestamp)}
                  </td>
                  <td className="fit-width">
                    {dateFormatter(expiryTimestamp)}
                  </td>
                </tr>
              )
            }
          )}
        </tbody>
      </TradeTable>
    )
  }

  return (
    <>
      <BottomPositionPanel
        colors={props.colors}
        className="bottom-position-panel"
        style={{ width: tbodyWidth }}
      >
        <LineExpandWraper
          colors={props.colors}
          onClick={() => {
            if (mouseMove) return
            // if (props.panel === SidebarState.positions) {
            //   props.actionSetSidebar(SidebarState.trade)
            // } else {
            //   props.actionSetSidebar(SidebarState.positions)
            // }
            props.actionSetShowBottomPanel(!props.showBottomPanel)
          }}
          onMouseDown={handleMouseDown}
        >
          <LineExpand colors={props.colors} className="line-expanded">
            <LineExpandIcon colors={props.colors}>
              <span>▾</span>
              <span>▾</span>
              {t`Open Positions`}
              {props.trades?.['open']?.length > 0 && (
                <div className="counter-container">
                  <Counter colors={props.colors}>
                    {props.trades['open'].length}
                  </Counter>
                </div>
              )}
            </LineExpandIcon>
          </LineExpand>
        </LineExpandWraper>
        {/* {props.panel === SidebarState.positions && ( */}
        {props.showBottomPanel && (
          <>
            <HeaderTrade colors={props.colors}>
              <Text className="title-panel">{t`Positions`}</Text>
              <div className="group-button">
                <Button
                  onClick={(e) => setTabNameSelected('open')}
                  className={TabNameSelected === 'open' ? 'active' : ''}
                >
                  {t`Open Positions`}
                </Button>
                <Button
                  onClick={(e) => setTabNameSelected('closed')}
                  className={TabNameSelected === 'closed' ? 'active' : ''}
                >
                  {t`Closed Positions`}
                </Button>
              </div>
            </HeaderTrade>
            <div
              ref={tbodyRef as any}
              className="table-wrap scrollable"
              style={{ height: props.bottomPanelHeight }}
            >
              {TabNameSelected === 'open'
                ? renderOpenTradesTable()
                : renderClosedTradesTable()}
            </div>
          </>
        )}
      </BottomPositionPanel>
      <Overlay
        id="modal-overlay"
        visible={showOverlay}
        onRequestClose={() => {}}
        style={{
          zIndex: 1,
          backgroundColor: 'transparent',
          cursor: 'ns-resize',
        }}
      />
    </>
  )
}

const mapStateToProps = (state: any) => ({
  expiry: state.expiry.selected,
  colors: state.theme,
  trades: state.trades,
  selectedInstrument: Number(state.trading.selected),
  lockedTrades: state.trading.locked,
  quotes: state.quotes,
  tradeOperationsConfig: state.registry.data.tradeOperationsConfig,
  formatCurrency: formatCurrency(state),
  formatStringCurrency: formatStringCurrency(state),
  userID: state.account.userInfo?.userID,
  panel: state.sidebar.panel,
  showBottomPanel: state.container.showBottomPanel,
  bottomPanelHeight: state.container.bottomPanelHeight,
  selectedSidebar: state.sidebar.panel,
  showSideMenu: state.container.showSideMenu,
  collapsedSideMenu: state.container.collapsedSideMenu,
})

export default connect(mapStateToProps, {
  actionTradeSellBack,
  actionTradeHedge,
  actionTradeDoubleUp,
  actionSelectExpiry,
  actionRefrechTrades,
  actionSetSidebar,
  actionSetShowBottomPanel,
  actionSetBottomPanelHeight,
})(BottomPositionsPanel)
