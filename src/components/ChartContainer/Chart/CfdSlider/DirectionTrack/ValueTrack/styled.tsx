import styled from 'styled-components'

export const ValueTrackContainer = styled.div.attrs<any, any>((props: any) => ({
	style: {
		height: `${props.height}px`,
	},
}))`
	width: 50px;
	display: flex;
	position: absolute;
	z-index: 6;
	pointer-events: none;
	background-color: transparent;
	align-items: ${(props) =>
		props.direction === 1 ? 'flex-start' : 'flex-end'};
	${(props) => (props.direction === 1 ? 'bottom' : 'top')}: 0px;
`

const markerWidth = 67
export const MarkerLine = styled.div<{ backgroundColor: string }>`
	position: absolute;
	right: 0;
	height: 3px;
	width: ${markerWidth}px;
	background: ${(props) => props.backgroundColor};
	border-top: 1px solid #101b27;
	border-bottom: 1px solid #101b27;
`

export const LabelContainer = styled.div<{
	direction: 1 | -1
	borderColor: string
}>`
	position: absolute;
	top: -20px;
	right: ${markerWidth}px;
	padding: 7px;
	min-width: 60px;
	min-height: 40px;
	background: ${(props) => props.borderColor};
	box-sizing: border-box;
	border-radius: 26px;
`

const Label = styled.div<{ color: string }>`
	color: #0c121a;
	text-align: center;
`

export const MoneyLabel = styled(Label)`
	font-weight: 900;
	font-size: 13px;
`

export const ProfitLabel = styled(Label)`
	font-size: 11px;
`
