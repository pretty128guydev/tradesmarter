import styled, { keyframes } from 'styled-components'

const fade = keyframes`
  from {opacity: 0;}
  to {opacity: 0.9;}
`

const Overlay = styled.div`
	position: fixed;
	z-index: 20;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`
const Panel = styled.div<{ height: number; colors: any; dragging: boolean }>`
	position: fixed;
	z-index: 52;
	bottom: 0;
	left: 0;
	right: 0;
	animation: ${fade} 0.3s linear;
	${(props) => (!props.dragging ? 'transition: height .5s;' : '')}
	height: ${(props) => props.height}px;
	width: 100%;
	box-sizing: border-box;
	box-shadow: 0 -10px 20px 0 rgba(0, 0, 0, 0.1);
	background: ${(props) => props.colors.sidebarElementActive};
`
const CollapserContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 20px;
	transform: translate3d(0, -10px, 0);
	box-sizing: border-box;
`
const Collapser = styled.div<{ colors: any }>`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex-direction: column;
	width: 80px;
	height: 15px;
	clip-path: polygon(15px 0, 65px 0, 100% 100%, 0 100%);
	transform: translate3d(0, -40%, 0);
	background-color: ${(props) => props.colors.sidebarElementActive};

	&:before {
		content: '';
		background-color: ${(props) => props.colors.secondaryText};
		width: 44px;
		height: 1px;
		margin-bottom: 2px;
	}

	&:after {
		content: '';
		background-color: ${(props) => props.colors.secondaryText};
		width: 44px;
		height: 1px;
		margin-bottom: 2px;
	}
`

const ClosePanelButton = styled.button<{ colors: any }>`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	right: 0;
	width: 34px;
	height: 34px;
	background-color: ${(props) => props.colors.primary};
	margin-right: 10px;
	transform: translate3d(0, -50%, 0);
	border: none;
	border-radius: 50%;
	padding: 0;
	z-index: 85;

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

export { Overlay, Panel, Collapser, CollapserContainer, ClosePanelButton }
