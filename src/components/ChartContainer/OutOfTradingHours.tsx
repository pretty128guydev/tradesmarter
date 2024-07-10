/**
 * Implements a bar with Out of trading hours information
 */
import React from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { IInstrument } from '../../core/API'
import { getInstrumentObject } from '../selectors/instruments'
import { LocaleDate } from '../../core/localeFormatDate'

const Container = styled.div`
  flex: 1 1 auto;
  position: relative;
`

const Panel = styled.div`
  position: absolute;
  display: block;
  top: calc(50% - 75px);
  left: calc(50% - 130px);

  width: 260px;
  height: 154px;
  padding: 20px;

  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: #1d2834;

  h2 {
    display: block;
    height: 20px;
    line-height: 20px;
    margin: 0 auto;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: -0.09px;
    text-align: center;

    color: #ffffff;
  }
`

const AssetLine = styled.div`
  display: flex;
  flex-direction: row;

  height: 24px;
  line-height: 24px;
  margin: 15px auto 15px;
  text-align: center;

  div {
    display: flex;
    flex: 1 1 auto;
    justify-content: flex-end;
    margin-right: 10px;
  }
`
const AssetTitle = styled.span`
  display: flex;
  flex: 1 1 auto;

  height: 16px;
  line-height: 16px;

  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: -0.23px;

  color: #ffffff;
`

