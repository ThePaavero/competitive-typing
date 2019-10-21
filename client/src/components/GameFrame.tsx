import React from 'react'

type GameFrameProps = {
  text: string,
}

type GameFrameState = {
  text: string,
  playerText: string,
}

class GameFrame extends React.Component<GameFrameProps, GameFrameState> {

  constructor(props: GameFrameProps) {
    super(props)

    this.state = {
      text: '',
      playerText: '',
    }
  }

  onPlayerTextChange(e: any) {
    console.log(e.target.value)
    return
  }

  renderText(): JSX.Element {
    return (
      <div>
        {this.props.text}
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
      </div>
    )
  }
}

export default GameFrame
