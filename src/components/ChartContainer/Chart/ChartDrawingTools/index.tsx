import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import { ReactComponent as Tools } from './tools.svg'
import Backdrop from '../../../Backdrop'
import { ChartButton } from '../styled'
import {
  ActionsBar,
  Items,
  ListContainer,
  ListItem,
  CustomAnnotationToolbar,
} from './styled'
import { ReactComponent as UndoIcon } from './undo.svg'
import { ReactComponent as RedoIcon } from './redo.svg'
import { ReactComponent as EditIcon } from './edit.svg'
import { ReactComponent as DestroyIcon } from './destroy.svg'
import FillIcon from '../../../ui/ThemedIcon'
import { connect } from 'react-redux'

const items = [
  {
    title: t`Label`,
    titleEnglish: `Label`,
    class: 'highcharts-label-annotation',
    icon: 'chart-label',
  },
  {
    title: t`Circle`,
    titleEnglish: `Circle`,
    class: 'highcharts-circle-annotation',
    icon: 'chart-circle',
  },
  {
    title: t`Rectangle`,
    titleEnglish: `Rectangle`,
    class: 'highcharts-rectangle-annotation',
    icon: 'chart-rectangle',
  },
  {
    title: t`Segment`,
    titleEnglish: `Segment`,
    class: 'highcharts-segment',
    icon: 'chart-segment',
  },
  {
    title: t`Arrow segment`,
    titleEnglish: `Arrow segment`,
    class: 'highcharts-arrow-segment',
    icon: 'chart-arrow-segment',
  },
  {
    title: t`Ray`,
    titleEnglish: `Ray`,
    class: 'highcharts-ray',
    icon: 'chart-ray',
  },
  {
    title: t`Arrow ray`,
    titleEnglish: `Arrow ray`,
    class: 'highcharts-arrow-ray',
    icon: 'chart-arrow-ray',
  },
  {
    title: t`Horizontal line`,
    titleEnglish: `Horizontal line`,
    class: 'highcharts-horizontal-line',
    icon: 'chart-horizontal-line',
  },
  {
    title: t`Vertical line`,
    titleEnglish: `Vertical line`,
    class: 'highcharts-vertical-line',
    icon: 'chart-vertical-line',
  },
  {
    title: t`Elliot 3`,
    titleEnglish: `Elliot 3`,
    class: 'highcharts-elliott3',
    icon: 'chart-elliott-3',
  },
  {
    title: t`Elliot 5`,
    titleEnglish: `Elliot 5`,
    class: 'highcharts-elliott5',
    icon: 'chart-elliott-5',
  },
  {
    title: t`Crooked 3`,
    titleEnglish: `Crooked 3`,
    class: 'highcharts-crooked3',
    icon: 'chart-crooked-3',
  },
  {
    title: t`Crooked 5`,
    titleEnglish: `Crooked 5`,
    class: 'highcharts-crooked5',
    icon: 'chart-crooked-5',
  },
  {
    title: t`Measure XY`,
    titleEnglish: `Measure XY`,
    class: 'highcharts-measure-xy',
    icon: 'chart-measure-xy',
  },
  {
    title: t`Measure Y`,
    titleEnglish: `Measure Y`,
    class: 'highcharts-measure-y',
    icon: 'chart-measure-y',
  },
  {
    title: t`Measure X`,
    titleEnglish: `Measure X`,
    class: 'highcharts-measure-x',
    icon: 'chart-measure-x',
  },
  /* {
	title: 'Fibonacci',
	class: 'highcharts-fibonacci',
	icon: 'chart-fibonacci'
  },*/
  {
    title: t`Pitchfork`,
    titleEnglish: `Pitchfork`,
    class: 'highcharts-pitchfork',
    icon: 'chart-pitchfork',
  },
  {
    title: t`Parallel channel`,
    titleEnglish: `Parallel channel`,
    class: 'highcharts-parallel-channel',
    icon: 'chart-parallel-channel',
  },
  {
    title: t`Vertical counter`,
    titleEnglish: `Vertical counter`,
    class: 'highcharts-vertical-counter',
    icon: 'chart-vertical-counter',
  },
  {
    title: t`Vertical label`,
    titleEnglish: `Vertical label`,
    class: 'highcharts-vertical-label',
    icon: 'chart-vertical-counter',
  },
  {
    title: t`Vertical arrow`,
    titleEnglish: `Vertical arrow`,
    class: 'highcharts-vertical-arrow',
    icon: 'chart-vertical-counter',
  },
]

interface IDrawingToolsProps {
  colors: any
  isMobile: boolean
  removeAllAnnotations: () => void
  calculateAnnotations: () => void
  toggleAnnotation: (visibility: boolean) => void
  lang: string
}