const NextSession = styled.div`
  display: block;
  width: 220px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.08px;
  text-align: center;

  div {
    display: block;
    color: #9fabbd;
  }
  span {
    display: block;
    color: #ffffff;
  }
`
const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  mask: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNMTQwLjIsNTEySDUxMlYzNjguMWwtMi4yLTEzLjdsLTEuNy0wLjJsLTEuOSw0Ljl2LTMuNGwtMy4yLTIuMmwtMS45LTE2LjFsLTIuMi0wLjVsLTIuNywxNC45bC0yLjctMTQuOWwtMS41LDMzLjYgbC0zLjYtMzIuNmgtMS41bC0xLjktMy43bC0xLjgtMTcuN2wtMS4yLDIuMmwtMi43LTQuOWwtMi43LDEzLjR2LTEyLjlsLTEuOSwxLjdsLTIuOS0yLjJsLTIuOSw0LjRsLTEuMy0xM2wtMS42LDAuMmwtMi42LTI1LjggbC0yLjIsMy43bC0zLjMsMzAuM2wtNS44LTYuNmwtMi42LDMuMWwtMy41LTkuM2wtMiw5LjFsLTEuNi0yMC4xbC0xLjgsMy4zbC0xLjgtNi44bC0xLjYtMy43bC0yLjYtMy4xbC0yLDEuOGwtMS4xLDE0LjZsLTIuNiw3LjEgbC0xLjgtMi40bC0yLjcsMi45bC00LTAuNGwtMS4xLTUuMWwtNC45LTE4LjZsLTQuNi0wLjJsLTIuNC0zLjV2Mi45bC0yLjIsMC43bC0xLjEtNi40bC0xLjgsNi45bC0yLjYtOGwtMi40LDcuN2wtMy4xLDEuMSBsLTIuNiwyMS42bC0xLjYtMTIuNGgtMy45bC0yLjYtMTcuNWwtMy4zLDAuMnYyLjdsLTIuNywwLjVsLTEuNSwzLjhsLTAuOS00bC0yLjIsMy41bC0yLjcsMC4ybC0wLjksMjQuOGwtMi4yLTcuMWwtMy44LDE1LjIgbC0yLjksMTguNGwtMS42LTE2LjFsLTEuOCwxMy4zbC0yLjYtMi45bC0wLjksNS44bC0xLjgtMTYuNGwtMS4xLDE2LjhsLTMuOCwwLjRsLTIuMi0xNC42bC0xLjUsMTQuMmwtMS42LTRsLTIuNyw3LjdsLTEuMSw2LjkgbC0zLjctMy43aC0zLjN2LTQuMmgtMi40bC0xLjEsMy43bC0xLjYtMi43bC0wLjksMTMuMmwtNCw2LjJsLTIuNi0xMi42bC0xLjYtNy4xbC0yLjctMC40bC0wLjktNGwtMy44LDEuM2wtMS41LDIuOWwtMi43LTAuNyBsLTMuNS0zNC4zbC00LDM0LjVsLTMuMS0xN2wtMi43LDEuN2wtMi4xLTUuMmwtMy4xLDUuMWwtMi40LTEuMWwtMS4zLDEyLjFsLTMuMSw1Ljd2MTYuMWwtMi40LDAuNHYtOS43bC0yLjctMC4ydi0xMC44bC0yLjctMC41IGwtMi40LTI1LjhsLTEuNi00LjRsLTIuOSwwLjJsLTEuNS0zLjdoLTIuNmwtMS45LTQuOWwtMC41LDMuM2wtMS40LTEuOWwtMi4yLDEuMWwtMSwxOS41bC0zLjEsMTYuMWwtMS42LTE2LjFsLTEuNSwyLjJsLTIsNDAuNyB2LTUuMWwtMS4zLDAuN2wtMi40LTYuNGwtMi42LTcuOWwtMi45LDAuMmwtMS41LDE1bC0xLjMtNC42bC0zLjgtNC42di0xMy4xaC00bC0wLjYtMTMuMWwtMS44LTQuMWwtMy4yLTAuM2wtMS4xLTEzLjdsLTIuMiwxLjUgbC0yLjYsMTIuM2wtMi42LTAuNWwtMS43LTcuOGwtMS40LTEuNmwtMi42LDkuM2wtMS40LTMuMWwtMS4zLDMuMWwtMS45LDAuMmwtMC42LTEwLjJoLTIuNmwtMSwzLjdsLTEuNi0zLjZsLTIuNiwwLjFsLTQuMiw2LjggbC0xLjgtMy41bC0xLjUsMTMuMmwtMS4zLTkuOGwtMS44LDMuN2wtMS4yLTMuN2wtMC45LTYuNWgtMmwtMy40LTI4LjFsLTIuNCwzLjdsLTEuMi0zLjRsLTIuOCwyNGwtNC42LTI0LjRoLTAuOWwtMS45LDMuNyBsLTEuMy0yLjZsLTMsMy4xbC0xLjYtMy4ybC0wLjcsMi41aC0zLjdsLTAuNy02LjJsLTIsNi4ybC0yLjItMi44bC0yLjEtMi4zbC0yLjMtNi4zTDE0MC4yLDUxMnogTTI4Ni4zLDMzMC45aC00VjM0NGwtMy44LDQuNiBsLTEuMyw0LjZsLTEuNS0xNWwtMi45LTAuMmwtMi42LDcuOWwtMi40LDYuNGwtMS4zLTAuN3Y1LjFsLTItNDAuN2wtMS41LTIuMmwtMS42LDE2LjFsLTMuMS0xNi4xbC0xLjEsNi42bC0xLjItMzAuNmwtMS42LDIuOCBsLTEuMy0wLjlsLTEuOSw0LjloLTIuNmwtMS41LDMuN2wtMi45LTAuMmwtMS42LDQuNGwtMi40LDI1LjhsLTIuNywwLjV2MTAuOGwtMi43LDAuMnY5LjdsLTIuNC0wLjRWMzM1bC0zLjEtNS43bC0xLjMtMTIuMSBsLTIuNCwxLjFsLTMuMS01LjFsLTIuMSw1LjJsLTIuNy0xLjdsLTMuMSwxN2wtNC0zNC41bC0zLjUsMzQuM2wtMi43LDAuN2wtMS41LTIuOWwtMy44LTEuM2wtMC45LDRsLTIuNywwLjRsLTEuNiw3LjFsLTIuNiwxMi42IGwtNC02LjJsLTAuOS0xMy4ybC0xLjYsMi43bC0xLjEtMy43aC0yLjR2NC4ySDE3OGwtMy43LDMuN2wtMS4xLTYuOWwtMi43LTcuN2wtMS42LDRsLTEuNS0xNC4ybC0yLjIsMTQuNmwtMy44LTAuNGwtMS4xLTE2LjggbC0xLjgsMTYuNGwtMC45LTUuOGwtMi42LDIuOWwtMS44LTEzLjNsLTEuNiwxNi4xbC0yLjktMTguNGwtMy44LTE1LjJsLTIuMiw3LjFsLTAuOS0yNC44bC0yLjctMC4ybC0yLjItMy41bC0wLjksNGwtMS41LTMuOCBsLTIuNy0wLjV2LTIuN2wtMy4zLTAuMmwtMi42LDE3LjVIMTIybC0xLjYsMTIuNGwtMi42LTIxLjZsLTMuMS0xLjFsLTIuNC03LjdsLTIuNiw4bC0xLjgtNi45bC0xLjEsNi40bC0yLjItMC43di0yLjlsLTIuNCwzLjUgbC00LjYsMC4yTDkyLjcsMjk4bC0xLjEsNS4xbC00LDAuNGwtMi43LTIuOWwtMS44LDIuNGwtMi42LTcuMWwtMS4xLTE0LjZsLTItMS44bC0yLjYsMy4xbC0xLjYsMy43bC0xLjgsNi44bC0xLjgtMy4zTDY4LDMwOS45IGwtMi05LjFsLTMuNSw5LjNsLTIuNi0zLjFsLTUuOCw2LjZsLTMuMy0zMC4zbC0yLjItMy43TDQ2LDMwNS40bC0xLjYtMC4ybC0xLjMsMTNsLTIuOS00LjRsLTIuOSwyLjJsLTEuOS0xLjd2MTIuOWwtMi43LTEzLjQgbC0yLjcsNC45bC0xLjItMi4yTDI3LDMzNC4ybC0xLjksMy43aC0xLjVMMjAsMzcwLjVsLTEuNS0zMy42bC0yLjcsMTQuOWwtMi43LTE0LjlsLTIuMiwwLjVMOSwzNTMuNWwtMy4yLDIuMnYzLjRsLTEuOS00LjkgbC0xLjcsMC4yTDAsMzY4LjFWNTEyaDI4OUwyODYuMywzMzAuOXoiPjwvcGF0aD48L2c+PC9zdmc+)
    center bottom repeat-x;
  background-color: rgba(64, 90, 128, 0.5);
  color: rgba(255, 255, 255, 0.87);
`

interface IOutOfTradingHoursProps {
  instrument: IInstrument
}

const OutOfTradingHours = ({ instrument }: IOutOfTradingHoursProps) => {
  const { tradingHours } = instrument
  const { opensAt } = tradingHours[0]
  return (
    <Container>
      <Mask />
      <Panel>
        <h2>{t`Out of trading hours`}</h2>
        <AssetLine>
          <div>
            <img
              className="asset_icon_big"
              width="24"
              height="24"
              alt="instrument icon"
              src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrument.instrumentID}.svg`}
            />
          </div>
          <AssetTitle className="instrument-name">{instrument.name}</AssetTitle>
        </AssetLine>
        <NextSession>
          <div>{t`Will become available again on`}:</div>
          <span>{LocaleDate.format(opensAt, 'do MMM yyyy, HH:mm')}</span>
        </NextSession>
      </Panel>
    </Container>
  )
}

const mapStateToProps = (state: any) => ({
  instrument: getInstrumentObject(state),
})

export default connect(mapStateToProps)(OutOfTradingHours)
