import styled from 'styled-components'

const EditPanelContainer = styled.div`
	position: fixed;
	z-index: 42;
	left: calc(50% - 300px);
	top: calc(50% - 220px);
	display: flex;
	flex-direction: column;
	width: 380px;
	height: 280px;
	padding: 30px;
	background: rgb(22, 33, 46);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
		0 2px 1px -1px rgba(0, 0, 0, 0.12);
	color: #8491a3;
`

const Title = styled.div`
	margin-bottom: 30px;
	font-size: 20px;
	font-weight: 700;
	text-transform: uppercase;
`

const ActionsContainer = styled.div`
	display: flex;
	flex: 1;
	align-items: flex-end;
	justify-content: flex-end;
`

const ActionButton = styled.button`
	margin-top: 15px;
	border: none;
	outline: none;
	background: transparent;

	display: block;
	min-width: 130px;
	height: 36px;
	line-height: 34px;
	font-family: 'Roboto', sans-serif;
	font-size: 12px;
	font-weight: 500;
	letter-spacing: -0.07px;
	text-align: center;
	text-transform: uppercase;
	user-select: none;

	border-radius: 4px;

	color: #031420;
	background: #75f986;
`

export { EditPanelContainer, Title, ActionsContainer, ActionButton }
