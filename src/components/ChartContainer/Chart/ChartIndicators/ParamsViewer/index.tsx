import React from 'react'
import { findIndex } from 'lodash'
import { replaceByIndex } from '../../../../../core/utils'
import { IIndicatorParam } from '../menuItems'
import {
  ParamsContainer,
  ParamContainer,
  ParamLabel,
  ParamInput,
  ArrayContainer,
} from './styled'
import { connect } from 'react-redux'

interface IParamsViewerProps {
  params: any
  setParams: any
  colors: any
  isMobile: boolean
}

const ParamsViewer = ({
  colors,
  params,
  setParams,
  isMobile,
}: IParamsViewerProps) => {
  const replaceParam = (
    param: IIndicatorParam,
    index: number,
    value: number
  ) => {
    if (!params) return
    const newParam = { ...param, value }
    setParams(replaceByIndex(params, index, newParam))
  }

  const replaceArrayParam = (
    param: IIndicatorParam,
    paramIndex: number,
    arrayIndex: number,
    value: number
  ) => {
    if (!params) return
    const values = params[paramIndex].value as number[]
    const newValues = replaceByIndex(values, arrayIndex, value)
    const newParam = { ...param, value: newValues }
    setParams(replaceByIndex(params, paramIndex, newParam))
  }

  const onParam = (e: any, param: IIndicatorParam, arrayIndex?: number) => {
    const value = Number(e.target.value)

    const paramIndex = findIndex(params, { id: param.id })
    if (paramIndex === -1) return

    arrayIndex === undefined
      ? replaceParam(param, paramIndex, value)
      : replaceArrayParam(param, paramIndex, arrayIndex, value)
  }

  return params ? (
    <ParamsContainer>
      {params.map((param: any) => (
        <ParamContainer key={param.id} isMobile={isMobile}>
          <ParamLabel>{param.title}</ParamLabel>
          {!Array.isArray(param.value) ? (
            <ParamInput
              colors={colors}
              type="number"
              value={param.value as unknown as string}
              onChange={(e: any) => onParam(e, param)}
            />
          ) : (
            <ArrayContainer>
              {(param.value as unknown as number[]).map((val, index) => (
                <ParamInput
                  colors={colors}
                  type="number"
                  key={index}
                  value={val as unknown as string}
                  onChange={(e: any) => onParam(e, param, index)}
                />
              ))}
            </ArrayContainer>
          )}
        </ParamContainer>
      ))}
    </ParamsContainer>
  ) : null
}

const mapStateToProps = (state: any) => ({ colors: state.theme })

export default connect(mapStateToProps)(ParamsViewer)
