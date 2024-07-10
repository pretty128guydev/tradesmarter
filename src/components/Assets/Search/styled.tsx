import styled from 'styled-components'

const AssetsSearchWrapper = styled.div<{
	colors: any
}>`
	display: flex;
	border-bottom: 1px solid ${(props) => props.colors.textfieldText};
	padding: 8px 0;
`

const AssetsSearchInput = styled.input<{
	colors: any
}>`
	width: 100%;
	background-color: transparent;
	border: unset;
	margin-left: 4px;
	font-size: 14px;
	text-transform: uppercase;
	font-weight: bold;
	color: ${(props) => props.colors.primaryText};

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: ${(props) => props.colors.textfieldText};
	}
`

export { AssetsSearchWrapper, AssetsSearchInput }
