import styled from 'styled-components'

const HeaderContainer = styled.div<{ colors: any }>`
	position: relative;
	flex: 1;
	padding: 10px;
	color: ${(props) => props.colors.textfieldText};
`

const FeaturedTopIcon = styled.div`
	position: absolute;
	right: 9px;
	top: 14px;
`

const TitleContainer = styled.div`
	height: 32px;
	display: flex;

	img {
		width: 32px;
	}
`
const AssetNameCaption = styled.div<{ colors: any }>`
	display: block;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	max-width: 140px;
	margin: auto 0 auto 12px;

	&:hover {
		color: ${(props) => props.colors.primaryText};
		border-bottom: ${(props) => `3px solid ${props.colors.primary}`};
		margin-bottom: 3.5px;
	}
`

const SubTitleContainer = styled.div`
	display: flex;
	margin-top: 6px;
	font-weight: 500;
	font-size: 20px;
	line-height: 23px;
`

const AssetPriceCation = styled.div<{ colors: any }>`
	margin-right: 6px;
	color: ${(props) => props.colors.primaryText};
`

const ProfitCaption = styled.div<{ colors: any }>`
	display: flex;
	align-items: center;
	font-size: 14px;
	line-height: 16px;
	color: ${(props) => props.colors.primary};
`

export {
	HeaderContainer,
	TitleContainer,
	SubTitleContainer,
	AssetNameCaption,
	AssetPriceCation,
	ProfitCaption,
	FeaturedTopIcon,
}
