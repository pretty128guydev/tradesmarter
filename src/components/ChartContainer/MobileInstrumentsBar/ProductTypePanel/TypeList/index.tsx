import React from 'react'
import { ProductType } from '../../../../../reducers/trading'
import Backdrop from '../../../../Backdrop'
import { TypeListContainer } from './styled'
import TypeItem from './TypeItem'

interface TypeListProps {
  colors: any
  productTypes: ProductType[]
  selectedProductType: ProductType
  onClose: () => void
  onClick: (productType: ProductType) => void
}

const TypeList = ({
  colors,
  productTypes,
  selectedProductType,
  onClose,
  onClick,
}: TypeListProps) => {
  return (
    <>
      <Backdrop onClick={onClose} />
      <TypeListContainer colors={colors}>
        {productTypes.map((productType) => (
          <TypeItem
            key={productType}
            colors={colors}
            isDisabled={false}
            isSelected={productType === selectedProductType}
            onClick={onClick}
            productType={productType}
            isShowList={true}
          />
        ))}
      </TypeListContainer>
    </>
  )
}

export default TypeList
