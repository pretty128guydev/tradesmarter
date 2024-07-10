/**
 * Implements a floating to the left box for current payout
 */
import React from 'react'
import PayoutsBox from './PayoutsBox'
import { MobilePayoutInformationPanel, PotentialProfit } from './styled'

interface IPayoutInformatioBox {
  colors: any
  payout: any
  amount: any
  potentialProfit: any
  formatCurrency: any
}

const MobilePayoutInformationBox = ({
  colors,
  payout,
  amount,
  potentialProfit,
  formatCurrency,
}: IPayoutInformatioBox) => (
  <MobilePayoutInformationPanel colors={colors}>
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
  </MobilePayoutInformationPanel>
)

export default MobilePayoutInformationBox
