/**
 * Entry-point holds routing Table
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { store, history } from './store'
import App from './App'
import { ThemeContextProvider } from './components/ThemeContext'
import './core/fingerprint'
import './index.scss'

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<ThemeContextProvider>
					<App />
				</ThemeContextProvider>
			</ConnectedRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
