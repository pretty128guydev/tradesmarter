import { onLanguageSelect } from '../../core/language'
import { List, ListItem } from 'react-md'
import React from 'react'

interface ILanguageListProps {
	langs: any
	onSelect: () => void
}

const LanguageList = (props: ILanguageListProps) => {
	const languageKeys = Object.keys(props.langs)

	const setLanguage = (url: string) => {
		props.onSelect()
		onLanguageSelect(url)
	}

	return (
		<List>
			{languageKeys.map((key: string) => {
				const { name, url } = props.langs[key]
				return (
					<ListItem
						key={key}
						onClick={() => setLanguage(url)}
						leftAddon={
							<img
								src={`${process.env.PUBLIC_URL}/static/icons/languages/${key}.svg`}
								alt={`switch to ${name}`}
							/>
						}
						leftAddonType="avatar"
					>
						{name}
					</ListItem>
				)
			})}
		</List>
	)
}

export { LanguageList }
