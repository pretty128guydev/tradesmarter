import { AssetGroup } from './groupsEnum'
import { IAssetGroupsItem } from '../index'
import { t } from 'ttag'

export const AssetsGroupsItemData: IAssetGroupsItem[] = [
  {
    icon: 'Favorites',
    name: t`Favorites`,
    nameEnglish: 'Favorites',
    group: AssetGroup.favorites,
    authorizedOnly: true,
  },
  {
    icon: 'MostTraded',
    name: t`Most traded`,
    nameEnglish: 'Most traded',
    group: AssetGroup.mostTraded,
  },
  {
    icon: 'RecentlyAdded',
    name: t`Recently traded`,
    nameEnglish: 'Recently traded',
    group: AssetGroup.recentlyAdded,
  },
  {
    icon: 'GainersLosers',
    name: t`Top riser/fallen`,
    nameEnglish: 'Top riser/fallen',
    group: AssetGroup.gainersLosers,
  },
  {
    icon: 'Crypto',
    name: t`Crypto`,
    nameEnglish: 'Crypto',
    group: AssetGroup.crypto,
  },
  {
    icon: 'Currencies',
    name: t`Currencies`,
    nameEnglish: 'Currencies',
    group: AssetGroup.forex,
  },
  {
    icon: 'Candles',
    name: t`Stocks`,
    nameEnglish: 'Stocks',
    group: AssetGroup.stocks,
  },
  {
    icon: 'Commodities',
    name: t`Commodities`,
    nameEnglish: 'Commodities',
    group: AssetGroup.commodities,
  },
  {
    icon: 'Indices',
    name: t`Indices`,
    nameEnglish: 'Indices',
    group: AssetGroup.indices,
  },
]
