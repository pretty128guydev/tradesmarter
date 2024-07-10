import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
	RecentUpdatesListDate,
	RecentUpdatesListDescription,
	RecentUpdatesListMore,
	RecentUpdatesListSpace,
	RecentUpdatesListTitle,
} from './styled'
import { RecentUpdateItem } from './RecentUpdateItem'
import { api } from '../../../core/createAPI'
import { LocaleDate } from '../../../core/localeFormatDate'

interface IRecentUpdatesListProps {
	colors: any
	newsUrl: string
}

const RecentUpdatesList = ({ colors, newsUrl }: IRecentUpdatesListProps) => {
	const [items, setItems] = useState<RecentUpdateItem[]>([])
	const [selected, setSelected] = useState<number | null>(null)

	useEffect(() => {
		const params = {
			timestamp: Number(new Date()),
		}

		const fetchFn = async () => {
			setItems([])
			const data = await api.getJson(newsUrl, params)
			setItems(data[0] ? data[0].articles : [])
		}
		fetchFn().then()
	}, [newsUrl])

	return (
		<RecentUpdatesListSpace colors={colors} className="scrollable">
			{items.map((item, key) => (
				<div key={key}>
					<RecentUpdatesListTitle colors={colors}>
						{item.title}
					</RecentUpdatesListTitle>
					<RecentUpdatesListDescription
						colors={colors}
						expanded={item.id === selected}
					>
						{item.content}
					</RecentUpdatesListDescription>
					<RecentUpdatesListDate colors={colors}>
						{LocaleDate.format(item.date, 'dd MMM u')}
						<RecentUpdatesListMore
							colors={colors}
							onClick={() =>
								item.id === selected
									? setSelected(null)
									: setSelected(item.id)
							}
						>
							{item.id === selected ? '-' : '+'}
						</RecentUpdatesListMore>
					</RecentUpdatesListDate>
				</div>
			))}
		</RecentUpdatesListSpace>
	)
}

const mapStateToProps = (state: any) => ({
	newsUrl: state.registry.data.partnerConfig.leftPanel.news.url,
	colors: state.theme,
})

export default connect(mapStateToProps)(RecentUpdatesList)
