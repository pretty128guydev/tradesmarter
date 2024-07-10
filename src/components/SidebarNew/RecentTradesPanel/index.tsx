/**
 * Implements a Tutorials panel
 */
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import styled from 'styled-components'
import CloseButton from '../CloseBtn'
import SidebarContentsPanel from '../SidebarContentsPanel'
import { api } from '../../../core/createAPI'
import { convertHexToRGBA, randomColor } from '../../../core/utils'
import Countdown from '../PositionsPanel/Countdown'
import moment from 'moment'

interface IRecentTradesPanelProps {
  colors: any
  onClose: () => void
  instrumentID: string
  showBottomPanel: boolean
  bottomPanelHeight: number
  partnerConfig: any
}

interface IRecentTrade {
  initials: string
  openPrice: string
  tradeOpenTime: string
  tradeExpiryTime: string
}

const SidebarCaption = styled.h3<any>`
  display: block;
  box-sizing: border-box;
  height: 26px;
  padding-bottom: 11px;
  margin: 13px 0;
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  letter-spacing: -0.07px;
  text-align: center;
  text-transform: uppercase;

  color: ${(props) => props.colors.primaryText};
  border-bottom: 1px solid ${(props) => props.colors.sidebarBorder};
`

const RecentTradesContainer = styled.div<any>`
  padding: 0 10px 10px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const RecentTradesHeader = styled.div<any>`
  border-radius: 4px 4px 0 0;
  padding: 10px;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  font-weight: 900;
  font-size: 12px;
  line-height: 14px;
  display: flex;
  align-items: center;
  text-transform: uppercase;

  > span {
    display: inline-block;
    font-size: 27px;
    margin-right: 10px;
    transform: translateY(-2px);

    &.up {
      transform: translateY(2px) rotate(180deg);
    }
  }
`

const RecentTradesContent = styled.div<any>`
  flex: 1;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  padding: 6px;

  > div {
    > table {
      width: 100%;

      tbody {
        display: block;
        height: ${(props) => props.height}px;
        overflow-x: hidden;
        overflow-y: scroll;
        margin-right: -8px;
      }

      thead,
      tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }

      td,
      th {
        padding-right: 10px;

        &:last-child {
          padding-right: 0;
        }
      }

      th {
        text-align: left;
      }

      .text-right {
        text-align: right;
      }
    }
  }

  span.user {
    font-weight: 700;
    font-size: 9px;
    line-height: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    color: white;
  }

  .fit-width {
    width: 1px;
    white-space: nowrap;
  }
