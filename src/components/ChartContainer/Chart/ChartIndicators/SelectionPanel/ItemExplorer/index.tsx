import React, { useState, useEffect } from 'react'
import { t } from 'ttag'
import { IIndicatorMenuItem, IIndicatorParam } from '../../menuItems'
import {
  ExplorerContainer,
  Title,
  ActionsContainer,
  ActionButton,
} from './styled'
import ItemActions from '../../Actions'
import ParamsViewer from '../../ParamsViewer'
import { connect } from 'react-redux'
import { TabTypes } from '../Tabs'

interface IItemExplorer {
  item: IIndicatorMenuItem | null
  itemVisability: boolean
  onAdd: (params: IIndicatorParam[]) => void
  onUpdate: (params: IIndicatorParam[]) => void
  onRemove: () => void
  onToggle: () => void
  tab: TabTypes
  colors: any
  isMobile: boolean
}

const ItemExplorer = ({
  item,
  itemVisability,
  onAdd,
  onUpdate,
  onRemove,
  onToggle,
  tab,
  colors,
  isMobile,
}: IItemExplorer) => {
  const [params, setParams] = useState<IIndicatorParam[]>([])

  useEffect(() => {
    if (item) setParams(item.params)
  }, [item])

  const isAddTabs = [TabTypes.tabAll, TabTypes.tabFavorites].includes(tab)

  return item ? (
    <ExplorerContainer>
      <Title>
        {isAddTabs
          ? item.name
          : `${item.name} (${item.params
              .flatMap((param) => param.value)
              .join(',')})`}
      </Title>
      <ParamsViewer isMobile={isMobile} params={params} setParams={setParams} />
      <ActionsContainer>
        <ItemActions
          indicatorVisability={itemVisability}
          onRemove={onRemove}
          onToggle={onToggle}
          showHideEnabled={!isAddTabs}
          trashEnabled={!isAddTabs}
          editEnabled={false}
        />
        {isAddTabs ? (
          <ActionButton onClick={() => onAdd(params)} colors={colors}>
            {t`Add Indicator`}
          </ActionButton>
        ) : (
          <ActionButton onClick={() => onUpdate(params)} colors={colors}>
            {t`Update`}
          </ActionButton>
        )}
      </ActionsContainer>
    </ExplorerContainer>
  ) : null
}
const mapStateToProps = (state: any) => ({ colors: state.theme })
export default connect(mapStateToProps)(ItemExplorer)
