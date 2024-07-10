/**
 * Implements an keyboard for betting flow
 */
import React, { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { ClosePanelButton } from '../Mobile/Tradebox/styled'
import { ReactComponent as BackspaceIcon } from './backspace.svg'

interface IBettingKeyboardProps {
	colors: any
	onClose: () => void
	onInput: (val: any) => void
	onTouch: (val: any) => void
}

const KeyboardLayout = styled.div<{
	colors: any
}>`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 51px 51px 51px 51px 51px;
	gap: 1.36px;
	width: calc(100% + 40px);
	margin-left: -20px;
	background-color: ${(props) => props.colors.background};
`

const KeyboardTitle = styled.div<{ colors: any }>`
	display: flex;
	align-items: center;
	padding-left: 11px;
	grid-column: 1 / span 3;

	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 14px;
	color: ${(props) => props.colors.primaryText};

	${ClosePanelButton} {
		transform: none;
		z-index: unset;
	}
`

const KeyboardItem = styled.div<{ colors: any }>`
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${(props) => props.colors.primaryText};
	background-color: ${(props) => props.colors.panelBorder};
`

const BettingKeyboard = ({
	colors,
	onClose,
	onInput,
	onTouch,
}: IBettingKeyboardProps) => {
	const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, -1]
	const [touched, setTouched] = useState<boolean>(false)

	const event = (val: string | number) => {
		if (!touched && val !== undefined) {
			setTouched(true)
			onTouch(val)
			return
		}

		if (val !== undefined) {
			onInput(val)
		}
	}

	return (
		<KeyboardLayout colors={colors}>
			<KeyboardTitle colors={colors}>
				<ClosePanelButton onClick={onClose} colors={colors} />
			</KeyboardTitle>
			{items.map((item, i) => (
				<KeyboardItem
					key={i}
					colors={colors}
					onClick={() => event(item)}
				>
					{item !== -1 ? item : <BackspaceIcon />}
				</KeyboardItem>
			))}
		</KeyboardLayout>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
})

export default connect(mapStateToProps)(BettingKeyboard)
