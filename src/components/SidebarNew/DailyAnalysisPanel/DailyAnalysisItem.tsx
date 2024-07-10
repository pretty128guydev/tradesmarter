import React, { useEffect, useRef, useState } from 'react'
import { api } from '../../../core/createAPI'
import {
  ArticleAnalysis,
  ArticleBody,
  ArticleContainer,
  ArticleDate,
  ArticleImg,
  ArticleLoader,
} from './styled'
import { connect } from 'react-redux'
import DailyAnalysisImage from './DailyAnalysisImage'
import { LocaleDate } from '../../../core/localeFormatDate'
import UILoader from '../../ui/UILoader'

interface IDailyAnalysisItemProps {
  name: any
  date: number
  colors: any
  id: string
  wrapperViewPort: { top: number; height: number }
  onError: () => void
  forceLoad?: boolean
}

export interface IDailyAnalysisData {
  Analysis: any
  Date: string
  ImageURL: string
  Symbol: string
}

const fetchDailyAnalysisData = async (
  name: any,
  date: number
): Promise<IDailyAnalysisData> => {
  const instrumentDate: number = (
    new Date(date).toISOString().split('T')[0] as any
  ).replaceAll('-', '')
  let analysisData = null

  try {
    const { data } = await api.fetchDailyAnalysis(name, instrumentDate)
    analysisData = data['Forex Analysis (Daily)']['Forex Analysis']
    analysisData.Analysis = analysisData.Analysis.replaceAll(
      'color="black"',
      'color="white"'
    )
    analysisData.Analysis = analysisData.Analysis.replace(
      /style="background-color: .*;"/gm,
      ''
    )
  } catch (err) {
    console.log(err)
  }

  return analysisData
}

const DailyAnalysisItem = ({
  name,
  date,
  colors,
  wrapperViewPort,
  id,
  onError,
  forceLoad,
}: IDailyAnalysisItemProps) => {
  const articleData: any = useRef(null)
  const articleItem: any = useRef(null)
  const [article, setArticle] = useState<IDailyAnalysisData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<boolean>(false)
  const [enlargedImg, setEnlargedImg] = useState<boolean>(false)

  useEffect(() => {
    fetchData()
  }, [name, date])

  useEffect(() => {
    if (articleData.current) {
      articleData.current.innerHTML = article?.Analysis
    }
  }, [article])

  const isVisible = () => {
    if (forceLoad && !loadError) {
      return true
    }

    const top = articleItem.current.offsetTop

    if (top === 0) {
      return false
    }

    return top < wrapperViewPort.top + wrapperViewPort.height
  }

  const fetchData = () => {
    const isLoad = articleItem.current && !article && !loading && isVisible()

    if (isLoad) {
      setLoading(true)
      fetchDailyAnalysisData(name, date).then((data) => {
        setLoading(false)

        if (!data) {
          setLoadError(true)
          onError()
        }

        setArticle(data)
      })
    }
  }

  if (!loadError) {
    return (
      <ArticleContainer id={id} colors={colors} ref={articleItem}>
        {loading && (
          <ArticleLoader>
            <UILoader />
          </ArticleLoader>
        )}
        {article && (
          <>
            {article?.ImageURL && (
              <>
                <ArticleImg
                  src={article?.ImageURL}
                  alt=""
                  onClick={() => setEnlargedImg(true)}
                />

                {enlargedImg && (
                  <DailyAnalysisImage
                    src={article?.ImageURL}
                    alt=""
                    onClick={() => setEnlargedImg(false)}
                  />
                )}
              </>
            )}
            <ArticleBody>
              <ArticleAnalysis colors={colors} ref={articleData} />
              <ArticleDate colors={colors}>
                {LocaleDate.format(date, 'iii MMM dd u')}
              </ArticleDate>
            </ArticleBody>
          </>
        )}
      </ArticleContainer>
    )
  }

  return <div />
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
})

export default connect(mapStateToProps)(DailyAnalysisItem)
