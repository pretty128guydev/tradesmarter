import styled from 'styled-components'

const ArticleContainer = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	margin-top: 20px;
`

const ArticleBody = styled.div<{ colors: any }>`
	padding: 10px 10px 20px 11px;
	width: 100%;
	word-break: break-word;

	background-color: ${(props) => props.colors.leftPanel.itemBackground};
`

const ArticleImg = styled.img<{ visible: boolean }>`
	width: 100%;
	height: ${(props) => (props.visible ? '134px' : 0)};
	object-fit: cover;
`

const ArticleTitle = styled.h2<{ colors: any }>`
	margin: 0;
	font-weight: 500;
	font-size: 14px;
	line-height: 16px;

	color: ${(props) => props.colors.primaryText};
`

const ArticleContent = styled.div<{ colors: any }>`
	margin-top: 14px;
	font-size: 12px;
	line-height: 14px;

	color: ${(props) => props.colors.leftPanel.textColor};
`

const ArticleButton = styled.div<{ colors: any }>`
	font-weight: bold;
	font-size: 12px;
	line-height: 14px;
	margin-top: 14px;
	cursor: pointer;
	outline: none;

	color: ${(props) => props.colors.primary};
`

const ArticleList = styled.div`
	height: 100%;
	overflow: auto;
`

export {
	ArticleList,
	ArticleContainer,
	ArticleBody,
	ArticleImg,
	ArticleTitle,
	ArticleContent,
	ArticleButton,
}
