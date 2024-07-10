import React from 'react'
import { ReactComponent as HighLowIcon } from './icons/high-low.svg'
import { ReactComponent as OptionsIcon } from './icons/options.svg'
import { ReactComponent as AboveBelowIcon } from './icons/above-below.svg'
import { ProductType } from '../../../../../../reducers/trading'
import { TypeCaption, TypeItemContainer } from './styled'
import { t } from 'ttag'

interface TypeItemProps {
  colors: any
  isSelected: boolean
  isDisabled: boolean
  isShowList?: boolean
  productType: ProductType
  onClick: (productType: ProductType) => void
}

const TypeItem = ({
  colors,
  isSelected,
  isDisabled,
  productType,
  onClick,
  isShowList = false,
}: TypeItemProps) => {
  return (
    <TypeItemContainer
      colors={colors}
      isSelected={isSelected}
      isDisabled={isDisabled}
      onClick={() => onClick(productType)}
    >
      {productType === ProductType.highLow && <HighLowIcon />}
      {productType === ProductType.cfdOptions && <OptionsIcon />}
      {productType === ProductType.aboveBelow && <AboveBelowIcon />}
      <TypeCaption>
        {productType === ProductType.highLow && t`High/Low`}
        {productType === ProductType.cfdOptions && t`Options`}
        {productType === ProductType.aboveBelow && t`Above/Below`}
      </TypeCaption>
      {!isShowList && <span style={{ color: 'white' }}>▾</span>}
    </TypeItemContainer>
  )
}

export default TypeItem
