import styled from 'styled-components'

const StepContainer = styled.div<any>`
	position: absolute;
	z-index: 10;
	${(props) => (props.direction === 1 ? 'top: -6px;' : 'bottom: 6px')};
	left: 0;
	right: 0;
	display: flex;
	flex: 1 1 auto;
	justify-content: space-between;
	color: #101b27;
	font-size: 10px;
	line-height: 11px;
	text-align: center;
	pointer-events: none;
`

const LineSeparator = styled.div`
	position: absolute;
	top: 6px;
	left: -15px;
	width: 65px;
	height: 1px;
	background: #263346;
`

const TextWrapper = styled.div<{ isTrackDisabled: boolean }>`
	color: ${(props) => (props.isTrackDisabled ? '#8491A3' : '#fff')};
	font-size: 9px;
	padding: 3px 6px;
	border-radius: 10px;
	background: ${(props) => (props.isTrackDisabled ? '#2A394E' : '#29533f')};
	position: absolute;
	left: 8px;
	top: -2px;
`

export { StepContainer, LineSeparator, TextWrapper }
