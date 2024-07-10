import styled from 'styled-components'

const ExplorerContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`

const Title = styled.div`
	font-size: 20px;
	font-weight: 700;
	text-transform: uppercase;
	margin-bottom: 20px;
`

const ParamsContainer = styled.div``

const ParamContainer = styled.div`
	display: flex;
	flex-direction: row;
`

const ParamLabel = styled.div`
	width: 50%;
	margin-right: 20px;
	font-size: 14px;
`

const ParamInput = styled.input<{ colors: any }>`
	padding: 0 10px;
	margin: 5px 0;
	height: 30px;
	font-size: 14px;
	text-align: right;
	outline: none;
	border: none;
	background-color: ${(props) => props.colors.textfieldBackground};
	color: ${(props) => props.colors.primaryText};
`

const ArrayContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const ActionsContainer = styled.div`
	display: flex;
	flex: 1;
	align-items: flex-end;
	justify-content: flex-end;
`

const ActionButton = styled.button<{ colors: any }>`
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
	cursor: pointer;

	border-radius: 4px;

	color: ${(props) => props.colors.primaryTextContrast};
	background: ${(props) => props.colors.primary};
`

export {
	ExplorerContainer,
	Title,
	ParamsContainer,
	ParamContainer,
	ParamLabel,
	ParamInput,
	ArrayContainer,
	ActionsContainer,
	ActionButton,
}
