import React, { useEffect, useRef, useState } from 'react'
import DailyAnalysisItem from './DailyAnalysisItem'
import { ListWrapper } from './styled'

interface IDailyAnalysisListProps {
	selectedInstrument: any
	forceLoad: boolean
}

interface IListItems {
	name: string
	dateMs: number
}

const DAY_TIME_STEP = 1000 * 60 * 60 * 24 // milliseconds * seconds * hour * day
const NEWS_DAYS = 8

const listItems = (instruments: string[]): IListItems[] => {
	const todayDate = new Date()
	const date = todayDate.getTime() + todayDate.getTimezoneOffset() * 1000
	const dates = new Array(NEWS_DAYS)
		.fill('')
		.map((item, index) => date - index * DAY_TIME_STEP)

	return dates.reduce((acc: IListItems[], date) => {
		const dateNews = instruments.map((name: any) => ({
			name,
			dateMs: date,
		}))
		return acc.concat(dateNews)
	}, [])
}

const DailyAnalysisList = ({
	selectedInstrument,
	forceLoad,
}: IDailyAnalysisListProps) => {
	const instruments = [
		'EURUSD',
		'GBPUSD',
		'USDCAD',
		'USDJPY',
		'USDCHF',
		'AUDUSD',
		'NZDUSD',
	]
	const dailyAnalysisItems = listItems(instruments)
	const listWrapperRef = useRef<any>(null)
	const [wrapperViewPort, setWrapperViewPort] = useState<any>({
		top: 0,
		height: 0,
	})
	const [errorList, setErrorList] = useState<string[]>([])

	const setViewPort = () => {
		if (listWrapperRef.current) {
			const {
				scrollTop: top,
				clientHeight: height,
			} = listWrapperRef.current
			setWrapperViewPort({ top, height })
		}
	}

	useEffect(() => {
		if (listWrapperRef) {
			// const instrumentIndex = errorList.includes(selectedInstrument)
			// 	? instruments.indexOf(selectedInstrument) + instruments.length
			// 	: instruments.indexOf(selectedInstrument)

			const item = document.getElementById(selectedInstrument)

			item?.scrollIntoView({ behavior: 'smooth' })
		}
		setViewPort()
	}, [listWrapperRef, errorList])

	return (
		<ListWrapper
			className="scrollable"
			ref={listWrapperRef}
			onScroll={setViewPort}
		>
			{dailyAnalysisItems.map(({ name, dateMs }, index) => (
				<DailyAnalysisItem
					forceLoad={forceLoad && index <= instruments.length}
					wrapperViewPort={wrapperViewPort}
					id={name}
					key={index}
					name={name}
					date={dateMs}
					onError={() => {
						setViewPort()
						setErrorList([...errorList, name + index])
					}}
				/>
			))}
		</ListWrapper>
	)
}

export default DailyAnalysisList
