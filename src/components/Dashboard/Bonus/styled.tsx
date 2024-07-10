import styled from 'styled-components'

const DashboardBonusSpace = styled.div<{
	isMobile: boolean
}>`
	${(props) => (props.isMobile ? '' : 'grid-area: bonus')};
	display: grid;
	grid-template-columns: ${(props) =>
		props.isMobile ? '1fr' : ' 1fr 1fr 1fr'};
	${(props) =>
		!props.isMobile
			? 'grid-auto-rows: 80px'
			: 'grid-auto-rows: 80px 80px 80px'};
	column-gap: 2px;
	row-gap: 2px;
`

export { DashboardBonusSpace }
