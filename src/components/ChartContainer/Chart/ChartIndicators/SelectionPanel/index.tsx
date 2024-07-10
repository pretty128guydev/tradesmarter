/**
 * Implements an indicator modal
 * If user is not logged in - hide add/remove to favorites behavior
 */
import React, { useEffect, useState, useContext } from 'react'
import { IIndicatorMenuItem, IIndicatorParam } from '../menuItems'
import { PanelContainer, MenuContainer, ExplorerContainer } from './styled'
import Tabs, { TabTypes } from './Tabs'
import ItemMenu from './ItemMenu'
import ItemExplorer from './ItemExplorer'
import UserStorage from '../../../../../core/UserStorage'
import { IndicatorsContext } from '../../../Chart'

interface ISelectionPanelProps {
  isLoggedIn: boolean
  indicators: any[]
  menuItems: IIndicatorMenuItem[]
  isMobile: boolean
  setVisibility: (b: boolean) => void
  colors: any
}

const SelectionPanel = ({
  indicators,
  menuItems,
  isLoggedIn,
  isMobile,
  setVisibility,
  colors,
}: ISelectionPanelProps) => {
  const [tab, setTab] = useState<TabTypes>(TabTypes.tabAll)
  const [item, setItem] = useState<IIndicatorMenuItem | null>(menuItems[0])
  const [itemVisability, setItemVisability] = useState<boolean>(false)
  const [favorites, setFavorites] = useState<any[]>([])
  const {
    addIndicator,
    removeIndicator,
    updateIndicator,
    toggleIndicator,
    getIndicatorVisibility,
  } = useContext(IndicatorsContext)

  /**
   * Fetch favourites on component mount
   */
  useEffect(() => {
    setFavorites(UserStorage.getFavouriteIndicators())
  }, [])

  const getVisibility = (indicator: IIndicatorMenuItem): boolean => {
    return getIndicatorVisibility(indicator)
  }

  const getDisplayItems = (tab: TabTypes): any[] => {
    switch (tab) {
      case TabTypes.tabAll:
        return menuItems
      case TabTypes.tabFavorites:
        return favorites
      case TabTypes.tabInUse:
        return indicators
      default:
        return menuItems
    }
  }

  const onFavoritesChange = (newFavorites: any[]) => {
    setFavorites(newFavorites)
    UserStorage.setFavouriteIndicators(newFavorites)
  }

  const onItem = (itemToSelect: IIndicatorMenuItem) => {
    setItem(itemToSelect)
    if (itemToSelect) setItemVisability(getVisibility(itemToSelect))
  }

  const onAdd = (params: IIndicatorParam[]) => {
    if (item) addIndicator({ ...item, params })
    if (item && isMobile) setVisibility(false)
  }

  const onUpdate = (params: IIndicatorParam[]) => {
    if (item) updateIndicator(item, params)
  }

  const onRemove = () => {
    if (item) {
      setItem(null)
      removeIndicator(item)
    }
  }

  const onToggle = () => {
    if (item) {
      toggleIndicator(item)
      setItemVisability(!itemVisability)
    }
  }

  const onTab = (tab: TabTypes) => {
    const [newItem] = getDisplayItems(tab)

    setTab(tab)
    onItem(newItem)
  }

  const displayItems = getDisplayItems(tab)

  return (
    <PanelContainer isMobile={isMobile} colors={colors}>
      <MenuContainer isMobile={isMobile}>
        <Tabs active={tab} setActive={onTab} />
        <ItemMenu
          isLoggedIn={isLoggedIn}
          activeTab={tab}
          menuItems={displayItems}
          favorites={favorites}
          onFavoritesChange={onFavoritesChange}
          item={item}
          onItem={onItem}
        />
      </MenuContainer>
      <ExplorerContainer isMobile={isMobile}>
        <ItemExplorer
          isMobile={isMobile}
          item={item}
          itemVisability={itemVisability}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onToggle={onToggle}
          tab={tab}
        />
      </ExplorerContainer>
    </PanelContainer>
  )
}

export default SelectionPanel
