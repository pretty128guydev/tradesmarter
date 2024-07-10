import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { AssetsSearchInput, AssetsSearchWrapper } from './styled'
import { ReactComponent as SearchIcon } from '../../ChartContainer/Chart/Instruments/search.svg'
import { t } from 'ttag'

interface IAssetsSearchProps {
	colors: any
	onSearch: (value: string) => void
}

const AssetsSearch = ({ colors, onSearch }: IAssetsSearchProps) => {
	const [searchValue, setSearchValue] = useState<string>('')
	let timeout = useRef<any>(null)

	useEffect(() => {
		clearTimeout(timeout.current)

		timeout.current = setTimeout(() => {
			onSearch(searchValue)
		}, 1000)

		return () => clearTimeout(timeout.current)
	}, [searchValue])

	return (
		<AssetsSearchWrapper colors={colors}>
			<SearchIcon width="24" height="24" fill="#9fabbd" />
			<AssetsSearchInput
				colors={colors}
				placeholder={t`Type asset name to search`}
				onChange={(e: any) => setSearchValue(e.target.value)}
				value={searchValue}
				autoFocus={true}
			/>
		</AssetsSearchWrapper>
	)
}

const mapStateToProps = (state: any) => ({
	colors: state.theme,
})

export default connect(mapStateToProps)(AssetsSearch)
