import React from 'react'
import { connect } from 'react-redux'
import { IInvestmentLimits, IRegistry } from '../../core/API'
import { IGame } from '../../reducers/games'
import styled, { css } from 'styled-components'
import { formatCurrency } from '../selectors/currency'
import { isMobileLandscape } from '../../core/utils'

/**
 * Find a propriate minStake and the closest in investmentOptions
 * @param gameType - from game
 * @param investmentLimits
 * @param investmentPresets
 */
const getPresetsByGameType = (
  gameType: number,
  investmentLimits: IInvestmentLimits,
  investmentPresets: number[]
): number[] => {
  const gameTypeToDefaultStake: any = {
    1: 'defaultStake',
    2: 'defaultStake60sec',
    3: 'defaultStake',
    11: 'defaultStake',
  }

  const fieldName: string = (gameTypeToDefaultStake as any)[gameType]

  return investmentPresets.map((value) =>
    //convert to percentage
    parseInt(
      (
        (value / 100) *
        Number(investmentLimits[fieldName as keyof IInvestmentLimits])
      ).toFixed()
    )
  )
}

const isDisabled = (
  curValue: number,
  investValue: number,
  maxValue: number,
  loggedIn: boolean
) => {
  if (!loggedIn) return false
  return curValue + investValue > maxValue
}

interface IInvestmentPresetsProps {
  colors: any
  registry: IRegistry
  game: IGame
  formatCurrency: any
  onClick: (value: number) => void
  maxValue: number
  curValue: number
  investmentPresets: number[]
  loggedIn: boolean
  isMobile: boolean
}

const ButtonPanel = styled.div<any>`
  display: flex;
  height: 28px;
  margin-top: 6px;
  margin-bottom: 15px;

  ${(props) =>
    isMobileLandscape(props.isMobile)
      ? css`
          display: none;
        `
      : css``}
`
const PresetButton = styled.div<{ colors: any; disabled: boolean }>`
  flex: 1 1 auto;
  height: 28px;
  line-height: 28px;
  padding-left: 6px;
  padding-right: 6px;
  text-align: center;
  border-radius: 3px;
  background-color: ${(props) => props.colors.tradebox.investmentButton};
  font-size: 12px;
  letter-spacing: normal;
  cursor: pointer;
  color: ${(props) => props.colors.primaryText};
  margin-left: 5px;

  &:first-of-type {
    margin-left: 0;
  }

  &:hover {
    ${(props) =>
      props.disabled
        ? 'cursor: not-allowed'
        : `color: ${props.colors.primary}`};
  }
`

const InvestmentPresets = (props: IInvestmentPresetsProps) => {
  const buttons: number[] = getPresetsByGameType(
    props.game?.gameType || 1,
    props.registry.investmentLimits,
    props.investmentPresets
  )
  return (
    <ButtonPanel isMobile={props.isMobile}>
      {buttons.map((value: number, index: number) =>
        index < 3 ? (
          <PresetButton
            disabled={isDisabled(
              props.curValue,
              value,
              props.maxValue,
              props.loggedIn
            )}
            key={value}
            colors={props.colors}
            onClick={() =>
              isDisabled(props.curValue, value, props.maxValue, props.loggedIn)
                ? ''
                : props.onClick(value)
            }
          >
            +{value}
          </PresetButton>
        ) : null
      )}
    </ButtonPanel>
  )
}

const mapStateToProps = (state: any) => ({
  registry: state.registry.data,
  game: state.game,
  formatCurrency: formatCurrency(state),
  investmentPresets: state.registry.data.partnerConfig.investmentPresets ?? [
    25, 50, 75, 100,
  ],
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps)(InvestmentPresets)
