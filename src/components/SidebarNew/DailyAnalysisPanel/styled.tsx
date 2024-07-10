import styled from 'styled-components'

const ArticleContainer = styled.div<{ colors: any }>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background-color: ${(props) => props.colors.leftPanel.itemBackground};
  min-height: 100%;
`

const ArticleBody = styled.div`
  padding: 10px 10px 20px 11px;
  width: 100%;
  word-break: break-word;
`

const ArticleAnalysis = styled.div<{ colors: any }>`
  p {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;

    color: ${(props) => props.colors.leftPanel.textColor};
  }

  p:first-of-type {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;

    color: ${(props) => props.colors.primaryText};
  }

  table {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: ${(props) => props.colors.leftPanel.textColor};

    tbody {
      tr:first-child {
        color: ${(props) => props.colors.primaryText};
        background-color: ${(props) => props.colors.panelBorder};
      }
    }
  }
`

const ArticleDate = styled.div<{ colors: any }>`
  color: ${(props) => props.colors.leftPanel.textColor};
  font-size: 10px;
`

const ArticleImg = styled.img`
  width: 100%;
  cursor: zoom-in;
`

const ArticleImgEnlarged = styled.img`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  max-height: 100vh;
  max-width: 100vw;
  cursor: zoom-out;
`

const ArticleLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const ListWrapper = styled.div`
  display: block;
  position: relative;
  overflow-x: auto;
  width: 100%;
  height: 100%;
`

export {
  ArticleContainer,
  ArticleBody,
  ArticleImg,
  ArticleAnalysis,
  ArticleDate,
  ListWrapper,
  ArticleImgEnlarged,
  ArticleLoader,
}
