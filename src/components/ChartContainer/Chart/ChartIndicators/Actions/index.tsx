import React from 'react'
import { ActionsContainer, IconContainer } from './styled'
import { ReactComponent as Hide } from '../icons/hide.svg'
import { ReactComponent as Show } from '../icons/show.svg'
import { ReactComponent as Trash } from '../icons/trash.svg'
import { ReactComponent as Edit } from '../icons/edit.svg'

interface IActions {
	indicatorVisability: boolean
	onRemove?: () => void
	onToggle?: () => void
	onEdit?: () => void
	showHideEnabled: boolean
	trashEnabled: boolean
	editEnabled: boolean
}

const Actions = ({
	indicatorVisability,
	onRemove,
	onToggle,
	onEdit,
	showHideEnabled,
	trashEnabled,
	editEnabled,
}: IActions) => {
	return (
		<ActionsContainer>
			{showHideEnabled && (
				<IconContainer>
					{indicatorVisability ? (
						<Hide onClick={onToggle} />
					) : (
						<Show onClick={onToggle} />
					)}
				</IconContainer>
			)}
			{trashEnabled && (
				<IconContainer>
					<Trash onClick={onRemove} />
				</IconContainer>
			)}
			{editEnabled && (
				<IconContainer>
					<Edit onClick={onEdit} />
				</IconContainer>
			)}
		</ActionsContainer>
	)
}

export default Actions
