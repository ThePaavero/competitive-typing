import React from 'react'
// import _ from 'lodash'

type GameFrameProps = {
  text: string,
}

type GameFrameState = {
  errorsRunning: number,
  playerText: string,
  matchingTexts: boolean,
}

class GameFrame extends React.Component<GameFrameProps, GameFrameState> {

  constructor(props: GameFrameProps) {
    super(props)

    this.state = {
      errorsRunning: 0,
      playerText: '',
      matchingTexts: true,
    }
  }

  onPlayerTextChange(e: any): void {
    const playerText = e.target.value
    const masterText = this.props.text
    const masterTextToCheckAgainst = masterText.substring(0, playerText.length)

    if (masterTextToCheckAgainst !== playerText) {
      this.setState({
        errorsRunning: this.state.errorsRunning + 1,
        matchingTexts: false,
        playerText,
      })
    } else {
      this.setState({
        matchingTexts: true,
        playerText,
      })
    }
  }

  renderText(): JSX.Element {
    return (
      <div className={'text-display ' + (this.state.matchingTexts ? 'good' : 'bad')}>
        <span className="covered">{this.state.playerText}</span>
        <span className="untouched">{this.props.text.substring(this.state.playerText.length)}</span>
      </div>
    )
  }

  displayErrors(): JSX.Element {
    return (
      <div className="status-wrapper">
        <span>Fucked up strokes: {this.state.errorsRunning}</span>
        <span>Current status: {this.state.matchingTexts ? 'Full match!' : 'Not matching'}</span>
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
        <textarea
          onChange={this.onPlayerTextChange.bind(this)}
          autoFocus/>
        {this.displayErrors()}
      </div>
    )
  }
}

export default GameFrame
