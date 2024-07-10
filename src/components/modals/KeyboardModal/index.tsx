import React, { FC } from 'react'
import { connect } from 'react-redux'
import { Overlay } from '@react-md/overlay'
import styled from 'styled-components'

import { Modal, CloseButton } from './styled'
import { actionCloseModal } from '../../../actions/modal'
import { ReactComponent as BackIcon } from './icons/back.svg'
import { ReactComponent as CloseIcon } from './icons/close.svg'

const KeyboardWrapper = styled.div<{ colors: any }>`
	background: ${(props) => props.colors.background};
`

const KeyboardHeader = styled.div`
	display: flex;
	justify-content: end;
	padding: 10px;
`

const KeyboardContent = styled.div`
	display: grid;
	grid-template-rows: repeat(3, 1fr);
	grid-template-columns: repeat(3, 1fr);
	gap: 1px;
`

const Key = styled.div<{ colors: any }>`
	color: ${(props) => props.colors.primaryText};
	background: #253143;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 90px;
	height: 50px;
`

interface IKeyboardModal {
	colors: any
	onChange: (value: number) => void
	onBackClick: () => void
	actionCloseModal: () => void
}

const KeyboardModal: FC<IKeyboardModal> = ({
	colors,
	onChange,
	onBackClick,
	actionCloseModal,
}) => {
	const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9]

	return (
		<>
			<Modal>
				<KeyboardWrapper colors={colors}>
					<KeyboardHeader>
						<CloseButton
							onClick={actionCloseModal}
							colors={colors}
						/>
					</KeyboardHeader>
					<KeyboardContent>
						{keys.map((key) => (
							<Key
								colors={colors}
								key={key}
								onClick={() => onChange(key)}
							>
								<span>{key}</span>
							</Key>
						))}
						<Key colors={colors}>
							<span>.</span>
						</Key>
						<Key colors={colors} onClick={() => onChange(0)}>
							<span>0</span>
						</Key>
						<Key onClick={() => onBackClick()} colors={colors}>
							<BackIcon />
							<CloseIcon style={{ marginLeft: '-15px' }} />
						</Key>
					</KeyboardContent>
				</KeyboardWrapper>
			</Modal>
			<Overlay
				id="modal-overlay"
				visible={true}
				onRequestClose={actionCloseModal}
				style={{ zIndex: 119 }}
			/>
		</>
	)
}

export default connect(null, { actionCloseModal })(KeyboardModal)
