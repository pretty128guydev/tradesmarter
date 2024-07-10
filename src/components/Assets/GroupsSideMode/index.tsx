import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  AssetsGroupIconWrapper,
  AssetsGroupsItem,
  AssetsGroupsWrapper,
} from './styled'
import { AssetGroup } from './constants/groupsEnum'
import ThemedIcon from '../../ui/ThemedIcon'
import { AssetsGroupsItemData } from './constants/groups'
import { isLoggedIn } from '../../selectors/loggedIn'
import { actionShowModal, ModalTypes } from '../../../actions/modal'
import { t } from 'ttag'
import ScrollContainer from 'react-indiana-drag-scroll'

interface IAssetGroupsProps {
  selected: any
  onSetGroup: (value: any) => void
  colors: any
  loggedIn: boolean
  actionShowModal: (modalType: ModalTypes, args: any) => void
  lang: string
}

export interface IAssetGroupsItem {
  icon: string
  name: string
  nameEnglish: string
  group: AssetGroup
  authorizedOnly?: boolean
}

const AssetGroupsSideMode = ({
  onSetGroup,
  colors,
  selected,
  loggedIn,
  actionShowModal,
  lang,
}: IAssetGroupsProps) => {
  const selectGroup = (item: IAssetGroupsItem) => {
    if (item.authorizedOnly && !loggedIn) {
      actionShowModal(ModalTypes.SESSION_EXPIRED, {})
      return
    }

    onSetGroup(item.group)
  }

  const [assetsGroups, setAssetsGroups] =
    useState<IAssetGroupsItem[]>(AssetsGroupsItemData)

  const getTranslatedName = (name: string) => {
    switch (name) {
      case 'Favorites':
        return t`Favorites`
      case 'Most traded':
        return t`Most traded`
      case 'Recently traded':
        return t`Recently traded`
      case 'Top riser/fallen':
        return t`Top riser/fallen`
      case 'Crypto':
        return t`Crypto`
      case 'Currencies':
        return t`Currencies`
      case 'Stocks':
        return t`Stocks`
      case 'Commodities':
        return t`Commodities`
      case 'Indices':
        return t`Indices`
    }
  }

  useEffect(() => {
    setAssetsGroups(
      AssetsGroupsItemData.map((data: any) => {
        const name = getTranslatedName(data.nameEnglish)
        return {
          ...data,
          name,
        }
      })
    )
  }, [lang])

  return (
    <AssetsGroupsWrapper>
      <ScrollContainer className="scroll-container">
        {assetsGroups.map((item, i) => (
          <AssetsGroupsItem
            key={i}
            selected={item.group === selected}
            colors={colors}
            onClick={() => selectGroup(item)}
          >
            <AssetsGroupIconWrapper colors={colors}>
              <ThemedIcon
                width={16}
                height={16}
                fill={colors.primary}
                src={`${process.env.PUBLIC_URL}/static/icons/asset_types/${item.icon}.svg`}
              />
            </AssetsGroupIconWrapper>
            <p>{item.name}</p>
          </AssetsGroupsItem>
        ))}
      </ScrollContainer>
    </AssetsGroupsWrapper>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  loggedIn: isLoggedIn(state),
  lang: state.registry.data.lang,
})

export default connect(mapStateToProps, { actionShowModal })(
  AssetGroupsSideMode
)
