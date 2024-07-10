import React, { FC, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  ListProductItem,
  ListProductContainer,
  SelectProductPanel,
} from './styled'
import { ProductType } from '../../../reducers/trading'
import Backdrop from '../../Backdrop'
import {
  actionSelectInstrument,
  actionSetProductType,
  actionSetDirection,
} from '../../../actions/trading'
import { actionSetFirstTimeOpenWeb } from '../../../actions/container'
import {
  isCfdOptionsVisible,
  isAboveBelowVisible,
} from '../../selectors/trading'
import {
  firstOpenAboveBelowInstrument,
  firstOpenCfdInstrument,
  firstOpenInstrument,
} from '../../selectors/instruments'
import { ReactComponent as HighLowIcon } from './icons/high-low.svg'
import { ReactComponent as OptionsIcon } from './icons/options.svg'
import { ReactComponent as AboveBelowIcon } from './icons/above-below.svg'
import { t } from 'ttag'
import ThemedIcon from '../../ui/ThemedIcon'
import ArrowDown from '../icons/arrow-down.svg'

interface IProductTypePanelProps {
  colors: any
  isMobile: boolean
  isCfdOptionsVisible: boolean
  isAboveBelowVisible: boolean
  productTypes: ProductType[]
  selectedProductType: ProductType
  actionSetProductType: (type: ProductType) => void
  actionSelectInstrument: (id: any) => void
  firstOpenInstrument: string
  firstOpenCfdInstrument: string
  firstOpenAboveBelowInstrument: string
  actionSetDirection: (direction: number) => void
  actionSetFirstTimeOpenWeb: (isFirstTimeOpenWeb: boolean) => void
  controlWords: any
}

const ProductTypePanel: FC<IProductTypePanelProps> = ({
  colors,
  isMobile,
  isCfdOptionsVisible,
  isAboveBelowVisible,
  productTypes,
  selectedProductType,
  actionSetProductType,
  actionSelectInstrument,
  actionSetDirection,
  firstOpenCfdInstrument,
  firstOpenInstrument,
  firstOpenAboveBelowInstrument,
  actionSetFirstTimeOpenWeb,
  controlWords,
}) => {
  const [visibility, setVisibility] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<any>({})

  useEffect(() => {
    switch (selectedProductType) {
      case ProductType.cfdOptions:
        setSelectedProduct({
          icon: <OptionsIcon className="options-icon" />,
          label: controlWords['options'] || t`Options`,
        })
        break
      case ProductType.highLow:
        setSelectedProduct({
          icon: <HighLowIcon className="high-low-icon" />,
          label: controlWords['high/low'] || t`High/Low`,
        })
        break
      case ProductType.aboveBelow:
        setSelectedProduct({
          icon: <AboveBelowIcon className="above-below-icon" />,
          label: controlWords['above/below'] || t`Above/Below`,
        })
        break
    }
  }, [selectedProductType])

  const onItemClick = (type: ProductType) => {
    setVisibility(false)
    actionSetProductType(type)
    actionSetDirection(0)
    let id

    switch (type) {
      case ProductType.cfdOptions:
        id = firstOpenCfdInstrument
        break
      case ProductType.highLow:
        id = firstOpenInstrument
        break
      case ProductType.aboveBelow:
        id = firstOpenAboveBelowInstrument
        break
    }

    actionSelectInstrument(id)
    actionSetFirstTimeOpenWeb(false)
  }

  const productItems = productTypes.filter(
    (type) =>
      (isCfdOptionsVisible && type === ProductType.cfdOptions) ||
      (isAboveBelowVisible && type === ProductType.aboveBelow) ||
      type === ProductType.highLow
  )

  return (
    <SelectProductPanel
      colors={colors}
      active={visibility}
      onClick={() => setVisibility(!visibility)}
    >
      {selectedProduct?.icon}
      <span className="product-name">{selectedProduct?.label}</span>
      <div className="arrow_down">
        <ThemedIcon
          width={10}
          height={10}
          fill={colors.sidebarLabelText}
          src={ArrowDown}
        />
      </div>
      {visibility && (
        <>
          <Backdrop zIndex={85} onClick={() => setVisibility(false)} />
          <ListProductContainer
            zIndex={86}
            colors={colors}
            isMobile={isMobile}
            productItems={productItems.length}
          >
            {selectedProductType !== ProductType.cfdOptions &&
              productItems.includes(ProductType.cfdOptions) && (
                <ListProductItem
                  colors={colors}
                  onClick={() => onItemClick(ProductType.cfdOptions)}
                >
                  <OptionsIcon className="options-icon" />
                  <span className="product-name">
                    {controlWords['options'] || t`Options`}
                  </span>
                </ListProductItem>
              )}
            {selectedProductType !== ProductType.highLow &&
              productItems.includes(ProductType.highLow) && (
                <ListProductItem
                  colors={colors}
                  onClick={() => onItemClick(ProductType.highLow)}
                >
                  <HighLowIcon className="high-low-icon" />
                  <span className="product-name">
                    {controlWords['high/low'] || t`High/Low`}
                  </span>
                </ListProductItem>
              )}
            {selectedProductType !== ProductType.aboveBelow &&
              productItems.includes(ProductType.aboveBelow) && (
                <ListProductItem
                  colors={colors}
                  onClick={() => onItemClick(ProductType.aboveBelow)}
                >
                  <AboveBelowIcon className="above-below-icon" />
                  <span className="product-name">
                    {controlWords['above/below'] || t`Above/Below`}
                  </span>
                </ListProductItem>
              )}
          </ListProductContainer>
        </>
      )}
    </SelectProductPanel>
  )
}

const mapStateToProps = (state: any) => ({
  isMobile: state.registry.isMobile,
  selectedProductType: state.trading.selectedProductType,
  isCfdOptionsVisible: isCfdOptionsVisible(state),
  isAboveBelowVisible: isAboveBelowVisible(state),
  firstOpenInstrument: firstOpenInstrument(state)?.instrumentID,
  firstOpenCfdInstrument: firstOpenCfdInstrument(state)?.instrumentID,
  firstOpenAboveBelowInstrument:
    firstOpenAboveBelowInstrument(state)?.instrumentID,
  controlWords: state.registry.data.controlWords,
})

export default connect(mapStateToProps, {
  actionSetProductType,
  actionSelectInstrument,
  actionSetDirection,
  actionSetFirstTimeOpenWeb,
})(ProductTypePanel)
