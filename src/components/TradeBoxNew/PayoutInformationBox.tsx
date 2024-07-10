/**
 * Implements a floating to the left box for current payout
 */
import React from 'react'
import { t } from 'ttag'
import PayoutsBox from './PayoutsBox'
import {
  PayoutBoxLabel,
  PayoutInformationPanel,
  PotentialProfit,
} from './styled'

interface IPayoutInformatioBox {
  colors: any
  payout: any
  amount: any
  potentialProfit: any
  formatCurrency: any
  onClose: () => void
}

const PayoutInformationBox = ({
  colors,
  payout,
  amount,
  potentialProfit,
  formatCurrency,
}: IPayoutInformatioBox) => (
  <PayoutInformationPanel colors={colors}>
    <PayoutBoxLabel colors={colors}>{t`Payout information`}</PayoutBoxLabel>
    <PotentialProfit colors={colors}>
      <h2>{payout}%</h2>
      <h3>+{formatCurrency(potentialProfit)}</h3>
    </PotentialProfit>
    <PayoutsBox
      payout={payout}
      amount={amount}
      colors={colors}
      formatCurrency={formatCurrency}
    />
  </PayoutInformationPanel>
)

export default PayoutInformationBox
