import { THEME_SET, THEME_UPDATE } from '../actions/theme'
import { defaultTheme } from '../components/ThemeContext'

const changeTheme = (state: any, { key, value }: any) => {
	return {
		...state,
		[key]: value,
	}
}

const themeReducer = (state: any = defaultTheme, action: any) => {
	switch (action.type) {
		case THEME_SET:
			return action.payload
		case THEME_UPDATE:
			return changeTheme(state, action.payload)
		default:
			return state
	}
}

export default themeReducer
