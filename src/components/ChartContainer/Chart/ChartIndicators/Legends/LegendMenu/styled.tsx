import styled from 'styled-components'

const MenuContainer = styled.div<any>`
	position: fixed;
	top: ${(props) => props.y}px;
	left: ${(props) => props.x}px;
	z-index: 42;
	display: flex;
	margin-top: ${(props) => (props.y && props.x ? '0' : '50px')};
	background: rgb(22, 33, 46);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
		0 2px 1px -1px rgba(0, 0, 0, 0.12);
`

export { MenuContainer }
