import styled from 'styled-components'

const SliderContainer = styled.div<any>`
	width: 50px;
	margin-top: ${(props) => (props.isMobile ? '10px' : '95px')};
	margin-left: 12px;
	margin-right: 12px;
`

const TrackContainer = styled.div`
	position: relative;
`

export { SliderContainer, TrackContainer }
