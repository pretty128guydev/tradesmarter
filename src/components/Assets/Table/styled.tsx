import styled from 'styled-components'

const AssetsTableSpace = styled.table`
	display: flex;
	flex-direction: column;
	padding: 2px;
	border-spacing: 0;
	overflow: auto;
`

const AssetsTableTHead = styled.thead`
	display: table;
	table-layout: fixed;
	width: 100%;
	padding-right: 8px;
`

const AssetsTableTBody = styled.tbody<{ maxHeight: number }>`
	display: block;
	height: inherit;
	overflow: auto;
	max-height: ${(props) => `calc(100vh - ${props.maxHeight}px)`};
	position: relative;
`

const AssetsTableRow = styled.tr`
	display: table;
	table-layout: fixed;
	width: 100%;
`

const AssetsTableHeader = styled.th<{
	colors: any
	alignRight?: boolean
	alignCenter?: boolean
	widthPercent: number
}>`
	font-style: normal;
	font-weight: 900;
	font-size: 12px;
	line-height: 14px;
	letter-spacing: -0.2px;
	text-transform: uppercase;
	padding: 9px 8px 17px 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: ${(props) => `${props.widthPercent}%`};
	color: ${(props) => props.colors.primaryText};
	border-bottom: 1px solid ${(props) => props.colors.panelBorder};
	text-align: ${(props) => {
		if (props.alignRight) {
			return 'right'
		}
		if (props.alignCenter) {
			return 'center'
		}
		return 'left'
	}};
`

const AssetsTableColumn = styled.td<{
	colors: any
	widthPercent: number
	alignRight?: boolean
	alignCenter?: boolean
	minWidth: number
	color?: string
	disabled?: boolean
	bold?: boolean
}>`
	font-style: normal;
	font-size: 14px;
	line-height: 30px;
	letter-spacing: -0.2px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: ${(props) => {
		if (props.alignRight) {
			return 'right'
		}
		if (props.alignCenter) {
			return 'center'
		}
		return 'left'
	}};
	color: ${(props) =>
		props.color && !props.disabled
			? props.color
			: props.colors.secondaryText};
	border-bottom: 1px solid ${(props) => props.colors.panelBorder};
	width: ${(props) => `${props.widthPercent}%`};
	min-width: ${(props) => `${props.minWidth}px`};
	padding: 0 8px;
	opacity: ${(props) => (props.disabled ? 0.5 : 1)};
	font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};

	img {
		transform: translateY(4px);
		margin-right: 10px;
		width: 16px;
		height: 16px;
		align-self: center;
	}
`

const AssetsTableHoverItem = styled.span<{ colors: any }>`
	&:hover {
		color: ${(props) => props.colors.primaryText};
		border-bottom: ${(props) => `3px solid ${props.colors.primary}`};
		padding-bottom: 3px;
	}
`

const AssetsTableChange = styled.div`
	display: flex;
	align-items: center;

	span {
		width: 70px;
	}

	div {
		width: calc(100% - 70px);
	}
`

export {
	AssetsTableSpace,
	AssetsTableRow,
	AssetsTableHeader,
	AssetsTableColumn,
	AssetsTableTHead,
	AssetsTableTBody,
	AssetsTableChange,
	AssetsTableHoverItem,
}
