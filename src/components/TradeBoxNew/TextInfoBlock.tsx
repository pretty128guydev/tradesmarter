/**
 * Implements a text block with 3 lines:
 * Strike time
 * Expiry at
 * Time left
 */
import React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import { IGame } from '../../reducers/games'
import { formatExpiryTimestamp } from './ExpirySelect'
import TimeLeft from './TimeLeft'

const TextInfoPanel = styled.div`
  display: block;
  margin-bottom: 20px;
`
const Line = styled.div`
  display: flex;
  height: 14px;
  line-height: 14px;
`
const Title = styled.div<{ colors: any }>`
  flex: 0 1 auto;
  text-align: left;
  font-size: 11px;
  color: ${(props) => props.colors.sidebarLabelText};
  margin-right: 5px;
`
const Filler = styled.div`
  flex: 1 1 auto;
  opacity: 0.5;
  height: 11px;
  border-bottom: dashed 1px #979797;
`
const Value = styled.div<{ colors: any; green: boolean }>`
  margin-left: 5px;
  flex: 0 1 auto;
  text-align: right;
  font-size: 11px;
  color: ${(props) =>
    props.green ? props.colors.primary : props.colors.primaryText};
`

interface ITextInfoBlockProps {
  game: IGame | null
  lastPrice: any
  colors: any
  disableStrikePrice?: boolean
}

const TextInfoBlock = ({
  game,
  lastPrice,
  colors,
  disableStrikePrice,
}: ITextInfoBlockProps) => (
  <TextInfoPanel>
    {!disableStrikePrice && (
      <Line>
        <Title colors={colors}>{t`Strike Price`}</Title>
        <Filler />
        <Value colors={colors} green={false}>
          {lastPrice}
        </Value>
      </Line>
    )}
    {game && (
      <Line>
        <Title colors={colors}>{t`Expiry at`}</Title>
        <Filler />
        <Value colors={colors} green={false}>
          {game.timestamp && formatExpiryTimestamp(game)}
        </Value>
      </Line>
    )}
    <Line>
      <Title colors={colors}>{t`Time left`}</Title>
      <Filler />
      <Value colors={colors} green={true}>
        <TimeLeft game={game} />
      </Value>
    </Line>
  </TextInfoPanel>
)

export default TextInfoBlock
