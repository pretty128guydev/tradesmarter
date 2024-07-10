/**
 * Implements payouts box
 */
import React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'

interface IPayoutsBoxProps {
  amount: number
  payout: number
  colors: any
  formatCurrency: any
}

const PayoutsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
`
const Column = styled.div<{ colors: any }>`
  flex: 1 1 auto;
  font-size: 11px;
  text-align: left;
  line-height: 1.36;

  margin-right: 10px;
  &:last-of-type {
    margin-right: 0;
  }

  div {
    color: ${(props) => props.colors.sidebarLabelText};
  }
  span {
    display: block;
    color: ${(props) => props.colors.primaryText};
  }
`

const PayoutsBox = ({
  amount,
  payout,
  colors,
  formatCurrency,
}: IPayoutsBoxProps) => {
  const profit = amount + (amount * payout) / 100
  return (
    <PayoutsContainer>
      <Column colors={colors}>
        <div>{t`In the money`}</div>
        <span>
          {formatCurrency(profit)} ({payout}%)
        </span>
      </Column>
      <Column colors={colors}>
        <div>{t`Out of the money`}</div>
        <span>{formatCurrency(0)} (0%)</span>
      </Column>
      <Column colors={colors}>
        <div>{t`At the money`}</div>
        <span>{formatCurrency(amount)} (0%)</span>
      </Column>
    </PayoutsContainer>
  )
}

export default PayoutsBox
