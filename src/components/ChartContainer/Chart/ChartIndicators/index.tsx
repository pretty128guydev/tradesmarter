/**
 * Implements an indicator button
 */
import React, { useState } from 'react'
import { t } from 'ttag'
import Backdrop from '../../../Backdrop'
import SelectionPanel from './SelectionPanel'
import { menuItems } from './menuItems'
import { IndicatorsButton } from '../styled'
import { ReactComponent as IndicatorIcon } from './indicator.svg'
import { connect } from 'react-redux'
import { IPeriod } from '../period'

interface IChartIndicatorsProps {
  timeframe: IPeriod
  indicators: any[]
  isLoggedIn: boolean
  colors: any
  isMobile: boolean
}

const ChartIndicators = ({
  timeframe,
  colors,
  indicators,
  isLoggedIn,
  isMobile,
}: IChartIndicatorsProps) => {
  const [visibility, setVisibility] = useState<boolean>(false)
  const anyIndicators = indicators.length > 0

  const isTick = timeframe.period === 'tick'

  return (
    <>
      <IndicatorsButton
        colors={colors}
        indicators={anyIndicators}
        onClick={() => setVisibility(true)}
        className={isTick ? 'disabled' : ''}
        isMobile={isMobile}
      >
        <IndicatorIcon fill={colors.primaryText} stroke={colors.primaryText} />
        {!isMobile && <div className="btn__caption">{t`INDICATORS`}</div>}
        {!isMobile && anyIndicators && (
          <div className="enabled__indicators">{indicators.length}</div>
        )}
      </IndicatorsButton>

      {visibility && (
        <>
          <Backdrop onClick={() => setVisibility(false)} />
          <SelectionPanel
            colors={colors}
            isMobile={isMobile}
            indicators={indicators}
            menuItems={menuItems}
            isLoggedIn={isLoggedIn}
            setVisibility={setVisibility}
          />
        </>
      )}
    </>
  )
}

export default connect((state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
}))(ChartIndicators)
