import styled from 'styled-components'

const TrackStepContainer = styled.div<{
	height: number
	alignItems: 'flex-end' | 'flex-start'
	isTrackDisabled: boolean
	backgroundImage: string
}>`
	position: relative;
	display: flex;
	flex-direction: column;
	height: ${(props) => props.height}px;
	background-image: url(${(props) =>
		props.isTrackDisabled
			? 'cfd-ladder-disabled.png'
			: props.backgroundImage});
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
`

export { TrackStepContainer }
