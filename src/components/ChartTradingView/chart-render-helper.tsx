import { IGame } from '../../reducers/games'
import { IPeriod } from '../ChartContainer/Chart/period'

const getDeadPeriod = (gameTime: number, game: IGame, chartPeriod: IPeriod) => {
  if (!chartPeriod) return 0
  const { deadPeriod } = game
  return gameTime - deadPeriod * 1000
}

const getGameTime = (game: IGame | undefined, chartPeriod: IPeriod) => {
  if (!chartPeriod || !game) return 0
  const { timestamp } = game
  return Number(timestamp)
}

const getMaxGameTime = (
  maxExtendTime: number,
  gameTime: number,
  period: number,
  lastTime: number,
  isDeadTime: boolean = true
) => {
  let result = 0
  if (gameTime / 1000 > maxExtendTime) {
    result = isDeadTime ? maxExtendTime - 1000 * 8 : maxExtendTime - 1000 * 12
  } else {
    result = gameTime / 1000
  }

  const minTime = isDeadTime
    ? lastTime + period * 60 * 1000 * 2
    : lastTime + period * 60 * 1000
  if (gameTime < minTime) {
    result =
      (isDeadTime
        ? minTime + period * 60 * 1000 * 2
        : minTime + period * 60 * 1000) / 1000
  }
  return result - (result % (period * 60))
}

const overrideChartCss = (options: {
  upColor: string
  upColorCheckBoxBackground: string
  backgroundColor: string
}) => {
  return `
    .tab-Zcmov9JL.active-Zcmov9JL,
    .tab-Zcmov9JL.active-Zcmov9JL span,
    .button-YKkCvwjV.size-small-YKkCvwjV.color-brand-YKkCvwjV.variant-primary-YKkCvwjV {
      background-color: ${options.upColor} !important;
      color: #ffffff !important;
      border-color: ${options.upColor} !important;
    }
    .button-YKkCvwjV.size-small-YKkCvwjV.color-brand-YKkCvwjV.variant-secondary-YKkCvwjV {
      color: ${options.upColor} !important;
      border-color: ${options.upColor} !important;
      cursor: pointer;
    }
    .button-YKkCvwjV.size-small-YKkCvwjV.color-brand-YKkCvwjV.variant-secondary-YKkCvwjV:hover {
      color: #ffffff !important;
      border-color: ${options.upColor} !important;
      background-color: ${options.upColor} !important;
      cursor: pointer;
    }
    .inline-sFd8og5Y .isActive-4TFSfyGO .js-button-text,
    .inline-sFd8og5Y .isActive-4TFSfyGO .icon-4TFSfyGO,
    .sliderRow-DtHrLXA3.tabs-rKFlMYkc .isActive-3SbREAgE,
    .button-5-QHyx-s.isActive-5-QHyx-s .icon-5-QHyx-s,
    .highlighted-1Qud56dI.highlightedText-ZzQNZGNo,
    .symbolTitle-uhHv1IHJ .highlighted-1Qud56dI,
    .title-1gYObTuJ .highlighted-1Qud56dI,
    .tab-1KEqJy8_.tab-rKFlMYkc.active-rKFlMYkc,
    .tab-1KEqJy8_.tab-rKFlMYkc.active-rKFlMYkc:hover,
    .tab-1KEqJy8_.withHover-1KEqJy8_:hover
    {
      color: ${options.upColor} !important;
    }

    .day-U9DgB4FB.selected-U9DgB4FB.currentDay-U9DgB4FB,
    .item-4TFSfyGO.withIcon-4TFSfyGO.isActive-4TFSfyGO,
    .item-4TFSfyGO.isActive-4TFSfyGO,
    .centerElement-RnpzRzG6 .container-113jHcZc,
    .sliderRow-DtHrLXA3.tabs-rKFlMYkc .slider-rKFlMYkc.slider-3GYrNsPp .inner-3GYrNsPp,
    .dropdown-m5d9X7vB .item-4TFSfyGO.isActive-4TFSfyGO,
    .slider-eR7xmZ00.inner-eR7xmZ00,
    .item-4TFSfyGO.isActive-4TFSfyGO.hovered-4TFSfyGO,
    .day-U9DgB4FB.selected-U9DgB4FB.isOnHighlightedEdge-U9DgB4FB,
    .day-U9DgB4FB.isOnHighlightedEdge-U9DgB4FB.currentDay-U9DgB4FB,
    .day-U9DgB4FB::after,
    .day-U9DgB4FB.isOnHighlightedEdge-U9DgB4FB,
    .day-U9DgB4FB.selected-U9DgB4FB,
    .inner-eR7xmZ00
    {
      background-color: ${options.upColor} !important;
      border-color: ${options.upColor} !important;
      color: #ffffff !important;
    }

    .box-5Xd5conM.check-5Xd5conM {
      background-color: ${options.upColorCheckBoxBackground} !important;
      border-color: ${options.upColor} !important;
      color: #ffffff !important;
    }

    .highlight-pgo9gj31.shown-pgo9gj31
    {
      border-color: ${options.upColor} !important;
    }

    .day-U9DgB4FB.withinSelectedRange-U9DgB4FB {
      background-color: ${options.upColorCheckBoxBackground} !important;
      border-color: ${options.upColorCheckBoxBackground} !important;
      color: #ffffff !important;

    }

    .day-U9DgB4FB.currentDay-U9DgB4FB {
      color: #ffffff !important;
    }

    .group-T57LDNqT, .inner-3e32hIe9, .group-3e32hIe9, .fill-3e32hIe9, .chart-controls-bar {
      background-color: ${options.backgroundColor} !important;
    }
  `
}

const TradingChartHelper = {
  getDeadPeriod,
  getGameTime,
  overrideChartCss,
  getMaxGameTime,
}

export default TradingChartHelper
