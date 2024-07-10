import React, { useState, useEffect, useContext } from 'react'
import { IIndicatorParam } from '../../menuItems'
import Backdrop from '../../../../../Backdrop'
import { MenuContainer } from './styled'
import Actions from '../../Actions'
import EditPanel from '../../EditPanel'
import { IndicatorsContext } from '../../../../Chart'

interface ILegendMenuProps {
	indicator: any
	x?: number
	y?: number
}

const LegendMenu = ({ indicator, x, y }: ILegendMenuProps) => {
	const [editMode, setEditMode] = useState<boolean>(false)
	const [visability, setVisability] = useState<boolean>(false)
	const {
		removeIndicator,
		updateIndicator,
		toggleIndicator,
		getIndicatorVisibility,
	} = useContext(IndicatorsContext)

	useEffect(() => {
		const visibility = getIndicatorVisibility(indicator)
		setVisability(visibility)
	}, [indicator])

	const onToggle = () => {
		toggleIndicator(indicator)
		setVisability(!visability)
	}

	const onUpdate = (params: IIndicatorParam[]) => {
		if (indicator) updateIndicator(indicator, params)
	}

	const onRemove = () => {
		if (indicator) removeIndicator(indicator)
	}

	return (
		<MenuContainer x={x} y={y}>
			<Actions
				indicatorVisability={visability}
				onRemove={() => removeIndicator(indicator)}
				onToggle={onToggle}
				onEdit={() => setEditMode(true)}
				showHideEnabled={true}
				trashEnabled={true}
				editEnabled={true}
			/>
			{editMode && (
				<EditPanel
					indicator={indicator}
					indicatorVisability={visability}
					onToggle={onToggle}
					onUpdate={onUpdate}
					onRemove={onRemove}
				/>
			)}
			{editMode && <Backdrop onClick={() => setEditMode(false)} />}
		</MenuContainer>
	)
}

export default LegendMenu
