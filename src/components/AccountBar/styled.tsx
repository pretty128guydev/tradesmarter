import styled from 'styled-components'

const AccountBarContainer = styled.div<any>`
	display: flex;
	box-sizing: border-box;

	padding-left: 20px;
	padding-right: 20px;

	height: 32px;
	line-height: 30px;

	background-color: ${(props) => props.colors.panelBackground};
	border: 1px solid ${(props) => props.colors.panelBorder};
	border-bottom: none;
`
const TextGroup = styled.div<any>`
	flex: 1 1 auto;
	font-size: 11px;
	font-weight: bold;
	letter-spacing: -0.17px;

	position: relative;
`
const Caption = styled.span<any>`
	text-transform: uppercase;
	color: ${(props) =>
		props.active ? props.colors.primaryText : props.colors.secondaryText};
`

const Value = styled.span<{ colors: any; primary?: boolean }>`
	margin-left: 10px;
	font-size: 13px;
	color: ${(props) =>
		props.primary ? props.colors.primary : props.colors.primaryText};
`

const Oval = styled.div<any>`
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	margin-right: 5px;
	background-color: ${(props) => props.colors.primary};
`

export { AccountBarContainer, TextGroup, Caption, Value, Oval }
