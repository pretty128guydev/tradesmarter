/**
 * Implements a three column layout for mobile
 */
import React from 'react'
import { t } from 'ttag'
import TimeLeft from './TimeLeft'
import styled, { css } from 'styled-components'
import { IGame } from '../../reducers/games'
import { isMobileLandscape } from '../../core/utils'

interface IMobileInfoProps {
  colors: any
  lastPrice?: any
  game: IGame | null
  potentialProfit?: string
  breakevenPrice?: any
  isMobile: boolean
}

const StyledTable = styled.table<{ colors: any; isMobile: boolean }>`
  width: 100%;
  text-align: left;
  margin-top: 10px;
  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            margin-top: 15px;
          }
        `
      : css``}

  thead {
    height: 12px;
    line-height: 12px;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.1px;
    color: ${(props) => props.colors.sidebarLabelText};
  }
  tbody {
    tr {
      margin-top: 6px;
      height: 12px;
      line-height: 1;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.1px;

      td.secondary {
        color: ${(props) => props.colors.primaryText};
      }
      td.primary {
        color: ${(props) => props.colors.primary};
      }
    }
  }
`

const MobileInfoPanel = (props: IMobileInfoProps) => (
  <StyledTable colors={props.colors} isMobile={props.isMobile}>
    <colgroup>
      <col span={1} style={{ width: '33%' }} />
      <col span={1} style={{ width: '33%' }} />
      <col span={1} style={{ width: '33%' }} />
    </colgroup>
    <thead>
      <tr>
        {props.lastPrice && <th>{t`Strike price`}</th>}
        <th>{t`Time left`}</th>
        {props.potentialProfit && <th>{t`Potential profit`}</th>}
        {props.breakevenPrice && <th>{t`Breakeven Price`}</th>}
      </tr>
    </thead>
    <tbody>
      <tr>
        {props.lastPrice && <td className="secondary">{props.lastPrice}</td>}
        <td className="primary">
          <TimeLeft game={props.game} />
        </td>
        {props.potentialProfit && (
          <td className="primary">{props.potentialProfit}</td>
        )}
        {props.breakevenPrice && (
          <td className="primary">{props.breakevenPrice}</td>
        )}
      </tr>
    </tbody>
  </StyledTable>
)

export default MobileInfoPanel
