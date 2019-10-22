import React from 'react'
// import _ from 'lodash'

type GameFrameProps = {
  text: string
  doOnDone: Function
  onProgressChange: Function
  sendFuckupToServer: Function
}

type GameFrameState = {
  freezeTextarea: boolean
  errorsRunning: number
  playerText: string
  matchingTexts: boolean
  playerProgress: number
}

class GameFrame extends React.Component<GameFrameProps, GameFrameState> {

  constructor(props: GameFrameProps) {
    super(props)

    this.state = {
      freezeTextarea: false,
      errorsRunning: 0,
      playerText: '',
      playerProgress: 0,
      matchingTexts: true,
    }
  }

  onPlayerTextChange(e: any): void {
    if (this.state.playerProgress > 99) {
      console.warn('Already done, will not register input.')
      this.setState({
        freezeTextarea: true,
      })
      return
    }
    const playerText = e.target.value
    const masterText = this.props.text
    const masterTextToCheckAgainst = masterText.substring(0, playerText.length)
    const playerProgress = Math.round(playerText.length / masterText.length * 100)

    if (masterTextToCheckAgainst !== playerText) {
      this.setState({
        errorsRunning: this.state.errorsRunning + 1,
        matchingTexts: false,
        playerText,
      })
      this.props.sendFuckupToServer(this.state.errorsRunning + 1)
    } else {
      this.setState({
        matchingTexts: true,
        playerText,
        playerProgress,
      })
      this.props.onProgressChange(playerProgress)
      if (playerText.length === masterText.length) {
        this.doOnDone()
      }
    }
  }

  doOnDone(): any {
    this.props.doOnDone()
  }

  renderText(): JSX.Element {
    return (
      <div className={'text-display ' + (this.state.matchingTexts ? 'good' : 'bad')}>
        <span className="covered">{this.state.playerText}</span>
        <span className="untouched">{this.props.text.substring(this.state.playerText.length)}</span>
      </div>
    )
  }

  displayStatus(): JSX.Element {
    return (
      <div className="status-wrapper">
        <span>Fuck-ups: {this.state.errorsRunning}</span>
        {
          this.state.freezeTextarea ? '' :
            <span>Current status: {this.state.matchingTexts ? 'Full match, keep going!' : 'You\'ve fucked something up, fix it!'}</span>
        }
      </div>
    )
  }

  render(): JSX.Element {
    return (
      <div className="GameFrame">
        <h1>Game is on:</h1>
        <div className="server-text">
          {this.renderText()}
        </div>
        {this.state.freezeTextarea ? null : <textarea
          disabled={this.state.freezeTextarea}
          onChange={this.onPlayerTextChange.bind(this)}
          autoFocus/>}
        {this.displayStatus()}
      </div>
    )
  }
}

export default GameFrame
