import styled from 'styled-components'

const ListContainer = styled.div<{ colors: any; isMobile: boolean }>`
	position: fixed;
	z-index: 42;
	display: block;
	box-sizing: border-box;
	width: 171px;
	min-height: 300px;
	padding: 6px 0 8px;
	border-radius: 2px;
	box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);

	${(props: any) => (!props.isMobile ? 'top: 152px' : '')};
	${(props: any) => (props.isMobile ? 'bottom: 120px' : '')};
	background-color: ${(props) => props.colors.listBackgroundActive};
`
const ActionsBar = styled.div`
	display: flex;
	width: 100%;
	height: 34px;
	line-height: 34px;
	border-bottom: 1px solid #424e60;

	div {
		flex: 1 1 auto;
		text-align: center;
	}
`
const Items = styled.div`
	display: block;
	margin-top: 8px;
	height: 288px;
	overflow-y: scroll;

	border-bottom: 1px solid #424e60;
`
const ListItem = styled.div<any>`
	display: flex;
	box-sizing: border-box;
	width: 100%;
	height: 35px;
	line-height: 35px;
	font-size: 14px;
	letter-spacing: normal;
	cursor: pointer;

	img {
		margin-left: 10px;
		margin-right: 10px;
		width: auto;
		height: 24px;
		margin-top: 5px;
	}
	div {
		flex: 0 0 44px;
		text-align: center;
	}
	span {
		flex: 1 1 auto;
	}

	color: ${(props) => props.colors.textfieldText};
	background-color: ${(props) =>
		props.active ? props.colors.listBackgroundNormal : 'transparent'};

	&:hover {
		background-color: ${(props) =>
			props.colors.listBackgroundNormal} !important;
	}
`

const CustomAnnotationToolbar = styled.div<any>`
	#toolbar-edit-icon {
		background-color: ${(props) => props.colors.sidebarElementActive};
	}

	#toolbar-destroy-icon {
		background-color: ${(props) => props.colors.sidebarElementActive};
	}
`

export { ListContainer, ActionsBar, Items, ListItem, CustomAnnotationToolbar }
