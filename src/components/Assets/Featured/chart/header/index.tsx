import React, { FC } from 'react'
import ImageWrapper from '../../../../ui/ImageWrapper'
import {
	AssetNameCaption,
	AssetPriceCation,
	FeaturedTopIcon,
	HeaderContainer,
	ProfitCaption,
	SubTitleContainer,
	TitleContainer,
} from './styled'
import AssetPlaceholder from '../../../../ChartContainer/InstrumentsBar/asset-placeholder.svg'
import { connect } from 'react-redux'
import InstrumentPrice from '../../../../ChartContainer/Chart/Instruments/InstrumentPrice'
import InstrumentDailyChange from '../../../../ChartContainer/Chart/Instruments/instrumentDailyChange'
import TopIcon from '../../../../ui/TopIcon'

interface IChartHeaderProps {
	colors: any
	top: boolean
	instrumentID: string
	instrumentName: string
	closed: boolean
}

const ChartHeader: FC<IChartHeaderProps> = ({
	colors,
	instrumentID,
	top,
	instrumentName,
	closed,
}) => {
	return (
		<HeaderContainer colors={colors}>
			<FeaturedTopIcon>
				<TopIcon isTop={top} instrumentId={instrumentID} />
			</FeaturedTopIcon>
			<TitleContainer>
				<ImageWrapper
					klass="asset_icon"
					alt={`instrument ${instrumentID}`}
					src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrumentID}.svg`}
					placeholderSrc={AssetPlaceholder}
				/>
				<AssetNameCaption colors={colors}>
					{instrumentName}
				</AssetNameCaption>
			</TitleContainer>
			<SubTitleContainer>
				<AssetPriceCation colors={colors}>
					{closed && <span>...</span>}
					{!closed && (
						<InstrumentPrice
							fixed={2}
							instrumentId={instrumentID}
						/>
					)}
				</AssetPriceCation>
				<ProfitCaption colors={colors}>
					<InstrumentDailyChange
						instrumentID={instrumentID}
						withArrow={true}
						colors={colors}
					/>
				</ProfitCaption>
			</SubTitleContainer>
		</HeaderContainer>
	)
}

const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(ChartHeader)
