import React, { useState } from 'react'
import { IArticle } from './NewsFeedContents'
import { t } from 'ttag'
import {
  ArticleBody,
  ArticleContainer,
  ArticleContent,
  ArticleImg,
  ArticleButton,
  ArticleTitle,
} from './styled'
import { connect } from 'react-redux'

interface INewsFeedItemProps {
  article: IArticle
  selected: boolean
  colors: any
  select: (id: number | null) => void
}

const NewsFeedItem = ({
  article,
  select,
  selected,
  colors,
}: INewsFeedItemProps) => {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  return (
    <ArticleContainer>
      {article.image && (
        <ArticleImg
          visible={imgLoaded}
          src={article.image}
          onLoad={() => setImgLoaded(true)}
          alt=""
        />
      )}
      <ArticleBody colors={colors}>
        <ArticleTitle colors={colors}>{article.title}</ArticleTitle>
        <ArticleContent colors={colors}>
          {selected && <>{article.content}</>}
          {!selected && <>{article.description}</>}
        </ArticleContent>
        {selected && (
          <ArticleButton colors={colors} onClick={() => select(null)}>
            {t`Read Less`}
          </ArticleButton>
        )}
        {!selected && (
          <ArticleButton colors={colors} onClick={() => select(article.id)}>
            {t`Read More`}
          </ArticleButton>
        )}
      </ArticleBody>
    </ArticleContainer>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
})

export default connect(mapStateToProps)(NewsFeedItem)
