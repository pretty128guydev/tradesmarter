import React, { useState, useEffect } from 'react'
import { t } from 'ttag'
import {
  EditPanelContainer,
  Title,
  ActionsContainer,
  ActionButton,
} from './styled'
import { IIndicatorParam } from '../menuItems'
import ItemActions from '../Actions'
import ParamsViewer from '../ParamsViewer'

interface IEditPanelProps {
  indicator: any
  indicatorVisability: boolean
  onToggle: () => void
  onUpdate: (params: IIndicatorParam[]) => void
  onRemove: () => void
}

const EditPanel = ({
  indicator,
  indicatorVisability,
  onToggle,
  onUpdate,
  onRemove,
}: IEditPanelProps) => {
  const [params, setParams] = useState<IIndicatorParam[]>([])

  useEffect(() => {
    setParams(indicator.params)
  }, [indicator])

  return (
    <EditPanelContainer>
      <Title>{indicator.type}</Title>
      <ParamsViewer isMobile={false} params={params} setParams={setParams} />
      <ActionsContainer>
        <ItemActions
          indicatorVisability={indicatorVisability}
          onRemove={onRemove}
          onToggle={onToggle}
          showHideEnabled={true}
          trashEnabled={true}
          editEnabled={false}
        />
        <ActionButton onClick={() => onUpdate(params)}>
          {t`Update`}
        </ActionButton>
      </ActionsContainer>
    </EditPanelContainer>
  )
}

export default EditPanel
