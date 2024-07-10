import styled from 'styled-components'

const LegendContainer = styled.div``

const BriefContainer = styled.div``

const IndicatorBrief = styled.span`
	display: flex;
	align-items: center;
	margin-right: 20px;
	cursor: pointer;
`

const IndicatorColor = styled.div`
	display: flex;
	width: 16px;
	height: 16px;
	margin-right: 8px;
	background-color: #263346;
`

const LineColor = styled.div<any>`
	height: 2px;
	width: 100%;
	margin: auto;
	background-color: ${(props) => props.backgroundColor};
`

export {
	LegendContainer,
	BriefContainer,
	IndicatorBrief,
	IndicatorColor,
	LineColor,
}
