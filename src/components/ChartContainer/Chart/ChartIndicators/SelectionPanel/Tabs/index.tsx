import React from 'react'
import { connect } from 'react-redux'
import { ReactComponent as tabAll } from './icons/tabAll.svg'
import { ReactComponent as tabFavoritesActive } from './icons/tabFavoritesActive.svg'
import { ReactComponent as tabInUse } from './icons/tabInUse.svg'
import { IconsContainer, IconContainer } from './styled'

export enum TabTypes {
	tabAll = 'tabAll',
	tabInUse = 'tabInUse',
	tabFavorites = 'tabFavorites',
}

interface TabItem {
	id: TabTypes
	icon: string
}

const icons: any = {
	tabAll: tabAll,
	tabInUse: tabInUse,
	tabFavoritesActive: tabFavoritesActive,
}

const tabs: TabItem[] = [
	{
		id: TabTypes.tabAll,
		icon: 'tabAll',
	},
	{
		id: TabTypes.tabFavorites,
		icon: 'tabFavoritesActive',
	},
	{
		id: TabTypes.tabInUse,
		icon: 'tabInUse',
	},
]

interface ITabsProps {
	colors: any
	active: TabTypes
	setActive: (input: TabTypes) => void
}

const Tabs = ({ colors, active, setActive }: ITabsProps) => {
	return (
		<IconsContainer>
			{tabs.map((tab) => {
				const Icon = icons[tab.icon]
				return (
					<IconContainer
						colors={colors}
						key={tab.id}
						onClick={() => setActive(tab.id)}
						className={tab.id === active ? 'active' : ''}
					>
						<Icon />
					</IconContainer>
				)
			})}
		</IconsContainer>
	)
}

const mapStateToProps = (state: any) => ({ colors: state.theme })
export default connect(mapStateToProps)(Tabs)
