import React, { useEffect, useRef, useState } from 'react'
import {
  InfoWrapper,
  TooltipColumn,
  TooltipContainer,
  TooltipDataCell,
  TooltipTitle,
} from '../styled'
import { ReactComponent as Info } from '../isons/info.svg'
import ReactTooltip from 'react-tooltip'
import { t } from 'ttag'
import { IInstrument, ITradingHourRange } from '../../../../core/API'
import { Panel } from './styled'
import { connect } from 'react-redux'
import { getInstrumentObject } from '../../../selectors/instruments'
import { LocaleDate } from '../../../../core/localeFormatDate'

require('./style.scss')

interface IInstrumentInfoProps {
  instrument: IInstrument
  colors: any
}

interface ITooltipPosition {
  top: number
  left: number
  maxHeight: number
}

const InstrumentInfo = ({ instrument, colors }: IInstrumentInfoProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<ITooltipPosition>({
    top: 0,
    left: 0,
    maxHeight: 0,
  })

  const { name, futureExpirationDate, type, precision, tradingHours } =
    instrument

  useEffect(() => {
    const rect: DOMRect | undefined = panelRef.current?.getBoundingClientRect()

    if (rect) {
      const top = rect.top + rect.height
      const maxHeight = document.body.clientHeight - top - 50 //bottom offset
      setTooltipPosition({ top, left: rect.left, maxHeight })
    }
  }, [panelRef])

  return (
    <Panel ref={panelRef} data-tip="" data-for="info" colors={colors}>
      <span>{name}</span>
      {type === 4 && <span>{futureExpirationDate}</span>}
      <InfoWrapper>
        <Info />
      </InfoWrapper>
      <ReactTooltip
        overridePosition={() => ({
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        })}
        id="info"
        place="left"
        className="react-tooltip tooltip-background"
        backgroundColor={colors.background}
      >
        <TooltipContainer
          className="instrument-container"
          style={{ maxHeight: `${tooltipPosition.maxHeight}px` }}
          colors={colors}
        >
          <TooltipColumn>
            <TooltipTitle>{name}</TooltipTitle>
            <TooltipDataCell>{t`Precision`}:</TooltipDataCell>
            <TooltipDataCell>{t`Opening hours`}:</TooltipDataCell>
          </TooltipColumn>
          <TooltipColumn>
            <TooltipDataCell>&nbsp;</TooltipDataCell>
            <TooltipDataCell>{precision}</TooltipDataCell>
            <TooltipDataCell className="opening-hours scrollable">
              {tradingHours[0].tradingHourRanges.map(
                (hour: ITradingHourRange) => (
                  <TooltipDataCell key={`${hour.from}-${hour.to}`}>
                    {LocaleDate.format(hour.from, 'd-MMM HH:mm')} -{' '}
                    {LocaleDate.format(hour.to, 'd-MMM HH:mm')}
                  </TooltipDataCell>
                )
              )}
            </TooltipDataCell>
          </TooltipColumn>
        </TooltipContainer>
      </ReactTooltip>
    </Panel>
  )
}

const mapStateToProps = (state: any) => ({
  instrument: getInstrumentObject(state),
})

export default connect(mapStateToProps)(InstrumentInfo)
