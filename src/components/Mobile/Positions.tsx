/**
 * Component which acts like a drawer but contains a positions item from sidebar
 */
import React from 'react'
import styled from 'styled-components'
import PositionsPanel from '../Sidebar/PositionsPanel'
import { ThemeContextConsumer } from '../ThemeContext'

interface IDrawerProps {
	onClose: () => void
}

const Panel = styled.div<any>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: ${(props) => props.colors.background};
	display: flex;
	flex-direction: column;
	z-index: 31;
`

const Positions = (props: IDrawerProps) => (
	<ThemeContextConsumer>
		{(colors) => (
			<Panel colors={colors}>
				<PositionsPanel
					colors={colors}
					isMobile={true}
					onClose={props.onClose}
				/>
			</Panel>
		)}
	</ThemeContextConsumer>
)

export default Positions
