import styled from 'styled-components'

const AssetsFeaturedWrapper = styled.div<{}>`
	display: grid;
	grid-template-rows: 140px;
	grid-auto-flow: column;
	grid-auto-columns: 0;
	grid-template-columns: repeat(auto-fit, 226px);
	column-gap: 6px;
	justify-content: flex-start;
	margin: 15px 0;
`

const AssetsFeaturedItem = styled.div<{
	colors: any
	closed: boolean
}>`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	cursor: ${(props) => (props.closed ? 'not-allowed' : 'pointer')};
	background-color: ${(props) => props.colors.sidebarElementActive};
	opacity: ${(props) => (props.closed ? '.3' : '1')};
`

export { AssetsFeaturedWrapper, AssetsFeaturedItem }
