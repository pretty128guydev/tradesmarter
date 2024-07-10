import { action } from 'typesafe-actions'

const entity = 'theme'

const THEME_UPDATE = `${entity}/UPDATE`
const THEME_SET = `${entity}/SET`

const actionSetTheme = (theme: any) => action(THEME_SET, theme)
const actionUpdateTheme = (key: string, value: string) =>
	action(THEME_UPDATE, { key, value })

export { THEME_UPDATE, THEME_SET, actionSetTheme, actionUpdateTheme }
