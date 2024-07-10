import styled from 'styled-components'

const ListPanel = styled.div<any>`
	position: absolute;
	display: block;
	z-index: 80;

	width: 200px;
	min-height: 131px;
	border-radius: 2px;

	box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
	background-color: ${(props) => props.colors.modalBackground};
`
const Heading = styled.div<any>`
    display: flex;
    height: 35px;
    line-height: 35px;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px solid ${(props) => props.colors.panelBorder};
    div {
        flex: 1 1 auto;
        font-size: 11px;
        color: ${(props) => props.colors.secondaryText};
    }
    span {
        flex: 1 1 auto;
        font-size: 11px;
        letter-spacing: normal;
        text-align: right;
        color: ${(props) => props.colors.primaryText};
      }
    }
`
const BonusItem = styled.div<any>`
	display: flex;
	height: 46px;
	border-bottom: solid 1px ${(props) => props.colors.panelBorder};
	cursor: default;

	&:last-of-type {
		border-bottom: none;
	}
`
const BallContainer = styled.div`
	display: block;
	width: 40px;
	height: 40px;
	flex: 0 0 40px;
`
const CaptionContainer = styled.div`
	display: block;
	flex: 1 1 auto;
	height: 40px;
`
const BallActive = styled.div<any>`
	margin: 10px auto;
	display: block;
	position: relative;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: ${(props) => props.colors.primary};
	border: solid 1px ${(props) => props.colors.primary};

	&:after {
		display: block;
		content: ' ';

		position: absolute;
		top: 5px;
		left: 5px;
		border-radius: 50%;
		width: 8px;
		height: 8px;
		background: ${(props) => props.colors.textfieldBackground};
	}
`
const BallNormal = styled.div<any>`
	margin: 10px auto;
	display: block;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: ${(props) => props.colors.textfieldBackground};
	border: ${(props) => props.colors.panelBorder};
`
const Caption = styled.div<any>`
	display: block;
	margin-top: 10px;
	margin-bottom: 5px;
	font-size: 11px;
	letter-spacing: normal;
	color: ${(props) => props.colors.secondaryText};
	height: 15px;
	line-height: 15px;
`
const BarHolder = styled.span<any>`
	display: block;
	height: 7px;
	line-height: 7px;
	width: 150px;
	border-radius: 3.5px;
	background-color: #000000;
`

export {
	BarHolder,
	Caption,
	BallActive,
	BallNormal,
	CaptionContainer,
	BallContainer,
	BonusItem,
	Heading,
	ListPanel,
}
