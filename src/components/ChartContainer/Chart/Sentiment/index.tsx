/**
 * Starts timer and fetched sentiment
 * In design width equals 170, but 190 for safari to avoid second line
 */
import React from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import CircularProgress from './CircularProgress'
import { api } from '../../../../core/createAPI'
import { connect } from 'react-redux'
import { ReactComponent as SentimentUpSvg } from './sentiment-up.svg'
import { ReactComponent as SentimentDownSvg } from './sentiment-down.svg'

interface ISentimentProps {
  instrument: string
  navigator: boolean
  colors: any
  isMobile: boolean
}
const SentimentPanel = styled.div<any>`
  position: absolute;
  left: 11px;
  bottom: ${(props) => (props.navigator ? '120px' : '60px')};

  display: flex;
  box-sizing: border-box;
  width: 190px;
  padding: 10px;
  border-radius: 2px;

  opacity: 0.9;
  background-color: ${(props) => props.colors.background};
  z-index: 1;
`

const SentimentMobilePanel = styled.div<any>`
  position: absolute;
  left: 11px;
  display: flex;
  box-sizing: border-box;
  opacity: 0.9;
  bottom: 122px;
  z-index: 1;
`

const DescriptionPanel = styled.div<any>`
  flex: 1 1 auto;
  margin-left: 10px;
  p {
    font-size: 12px;
    font-weight: bold;
    letter-spacing: -0.2px;
    padding: 0 0 0 0;
    margin: 0 0 6px 0;

    color: ${(props) => props.colors.primaryText};
  }
`
const Line = styled.div<any>`
  display: flex;
  height: 15px;
  line-height: 15px;
  font-size: 11px;

  span {
    flex: 1 1 auto;
    text-align: left;

    color: #8191a5;
  }
  div {
    flex: 1 1 auto;
    text-align: right;

    color: ${(props) => props.colors.primaryText};
  }
`

const SentimentArrows = styled.div<any>`
  display: flex;
  flex-direction: column;
  height: 74px;
  justify-content: space-between;
  margin-left: 2px;
`

const SentimentArrow = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`

class Sentiment extends React.Component<ISentimentProps, any> {
  timer: any
  request: null
  canvas: any

  constructor(props: any) {
    super(props)
    this.state = {
      error: true,
      sentiment: {
        up: 0,
        down: 0,
      },
    }
    this.canvas = React.createRef()
  }

  onStartTimer = () => {
    this.timer = setInterval(this.onFetch, 60000)
  }

  /**
   * Reset timer, fetch data, set state, set timer
   */
  onFetch = async () => {
    try {
      clearInterval(this.timer)

      const sentiment = await api.fetchInstrumentSentiment(
        this.props.instrument
      )
      if (sentiment) {
        this.setState(
          {
            error: false,
            sentiment,
          },
          this.onStartTimer
        )
        setTimeout(() => {
          this.onRenderMobilePanel()
        })
      } else {
        this.setState({ error: true })
      }
    } catch (err) {
      console.warn(err)
      this.setState({
        error: true,
      })
    }
  }

  /**
   * Start initial fetch which will set a timer
   */
  componentDidMount = () => {
    this.onFetch()
  }

  /**
   * Reset timer
   */
  componentWillUnmount = () => {
    clearInterval(this.timer)
  }

  /**
   * Compare props, if they are different than hide component and fetch data
   * @param prevProps
   */
  componentDidUpdate = (prevProps: any) => {
    if (prevProps.instrument !== this.props.instrument) {
      this.setState({ error: true }, this.onFetch)
    }
  }

  onRenderMobilePanel = () => {
    const MAX_HEIGHT = 74
    if (this.canvas) {
      if (this.canvas.current) {
        try {
          const context = this.canvas.current.getContext('2d')
          context.clearRect(
            0,
            0,
            this.canvas.current.width,
            this.canvas.current.height
          )
          context.fillStyle = 'red'
          context.fillRect(0, 0, 4, MAX_HEIGHT)
          context.fillStyle = 'green'
          context.fillRect(
            0,
            0,
            4,
            Math.ceil((MAX_HEIGHT * this.state.sentiment.up) / 100)
          )
        } catch (err) {
          console.warn(err)
        }
      }
    }
  }
  render = () => {
    const { navigator, colors } = this.props
    const { error, sentiment } = this.state
    /**
     * Don't render component if no data
     */
    if (error) {
      return null
    }

    if (this.props.isMobile) {
      return (
        <SentimentMobilePanel>
          <canvas ref={this.canvas} width="4" height="74" />
          <SentimentArrows>
            <SentimentArrow color={colors.tradebox.highNormal}>
              <SentimentUpSvg />
            </SentimentArrow>
            <SentimentArrow color={colors.tradebox.lowNormal}>
              <SentimentDownSvg />
            </SentimentArrow>
          </SentimentArrows>
        </SentimentMobilePanel>
      )
    }

    return (
      <SentimentPanel navigator={navigator} colors={colors}>
        <CircularProgress
          filledColor={colors.tradebox.highActive}
          normalColor={colors.tradebox.lowActive}
          value={sentiment.up}
          size={50}
          thickness={4}
        />
        <DescriptionPanel colors={colors}>
          <p>{t`Trader sentiment`}</p>
          <Line colors={colors}>
            <span>{t`High`}</span>
            <div>{sentiment.up}%</div>
          </Line>
          <Line colors={colors}>
            <span>{t`Low`}</span>
            <div>{sentiment.down}%</div>
          </Line>
        </DescriptionPanel>
      </SentimentPanel>
    )
  }
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps)(Sentiment)
