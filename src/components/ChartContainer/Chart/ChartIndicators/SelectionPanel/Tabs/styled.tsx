import styled from 'styled-components'

const IconsContainer = styled.div`
	display: flex;
	flex-direction: row;
`

const IconContainer = styled.div<{ colors: any }>`
	display: flex;
	align-items: center;
	flex-grow: 1;
	height: 42px;
	border-bottom: 1px solid ${(props) => props.colors.panelBorder};

	svg {
		width: 24px;
		height: 24px;
		margin: auto;
	}

	&:not(.active) {
		background-color: ${(props) => props.colors.textfieldBackground};
	}

	&.active {
		border-top: 2px solid ${(props) => props.colors.primary};
		border-bottom: none;

		&:nth-child(1) {
			border-right: 1px solid ${(props) => props.colors.panelBorder};
		}

		&:nth-child(2) {
			border-right: 1px solid ${(props) => props.colors.panelBorder};
			border-left: 1px solid ${(props) => props.colors.panelBorder};
		}

		&:nth-child(3) {
			border-left: 1px solid ${(props) => props.colors.panelBorder};
		}
	}
`

export { IconsContainer, IconContainer }