const DrawingTools = (props: IDrawingToolsProps) => {
  const [visibility, setVisibility] = useState<boolean>(false)
  const [left, setLeft] = useState(0)
  const [translatedItems, setTranslatedItems] = useState<any>(items)

  const getTranslatedTitle = (title: string) => {
    switch (title) {
      case 'Label':
        return t`Label`
      case 'Circle':
        return t`Circle`
      case 'Rectangle':
        return t`Rectangle`
      case 'Segment':
        return t`Segment`
      case 'Arrow segment':
        return t`Arrow segment`
      case 'Ray':
        return t`Ray`
      case 'Arrow ray':
        return t`Arrow ray`
      case 'Horizontal line':
        return t`Horizontal line`
      case 'Vertical line':
        return t`Vertical line`
      case 'Elliot 3':
        return t`Elliot 3`
      case 'Elliot 5':
        return t`Elliot 5`
      case 'Crooked 3':
        return t`Crooked 3`
      case 'Crooked 5':
        return t`Crooked 5`
      case 'Measure XY':
        return t`Measure XY`
      case 'Measure Y':
        return t`Measure Y`
      case 'Measure X':
        return t`Measure X`
      case 'Pitchfork':
        return t`Pitchfork`
      case 'Parallel channel':
        return t`Parallel channel`
      case 'Vertical counter':
        return t`Vertical counter`
      case 'Vertical label':
        return t`Vertical label`
      case 'Vertical arrow':
        return t`Vertical arrow`
      default:
        return title
    }
  }

  useEffect(() => {
    setTranslatedItems(
      translatedItems.map((t: any) => {
        return {
          ...t,
          title: getTranslatedTitle(t.titleEnglish),
        }
      })
    )
  }, [props.lang])

  const onTools = (event: any) => {
    setLeft(event.target.getBoundingClientRect().left)

    setVisibility(true)
    props.calculateAnnotations()
  }

  return (
    <>
      <ChartButton isMobile={props.isMobile} colors={props.colors}>
        <div style={{ display: 'flex' }}>
          <Tools onClick={onTools} />
        </div>
      </ChartButton>
      <ListContainer
        className="tools-container scrollable"
        style={{ left, display: visibility ? '' : 'none' }}
        colors={props.colors}
        isMobile={props.isMobile}
      >
        <ActionsBar>
          <div onClick={() => props.toggleAnnotation(false)}>
            <UndoIcon fill="#9dabbf" />
          </div>
          <div onClick={() => props.toggleAnnotation(true)}>
            <RedoIcon fill="#9dabbf" />
          </div>
        </ActionsBar>
        <Items className="scrollable">
          {translatedItems.map((item: any) => (
            <ListItem
              colors={props.colors}
              key={item.class}
              className={item.class}
              onClick={() => setVisibility(false)}
            >
              <FillIcon
                fill="#FFFFFF"
                src={`${process.env.PUBLIC_URL}/static/icons/chart/${item.icon}.svg`}
              />
              <span>{item.title}</span>
            </ListItem>
          ))}
        </Items>
        <ListItem
          colors={props.colors}
          onClick={() => props.removeAllAnnotations()}
        >
          <div />
          {t`Clear All`}
        </ListItem>
      </ListContainer>
      {visibility && <Backdrop onClick={() => setVisibility(false)} />}
      <CustomAnnotationToolbar
        className="highcharts-popup custom-annotation-toolbar"
        colors={props.colors}
      >
        <EditIcon id="toolbar-edit-icon" />
        <DestroyIcon id="toolbar-destroy-icon" />
      </CustomAnnotationToolbar>
      <style>
        {`
					.highcharts-popup button.highcharts-annotation-edit-button {
						background-color: ${props.colors.panelBorder};
					}

					.highcharts-popup button.highcharts-annotation-remove-button  {
						background-color: ${props.colors.panelBorder};
					}

					.highcharts-popup {
						background-color: ${props.colors.panelBorder};
						color: ${props.colors.primaryText};
					}

					.highcharts-popup input {
						background-color: ${props.colors.background};
						color: ${props.colors.primaryText};
					}

					.highcharts-popup-bottom-row button {
						background-color: ${props.colors.primary};
						color: ${props.colors.primaryTextContrast};
					}

					.highcharts-popup button.highcharts-annotation-remove-button,
					.highcharts-popup button.highcharts-annotation-edit-button {
						color: ${props.colors.primaryText};
					}

					.highcharts-popup button.highcharts-annotation-remove-button:hover,
					.highcharts-popup button.highcharts-annotation-edit-button:hover {
						background-color: ${props.colors.background} !important;
					}
				`}
      </style>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  lang: state.registry.data.lang,
})

export default connect(mapStateToProps)(DrawingTools)
