import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  actionSetProductType,
  actionSetDirection,
} from '../../../../actions/trading'
import { ProductType } from '../../../../reducers/trading'
import {
  isCfdOptionsVisible,
  isAboveBelowVisible,
} from '../../../selectors/trading'
import { PanelBox } from './styled'
import TypeList from './TypeList'
import TypeItem from './TypeList/TypeItem'

interface IProductTypePanel {
  theme: any
  selectedProductType: ProductType
  productTypes: ProductType[]
  isCfdOptionsVisible: boolean
  isAboveBelowVisible: boolean
  actionSetProductType: (type: ProductType) => void
  actionSetDirection: (type: number) => void
  isMobile: boolean
  colors: any
}

const ProductTypePanel = ({
  theme,
  selectedProductType,
  productTypes,
  isCfdOptionsVisible,
  isAboveBelowVisible,
  actionSetProductType,
  actionSetDirection,
  isMobile,
  colors,
}: IProductTypePanel) => {
  const [show, setShow] = useState<boolean>(false)

  const onItemClick = (type: ProductType) => {
    setShow(false)
    actionSetProductType(type)
    actionSetDirection(0)
  }

  const productItems = productTypes.filter(
    (type) =>
      (isCfdOptionsVisible && type === ProductType.cfdOptions) ||
      (isAboveBelowVisible && type === ProductType.aboveBelow) ||
      type === ProductType.highLow
  )

  return (
    <PanelBox className="panel-select" isMobile={isMobile} colors={colors}>
      <TypeItem
        colors={theme}
        onClick={() => setShow(true)}
        productType={selectedProductType}
        isSelected={true}
        isDisabled={productItems.length <= 1}
      />
      {show && productItems.length > 0 && (
        <TypeList
          colors={theme}
          productTypes={productItems.filter((i) => i !== selectedProductType)}
          selectedProductType={selectedProductType}
          onClose={() => setShow(false)}
          onClick={(type) => onItemClick(type)}
        />
      )}
    </PanelBox>
  )
}

const mapStateToProps = (state: any) => ({
  theme: state.theme,
  productTypes: state.trading.productTypes,
  selectedProductType: state.trading.selectedProductType,
  isCfdOptionsVisible: isCfdOptionsVisible(state),
  isAboveBelowVisible: isAboveBelowVisible(state),
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionSetProductType,
  actionSetDirection,
})(ProductTypePanel)
