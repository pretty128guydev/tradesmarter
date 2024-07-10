/**
 * Implements a Material UI round circle button
 * which is visible only when trading is hidden
 */
import React from 'react'
import styled from 'styled-components'
import iconArrows from './icon-arrows.svg'

const ButtonHolder = styled.button<{ background: string }>`
	position: absolute;
	bottom: 10px;
	right: 10px;
	display: block;
	width: 56px;
	height: 56px;
	background: ${(props) => props.background} url(${iconArrows}) no-repeat
		center;
	border: none;
	border-radius: 50%;
	outline: none;
	z-index: 20;
`

const ButtonTrade = ({ onClick, colors }: any) => (
	<ButtonHolder
		background={colors.tradebox.btnNormal}
		onClick={() => onClick()}
	/>
)

export default ButtonTrade
