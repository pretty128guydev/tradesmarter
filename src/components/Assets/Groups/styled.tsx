import styled from 'styled-components'

const AssetsGroupsWrapper = styled.div`
	display: flex;
	margin-top: 15px;
`

const AssetsGroupsItem = styled.div<{
	colors: any
	selected: boolean
	hover: boolean
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 10px;
	color: ${(props) => props.colors.textfieldText};
	font-size: 14px;
	line-height: 20px;
	font-weight: 400;
	padding-bottom: 10px;
	cursor: pointer;

	border-bottom: ${(props) =>
		props.selected ? `3px solid ${props.colors.primary}` : 'unset'};

	margin-bottom: ${(props) => (props.selected ? `-3px` : 'unset')};

	&:hover {
		color: ${(props) => props.hover && props.colors.primaryText};
		border-bottom: ${(props) =>
			props.hover && `3px solid ${props.colors.primary}`};
		margin-bottom: ${(props) => props.hover && '-3px'};
	}

	p {
		margin: 0;

		&::first-letter {
			text-transform: uppercase;
		}
	}
`

const AssetsGroupIconWrapper = styled.div<{
	colors: any
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background-color: ${(props) => props.colors.sidebarElementActive};
	width: 24px;
	height: 24px;
	margin-right: 10px;
`

export { AssetsGroupsWrapper, AssetsGroupsItem, AssetsGroupIconWrapper }
