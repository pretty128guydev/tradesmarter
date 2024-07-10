import React, { useState } from 'react'
import { t } from 'ttag'
import { includes, toLower } from 'lodash'
import { ListItem } from '@react-md/list'
import { connect } from 'react-redux'
import { MenuContainer, MenuTitle, SearchGroup, Items } from './styled'
import { IIndicatorMenuItem, serializeIndicator } from '../../menuItems'
import { TabTypes } from '../Tabs'
import { ReactComponent as SearchIcon } from '../../../Instruments/search.svg'
import { ReactComponent as StarIcon } from '../../icons/favorites-active.svg'
import { ReactComponent as UnStarIcon } from '../../icons/favorites-normal.svg'

interface IItemMenuProps {
	colors: any
	isLoggedIn: boolean
	favorites: any[]
	menuItems: IIndicatorMenuItem[]
	item: IIndicatorMenuItem | null
	activeTab: TabTypes
	onItem: (item: IIndicatorMenuItem) => void
	onFavoritesChange: (items: any[]) => void
}

/**
 * Button which check if this item is present in favorites and changes it mode
 */
const FavoriteButton = ({
	item,
	favorites,
	onAddFavorite,
	onRemoveFavorite,
}: any) => {
	const isFavorite = !!favorites.filter(
		(favoriteItem: any) => favoriteItem.id === item.id
	)[0]

	if (isFavorite) {
		return (
			<StarIcon
				onClick={(e: any) => {
					e.stopPropagation()
					onRemoveFavorite(item)
				}}
			/>
		)
	}

	return (
		<UnStarIcon
			onClick={(e: any) => {
				e.stopPropagation()
				onAddFavorite(item)
			}}
		/>
	)
}

const ItemMenu = ({
	favorites,
	menuItems,
	item,
	activeTab,
	isLoggedIn,
	onItem,
	onFavoritesChange,
	colors,
}: IItemMenuProps) => {
	const [value, onSet] = useState<string>('')

	let menuTitle = ''
	switch (activeTab) {
		case TabTypes.tabAll:
			menuTitle = t`All Indicators`
			break
		case TabTypes.tabFavorites:
			menuTitle = t`Favorites`
			break
		case TabTypes.tabInUse:
			menuTitle = t`Currently in use`
			break
		default:
			menuTitle = t`All Indicators`
			break
	}

	const itemId = item ? serializeIndicator(item.type, item.params) : ''

	const onAddItemToFavorites = (item: any) =>
		onFavoritesChange([...favorites, item])

	const onRemoveItemFromFavorites = (item: any) =>
		onFavoritesChange(
			favorites.filter((favoriteItem: any) => favoriteItem.id !== item.id)
		)

	return (
		<MenuContainer>
			<MenuTitle>{menuTitle}</MenuTitle>
			<SearchGroup>
				<SearchIcon width="24" height="24" fill="#9fabbd" />
				<input
					type="text"
					onChange={(e: any) => onSet(e.target.value)}
					value={value}
					placeholder={t`Search...`}
				/>
			</SearchGroup>
			<Items colors={colors} className="scrollable">
				{menuItems
					.filter((menuItem) =>
						includes(toLower(menuItem.name), toLower(value))
					)
					.map((menuItem) => ({
						...menuItem,
						id: serializeIndicator(menuItem.type, menuItem.params),
					}))
					.map((menuItem) => (
						<ListItem
							key={menuItem.id}
							onClick={() => onItem(menuItem)}
							className={menuItem.id === itemId ? 'active' : ''}
							primaryText={menuItem.name}
							rightAddon={
								isLoggedIn ? (
									<FavoriteButton
										item={menuItem}
										favorites={favorites}
										onAddFavorite={onAddItemToFavorites}
										onRemoveFavorite={
											onRemoveItemFromFavorites
										}
									/>
								) : null
							}
						/>
					))}
			</Items>
		</MenuContainer>
	)
}

const mapStateToProps = (state: any) => ({ colors: state.theme })
export default connect(mapStateToProps)(ItemMenu)
