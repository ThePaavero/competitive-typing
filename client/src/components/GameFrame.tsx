import React from 'react'

type GameFrameProps = {
  text: string,
}

type GameFrameState = {
  errorsRunning: number,
  errorsCurrently: number,
}

class GameFrame extends React.Component<GameFrameProps, GameFrameState> {

  constructor(props: GameFrameProps) {
    super(props)

    this.state = {
      errorsRunning: 0,
      errorsCurrently: 0,
    }
  }

  onPlayerTextChange(e: any): void {
    const playerText = e.target.value
    const masterText = this.props.text

    const masterTextToCheckAgainst = masterText.substring(0, playerText.length)
    if (masterTextToCheckAgainst.trim() !== playerText.trim()) {
      this.setState({errorsRunning: this.state.errorsRunning + 1})
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
        <span>Errors: {this.state.errorsCurrently}</span>
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
        <textarea onChange={this.onPlayerTextChange.bind(this)}/>
        {this.displayErrors()}
      </div>
    )
  }
}

export default GameFrame
