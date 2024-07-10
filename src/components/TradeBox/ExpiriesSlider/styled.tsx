import styled from 'styled-components'
import arrowLeft from '../slider-left.svg'
import arrowRight from '../slider-right.svg'

const ExpiriesContainer = styled.div`
	display: flex;
	box-sizing: border-box;
	width: 270px;
	height: 36px;
	margin-top: 6px;
	border-radius: 2px;
`

const SliderArrowLeft = styled.div<{ colors: any; disabled: boolean }>`
	flex: 0 0 18px;
	height: 100%;
	border-radius: 2px;
	backdrop-filter: blur(0.5px);
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	background: ${(props) => props.colors.tradebox.fieldBackground}
		url(${arrowLeft}) no-repeat center;
`

const SliderContainer = styled.div`
	display: flex;
	flex: 0 0 230px;
	overflow: hidden;
	margin: 0 1px;
`

const SliderItemsWrapper = styled.div<{ slidingWidth: number }>`
	display: flex;
	transition: 0.2s ease-in-out;
	transform: translate3d(${(props) => -props.slidingWidth}px, 0, 0);
`

const SliderArrowRight = styled.div<{ colors: any; disabled: boolean }>`
	flex: 0 0 18px;
	height: 100%;
	border-radius: 2px;
	backdrop-filter: blur(0.5px);
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	background: ${(props) => props.colors.tradebox.fieldBackground}
		url(${arrowRight}) no-repeat center;
`

const ExpiryItemBox = styled.div<{
	active: boolean
	disabled: boolean
	colors: any
}>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 0 0 72px;
	padding: 5px 7px 3px 7px;
	height: 100%;
	margin-left: 1px;
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	background: ${(props) => props.colors.tradebox.fieldBackground};
	border: ${(props) =>
		props.active
			? `solid 1px ${props.colors.primary}`
			: `solid 1px ${props.colors.tradebox.fieldBackground}`};

	.expiration {
		display: flex;
		justify-content: center;
		flex-wrap: nowrap;
		height: 15px;
		line-height: 15px;
		text-align: center;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.11px;
		color: ${(props) => props.colors.primary};
		margin-bottom: 2px;

		.trades_count {
			display: inline-block;
			min-width: 14px;
			height: 14px;
			line-height: 13px;
			text-align: center;
			font-size: 10px;
			border-radius: 50%;
			border: 1px solid ${(props) => props.colors.primary};
			margin-left: 4px;
		}
	}

	.expiry_payout {
		font-size: 9px;
		letter-spacing: 0.07px;
		text-align: center;
		color: ${(props) => props.colors.sidebarLabelText};

		span {
			margin: 0 3px;
		}
	}

	&:first-of-type {
		margin-left: 0;
	}

	&:first-of-type {
		flex: 0 0 66px;
	}
`

export {
	ExpiriesContainer,
	SliderArrowLeft,
	SliderContainer,
	SliderItemsWrapper,
	SliderArrowRight,
	ExpiryItemBox,
}
