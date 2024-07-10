/**
 * Implements a theme modal
 * Call: window.openThemeConfigurator()
 */
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { actionCloseModal } from '../../../actions/modal'
import { actionUpdateTheme } from '../../../actions/theme'
import { Button } from 'react-md'
import { ThemeContextConsumer } from '../../ThemeContext'
import { Text } from '@react-md/typography'

const ThemeModalPanel = styled.div`
	position: fixed;
	z-index: 999;
	left: 0;
	top: 0;
	bottom: 0;
	display: block;
	background: #ffffff;
	color: #333333;
	width: 500px;
	opacity: 0.9;
	overflow-y: scroll;
`
const Container = styled.div`
	display: block;
	margin: 10px;

	textarea {
		width: 100%;
	}
`

const ColorPin = styled.div<any>`
	display: block;
	width: 20px;
	height: 20px;
	border: 1px solid #333;
	background-color: ${(props) => props.color};
`

interface IThemeConfigProps {
	theme: any
	actionCloseModal: () => void
	actionUpdateTheme: (field: string, value: string) => void
}

/**
 * Regulates set for object
 * @param props
 */
const ThemeContentsObject = ({ field, value, onChange }: any) => {
	const subKeys = Object.keys(value)
	return (
		<>
			{subKeys.map((subkey: string) => {
				const val = value[subkey]
				const editable = typeof val === 'string'
				return (
					<tr key={subkey}>
						<td>
							{field}.{subkey}
						</td>
						<td>
							{editable && (
								<input
									id={subkey}
									type="text"
									defaultValue={val}
									onChange={(e) =>
										onChange(field, {
											...value,
											[subkey]: e.target.value,
										})
									}
								/>
							)}
							{!editable && (
								<textarea
									onChange={(e) =>
										onChange(field, {
											...value,
											[subkey]: JSON.parse(
												e.target.value
											),
										})
									}
								>
									{JSON.stringify(val)}
								</textarea>
							)}
						</td>
						<td>{editable && <ColorPin color={val} />}</td>
					</tr>
				)
			})}
		</>
	)
}

/**
 * Contents of the theme containing actual values
 * @param props
 */
const ThemeContents = (props: any) => {
	const keys = Object.keys(props.theme)

	/**
	 * Change theme
	 * @param field
	 * @param value
	 */
	const onChange = (field: string, value: string) =>
		props.onUpdate(field, value)

	return (
		<Container>
			<Text type="subtitle-2">Colors</Text>
			<table>
				<tbody>
					{keys.map((key: string) => {
						const value = props.theme[key]
						if (typeof value === 'string') {
							return (
								<tr key={key}>
									<td>{key}</td>
									<td>
										<input
											id={key}
											type="text"
											defaultValue={props.theme[key]}
											onChange={(e) =>
												onChange(key, e.target.value)
											}
										/>
									</td>
									<td>
										<ColorPin color={props.theme[key]} />
									</td>
								</tr>
							)
						}
						return (
							<ThemeContentsObject
								field={key}
								value={props.theme[key]}
								onChange={onChange}
							/>
						)
					})}
				</tbody>
			</table>
		</Container>
	)
}
/**
 * Text area where theme is serialized
 * @param props
 */
const ThemeSerialization = (props: any) => (
	<Container>
		<Text type="subtitle-2">JSON</Text>
		<textarea readOnly value={JSON.stringify(props.theme)} />
	</Container>
)

/**
 * Component which holds all together
 * @param props
 */
const ThemeConfig = (props: IThemeConfigProps) => (
	<ThemeModalPanel>
		<Button onClick={() => props.actionCloseModal()}>close</Button>
		<ThemeContextConsumer>
			{(context) => (
				<>
					<ThemeContents
						theme={context}
						onUpdate={(key: string, value: string) =>
							props.actionUpdateTheme(key, value)
						}
					/>
					<ThemeSerialization theme={context} />
				</>
			)}
		</ThemeContextConsumer>
	</ThemeModalPanel>
)

export default connect(null, { actionCloseModal, actionUpdateTheme })(
	ThemeConfig
)
