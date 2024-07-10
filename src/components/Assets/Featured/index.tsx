import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { AssetsFeaturedItem, AssetsFeaturedWrapper } from './styled'
import AssetsFeaturedChart from './chart'
import AssetsFeaturedChartHeader from './chart/header'
import { IInstrument, IUserInfo } from '../../../core/API'
import { isLoggedIn } from '../../selectors/loggedIn'
import { defaultTopAssets, getUserInfo } from '../../selectors/instruments'

const CHART_RGB_COLORS = [
	'117, 249, 134',
	'108, 219, 255',
	'255, 218, 71',
	'196, 96, 255',
	'255, 251, 250',
]

const ITEMS_COUNT = 6

interface IAssetsFeaturedProps {
	colors: any
	history: any
	instruments: IInstrument[]
	isLoggedIn: boolean
	userInfo: IUserInfo | null
	defaultTopAssets: any[]
	onClose: (id: string) => void
}

const ITEM_WIDTH = 226

const AssetsFeatured = ({
	colors,
	history,
	instruments,
	isLoggedIn,
	userInfo,
	defaultTopAssets,
	onClose,
}: IAssetsFeaturedProps) => {
	const topAssets = isLoggedIn
		? userInfo?.topAssets
		: defaultTopAssets.map(({ instrumentID }) => instrumentID)

	const AssetsWrapperRef = useRef<any>(null)
	const [activeItemsCount, setActiveItemsCount] = useState<number>(0)
	const [featuredInstruments, setFeaturedInstruments] = useState<
		IInstrument[] | null
	>()

	useEffect(() => {
		if (AssetsWrapperRef.current) {
			const { clientWidth: width } = AssetsWrapperRef.current

			setActiveItemsCount(width / ITEM_WIDTH)
		}
	}, [AssetsWrapperRef.current?.clientWidth])

	useEffect(() => {
		const openAssets = instruments.filter(({ isOpen }) => isOpen)

		let closedAssets: any = []

		if (openAssets.length < ITEMS_COUNT) {
			closedAssets = instruments
				.filter(({ isOpen }) => !isOpen)
				.slice(0, ITEMS_COUNT - openAssets.length)
		}

		setFeaturedInstruments(openAssets.concat(closedAssets))
	}, [instruments])

	return (
		<AssetsFeaturedWrapper ref={AssetsWrapperRef}>
			{featuredInstruments?.map(
				({ instrumentID, name, isOpen }, index) => (
					<AssetsFeaturedItem
						closed={!isOpen}
						key={instrumentID}
						colors={colors}
						onClick={() => (!isOpen ? '' : onClose(instrumentID))}
					>
						<AssetsFeaturedChartHeader
							closed={!isOpen}
							instrumentID={instrumentID}
							instrumentName={name}
							colors={colors}
							top={!!topAssets?.includes(instrumentID)}
						/>
						<AssetsFeaturedChart
							data={history[instrumentID]}
							render={index <= activeItemsCount}
							color={
								CHART_RGB_COLORS[
									index % CHART_RGB_COLORS.length
								]
							}
						/>
					</AssetsFeaturedItem>
				)
			)}
		</AssetsFeaturedWrapper>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
	isLoggedIn: isLoggedIn(state),
	userInfo: getUserInfo(state),
	defaultTopAssets: defaultTopAssets(state),
})

export default connect(mapStateToProps)(AssetsFeatured)
