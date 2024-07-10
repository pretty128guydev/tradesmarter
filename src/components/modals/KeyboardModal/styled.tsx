import styled from 'styled-components'

export const Modal = styled.div<any>`
	position: absolute;
	top: calc(50% - 200px);
	left: calc(50% - 135px);
	height: 275px;
	display: block;
	z-index: 120;
`

export const CloseButton = styled.button<{ colors: any }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 34px;
	height: 34px;
	background-color: ${(props) => props.colors.primary};
	border: none;
	border-radius: 50%;
	padding: 0;

	&:before {
		content: '';
		position: absolute;
		width: 2px;
		height: 14px;
		background-color: ${(props) => props.colors.panelBackground};
		transform: rotate3d(0, 0, 1, 45deg);
	}

	&:after {
		content: '';
		position: absolute;
		width: 2px;
		height: 14px;
		background-color: ${(props) => props.colors.panelBackground};
		transform: rotate3d(0, 0, 1, -45deg);
	}
`
