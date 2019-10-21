import React from 'react'

type GameFrameProps = {
  text: string,
}

type GameFrameState = {
  errorsRunning: number,
  matchingTexts: boolean,
}

class GameFrame extends React.Component<GameFrameProps, GameFrameState> {

  constructor(props: GameFrameProps) {
    super(props)

    this.state = {
      errorsRunning: 0,
      matchingTexts: true,
    }
  }

  onPlayerTextChange(e: any): void {
    const playerText = e.target.value
    const masterText = this.props.text
    const masterTextToCheckAgainst = masterText.substring(0, playerText.length)

    console.log('-------')
    console.log(masterTextToCheckAgainst)
    console.log(playerText)
    console.log('-------')

    if (masterTextToCheckAgainst !== playerText) {
      this.setState({
        errorsRunning: this.state.errorsRunning + 1,
        matchingTexts: false,
      })
    } else {
      console.log('NICE!')
      this.setState({
        matchingTexts: true,
      })
    }
  }

  renderText(): JSX.Element {
    return (
      <div>
        {this.props.text}
      </div>
    )
  }

  displayErrors(): JSX.Element {
    return (
      <div className="errors">
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
        <textarea onChange={this.onPlayerTextChange.bind(this)} autoFocus/>
        {this.displayErrors()}
      </div>
    )
  }
}

export default GameFrame
