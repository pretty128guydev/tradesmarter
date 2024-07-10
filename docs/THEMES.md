# Themes
## Theme
Theme recieved in get-registry->theme as JSON of keys, format as meaningfull single level JSON object:
https://github.com/Tradesmarter/options6/blob/main/src/components/ThemeContext.tsx#L8
All colors are in hex format, you can rgb, rgba with no issues.

Theme configuration could be found in Tools->Risk->Config in CRM with component: option6.

```
{
	"default": {
		"background": "#06141f",
		"panelBackground": "#141f2c",
		"panelBorder": "#263346",
		"modalBackground": "#1e2836",
		"listBackgroundActive": "#1c2837",
		"listBackgroundNormal": "#0f1721",
		"sidebarBorder": "#38424d",
		"sidebarElementActive": "#1d2834",
		"sidebarLabelText": "#8b9097",
		"sidebarDisabled": "#8191a5",
		"payout": "#75f986",
		"primary": "#75f986",
		"primaryText": "#ffffff",
		"primaryTextContrast": "#031420",
		"secondary": "#ff0062",
		"secondaryText": "#8491a3",
		"secondarySubText": "#e0e1e2",
		"textfieldBackground": "#0d1722",
		"textfieldText": "#9fabbd",
		"tradebox": {
			"widgetBackgrond": "#1d2834",
			"expiryBackground": "#06141f",
			"highText": "#75f986",
			"lowText": "#ff0062",
			"highlowDepressedTextColor": "#031420",
			"highActive": "#75f986",
			"highNormal": "#1d6b45",
			"highHover":
				"linear-gradient(to bottom, rgba(117, 249, 134, 0.8), #3d9f5d 53%, #1d6b45)",
			"highDepressed": "#1d6b45",
			"lowActive": "#ff0062",
			"lowNormal": "#61253a",
			"lowHover":
				"linear-gradient(to bottom, rgba(255, 0, 98, 0.8), #a6154c 49%, #61253a)",
			"lowDepressed": "#61253a",
			"btnDisabled": "#1d6b45",
			"btnDisabledText": "rgba(3, 20, 32, 0.8)",
			"btnNormal": "#75f986",
			"btnNormalText": "#031420"
		},
		"chart": {
			"xAxis": {
				"gridLineColor": "#263346",
				"lineColor": "#263346"
			},
			"crosshair": {
				"color": "#FFFFFF"
			},
			"yAxis": {
				"gridLineColor": "#263346",
				"lineColor": "#263346"
			},
			"series": {
				"markerFillColor": "#FFFFFF"
			},
			"plotOptions": {
				"line": {
					"color": "#75f986"
				},
				"area": {
					"color": "#75f986",
					"linearGradientUp": "rgba(117, 249, 134, 0.5)",
					"linearGradientDown": "rgba(117, 249, 134, 0)"
				},
				"ohlc": {
					"color": "#75f986"
				},
				"candlestick": {
					"color": "#ff3364",
					"lineColor": "#ff3364",
					"upColor": "#75f986",
					"upLineColor": "#75f986"
				},
				"flags": {
					"backgroundColor": "#1d2834",
					"closedColor": "#FFFFFF",
					"breakEvenColor": "#FFFFFF"
				}
			},
			"tooltip": {
				"backgroundColor": "#FFFFFF",
				"color": "#1d2834"
			},
			"navigator": {
				"seriesLineColor": "#75f986",
				"outlineColor": "transparent",
				"maskFill": "#141f2c"
			},
			"pulseMarker": {
				"color": "#75f986"
			},
			"priceLine": {
				"color": "#75f986"
			},
			"expiryLine": {
				"color": "#FFFFFF"
			},
			"deadPeriodLine": {
				"color": "#FFFFFF"
			},
			"quoteBand": {
				"upGradient0": "rgba(117, 249, 134, 0)",
				"upGradient1": "rgba(117, 249, 134, 0.2)",
				"downGradient0": "rgba(255, 51, 100, 0)",
				"downGradient1": "rgba(255, 51, 100, 0.2)"
			},
			"plotBorderColor": "#1d2834"
		}
	}
}
```

## Color tool
Injects a ThemeProvider/Consumer into group of components with Interactive picker:
You can open this picker by typing in browser console:
```
window.openThemeConfigurator()
```
## SVG
Use [this method](https://dev.to/abachi/how-to-change-svg-s-color-in-react-42g2) to paint icons.
Replace paintable attributes like fill and stroke to "current", example:
```
<path fill="current" stroke="current" stroke-width="2" d="M32.508,5.037C31.959,4.582,28.962,1.96,28.4,1.5a3.257,3.257,0,0,0-2.05-.5H8.447a3.263,3.263,0,0,0-2.05.5c-.56.462-3.557,3.086-4.106,3.54a2.216,2.216,0,0,0-.863,2.119c.147.98,3.516,24.286,3.6,24.841a1.228,1.228,0,0,0,1.206,1H28.562a1.228,1.228,0,0,0,1.206-1c.087-.553,3.457-23.861,3.605-24.841A2.22,2.22,0,0,0,32.508,5.037ZM17.4,20.508c-6.043,0-7.336-8.171-7.6-9.854h3.418c.513,2.455,1.682,6.656,4.186,6.656s3.674-4.2,4.186-6.656H25C24.735,12.337,23.442,20.508,17.4,20.508ZM4.693,6.344,8.1,2.778H26.7l3.4,3.566Z" transform="translate(-0.397)" />
```
Import and pass props:
```
import { ReactComponent as Logo } from "./logo.svg";
const App = () => (
  <div>
    {/* Logo is an actual React component */}
    <Logo fill="red" stroke="green" />
  </div>
);
```
