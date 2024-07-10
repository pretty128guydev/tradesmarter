/**
 * Implements a generic news feed which receives RSS url
 */
import React, { useState, useEffect } from 'react'
import NewsFeedItem from './NewsFeedItem'
import { api } from '../../../core/createAPI'
import { ArticleList } from './styled'

interface INewsFeedContentsProps {
	feed: string
}
export interface IArticle {
	category: string // ""
	content: string // "This post was originally published on this siteUSD/JPY Current price: 103.79↵↵Japanese National inflation contracted by more than anticipated in October.↵US Treasury Secretary Mnuchin asked the Fed to return unused funds.↵USD/JPY is trading near weekly lows without directional momentum.↵↵↵The USD/JPY pair consolidates weekly losses in the 103.70 price zone, amid the persistent dollar’s weakness. The American currency suffers from coronavirus-related jitters, as more US states impose restrictive measures to curb the spread of the virus.↵Late Thursday, US Treasury Secretary Steven Mnuchin sent a letter to Fed’s chair Jerome Powell, asking to return unused funds from five emergency programs. It’s unclear what’s behind such a decision, particularly considering that the Federal Reserve has been calling for additional support for the economy. Mnuchin claims that Congress would then be able to use the money for other purposes.↵Japan published at the beginning of the day the October National inflation, &nbsp;which came in worse than anticipated at -0.4% YoY. The core CPI matched expectations printing -0.7% YoY. The country also released the November preliminary Jibun Bank Manufacturing PMI that contracted to 48.3 from 48.7. The US won’t publish macroeconomic data this Friday.↵USD/JPY short-term technical outlook↵The risk for the USD/JPY pair is on the downside. The 4-hour chart shows that the pair continues trading below a firmly bearish 20 SMA, which extended its decline below the larger ones. Technical indicators lack directional strength, holding within negative levels. The immediate support level is 103.50, with a break below it exposing the monthly low at 103.17.↵Support levels: 103.50 103.15 102.80↵Resistance levels: 104.00 104.30 104.75 &nbsp;↵&nbsp;View Live Chart for the USD/JPY↵"
	date: number // 1605868949000
	description: string // "This post was originally published on this siteUSD/JPY Current price: 103.79 Japanese National inflation contracted by more than anticipated in October. US Treasury Secretary Mnuchin asked the Fed to return unused funds. USD/JPY is trading near weekly lows without directional momentum. The USD/JPY pair consolidates weekly losses in the 103.70 price zone, amid the persistent [...]↵The post USD/JPY Forecast: Consolidating losses, risk skewed to the downside first appeared on Financial Feeds."
	id: number // 0
	image: string | null
	title: string // "USD/JPY Forecast: Consolidating losses, risk skewed to the downside"
}

const NewsFeedContents = (props: INewsFeedContentsProps) => {
	const [articles, setItems] = useState<IArticle[]>([])
	let [selected, setSelected] = useState<number | null>(null)

	/**
	 * Each time we mount component, we need to reset items to avoid glimmering
	 */
	useEffect(() => {
		const params = {
			timestamp: Number(new Date()),
		}

		const fetchFn = async () => {
			setItems([])
			setSelected(null)
			const data = await api.getJson(props.feed, params)
			setItems(data[0] ? data[0].articles : [])
		}
		fetchFn()
	}, [props.feed])

	return (
		<ArticleList className="scrollable">
			{articles.map((article: IArticle, index: number) => (
				<NewsFeedItem
					article={article}
					key={index}
					selected={selected === article.id}
					select={(id) => setSelected(id)}
				/>
			))}
		</ArticleList>
	)
}

export default NewsFeedContents
