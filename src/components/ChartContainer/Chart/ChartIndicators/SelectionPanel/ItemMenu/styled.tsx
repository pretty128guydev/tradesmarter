import styled from 'styled-components'

const MenuContainer = styled.div`
	font-size: 14px;
`
const SearchGroup = styled.div`
	display: flex;
	margin-bottom: 6px;
	border-bottom: 1px solid #9fabbd;

	svg {
		flex: 0 0 40px;
		margin-top: 5px;
	}

	input {
		flex: 1 1 auto;
		border: none;
		background: transparent;
		outline: none;
		box-sizing: border-box;

		height: 36px;
		line-height: 36px;

		opacity: 0.5;
		font-size: 14px;
		letter-spacing: -0.08px;

		color: #9fabbd;
	}
`

const MenuTitle = styled.div`
	font-size: 14px;
	text-transform: uppercase;
	font-weight: 700;
	padding: 15px 20px 0;
`

const Items = styled.div<{ colors: any }>`
	display: block;
	margin-top: 8px;
	height: 288px;
	overflow-y: scroll;

	.active {
		background-color: ${(props) => props.colors.textfieldBackground};
		border-bottom: 1px solid ${(props) => props.colors.primary};
	}
`

export { MenuContainer, SearchGroup, MenuTitle, Items }