`

const RecentTradesPanel = (props: IRecentTradesPanelProps) => {
  const {
    colors,
    instrumentID,
    partnerConfig,
    bottomPanelHeight,
    showBottomPanel,
  } = props
  const { showTradesBottom } = partnerConfig

  const [upTrades, setUpTrades] = useState<IRecentTrade[]>([])
  const [downTrades, setDownTrades] = useState<IRecentTrade[]>([])

  const [bottomPosition, setBottomPosition] = useState(
    showTradesBottom ? (showBottomPanel ? bottomPanelHeight + 84 : 18) : 0
  )

  const [containerHeight, setContainerHeight] = useState(
    window.innerHeight - 96 - bottomPosition
  )

  useEffect(() => {
    const fetchFn = async () => {
      const resp = await api.fetchRecentTrades(instrumentID)
      const { success, data } = resp
      if (success && data) {
        const { up, down } = data
        setUpTrades(up)
        setDownTrades(down)
      }
    }
    fetchFn()
  }, [instrumentID])

  useEffect(() => {
    window.addEventListener('resize', setHeight)
    const intervalRefreshData = setInterval(async () => {
      const resp = await api.fetchRecentTrades(instrumentID)
      const { success, data } = resp
      if (success && data) {
        const { up, down } = data
        setUpTrades(up)
        setDownTrades(down)
      }
    }, 5000)

    return () => {
      window.removeEventListener('resize', setHeight)
      if (intervalRefreshData) clearInterval(intervalRefreshData)
    }
  }, [])

  useEffect(() => {
    const height = showTradesBottom
      ? showBottomPanel
        ? bottomPanelHeight + 84
        : 18
      : 0
    setBottomPosition(height)
    setContainerHeight(window.innerHeight - 96 - height)
  }, [bottomPanelHeight, showBottomPanel])

  const setHeight = useCallback(() => {
    const height = showTradesBottom
      ? showBottomPanel
        ? bottomPanelHeight + 84
        : 18
      : 0
    setContainerHeight(window.innerHeight - 96 - height)
  }, [bottomPanelHeight, showBottomPanel])

  return (
    <SidebarContentsPanel
      colors={colors}
      adjustable={false}
      isMobile={false}
      padding={'0'}
      bottom={bottomPosition}
    >
      <SidebarCaption colors={colors}>{t`Trades`}</SidebarCaption>
      <CloseButton colors={colors} onClick={props.onClose} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <RecentTradesContainer>
          <RecentTradesHeader
            backgroundColor={colors.tradebox.highActive}
            color={colors.primaryTextContrast}
          >
            <span className="up">▾</span> {t`High Pool`}
          </RecentTradesHeader>
          <RecentTradesContent
            backgroundColor={convertHexToRGBA(colors.tradebox.highActive, 0.2)}
            color={colors.primaryText}
            height={(containerHeight - 206) / 2}
          >
            <div>
              <table cellSpacing={0}>
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>{t`User`}</th>
                    <th>{t`Time`}</th>
                    <th className="text-right">{t`Open Price`}</th>
                    <th style={{ width: 24 }}></th>
                  </tr>
                </thead>
                <tbody className="scrollable">
                  {upTrades.map((trade, index) => (
                    <tr key={index}>
                      <td style={{ width: 50 }}>
                        <span
                          className="user"
                          style={{
                            backgroundColor: randomColor(
                              `${trade.initials}-Background`
                            ),
                            color: randomColor(trade.initials),
                          }}
                        >
                          {trade.initials}
                        </span>
                      </td>
                      <td>
                        {moment
                          .utc(trade.tradeOpenTime)
                          .local()
                          .format('DD.MM.YY HH:mm')}
                      </td>
                      <td className="text-right">
                        {parseFloat(Number(trade.openPrice).toFixed(5))}
                      </td>
                      <td style={{ width: 24 }}>
                        <Countdown
                          created={Number(
                            moment.utc(trade.tradeOpenTime).local().format('x')
                          )}
                          expiry={Number(
                            moment
                              .utc(trade.tradeExpiryTime)
                              .local()
                              .format('x')
                          )}
                          moneyState={-1}
                          colors={colors}
                          size={20}
                          fontSize={9}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RecentTradesContent>
        </RecentTradesContainer>
        <RecentTradesContainer>
          <RecentTradesHeader
            backgroundColor={colors.tradebox.lowActive}
            color={colors.primaryTextContrast}
          >
            <span>▾</span> {t`Low Pool`}
          </RecentTradesHeader>
          <RecentTradesContent
            backgroundColor={convertHexToRGBA(colors.tradebox.lowActive, 0.1)}
            color={colors.primaryText}
            height={(containerHeight - 206) / 2}
          >
            <div>
              <table cellSpacing={0}>
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>{t`User`}</th>
                    <th>{t`Time`}</th>
                    <th className="text-right">{t`Open Price`}</th>
                    <th style={{ width: 24 }}></th>
                  </tr>
                </thead>
                <tbody className="scrollable">
                  {downTrades.map((trade, index) => (
                    <tr key={index}>
                      <td style={{ width: 50 }}>
                        <span
                          className="user"
                          style={{
                            backgroundColor: randomColor(
                              `${trade.initials}-Background`
                            ),
                            color: randomColor(trade.initials),
                          }}
                        >
                          {trade.initials}
                        </span>
                      </td>
                      <td>
                        {moment
                          .utc(trade.tradeOpenTime)
                          .local()
                          .format('DD.MM.YY HH:mm')}
                      </td>
                      <td className="text-right">
                        {parseFloat(Number(trade.openPrice).toFixed(5))}
                      </td>
                      <td style={{ width: 24 }}>
                        <Countdown
                          created={Number(
                            moment.utc(trade.tradeOpenTime).local().format('x')
                          )}
                          expiry={Number(
                            moment
                              .utc(trade.tradeExpiryTime)
                              .local()
                              .format('x')
                          )}
                          moneyState={-1}
                          colors={colors}
                          size={20}
                          fontSize={9}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RecentTradesContent>
        </RecentTradesContainer>
      </div>
    </SidebarContentsPanel>
  )
}

const mapStateToProps = (state: any) => ({
  instrumentID: state.trading.selected,
  showBottomPanel: state.container.showBottomPanel,
  bottomPanelHeight: state.container.bottomPanelHeight,
  partnerConfig: state.registry.data.partnerConfig,
})

export default connect(mapStateToProps)(RecentTradesPanel)
