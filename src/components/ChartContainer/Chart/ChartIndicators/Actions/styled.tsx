import styled from 'styled-components'

const ActionsContainer = styled.div`
	display: flex;
	flex-direction: row;
	margin-right: auto;
`

const IconContainer = styled.div`
	width: 37px;
	height: 37px;
	cursor: pointer;
	text-align: center;

	svg {
		display: flex;
		height: 100%;
		margin: auto;
	}

	&:hover {
		background-color: #0d1722;
	}
`

export { ActionsContainer, IconContainer }
