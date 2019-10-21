import React from 'react'

type GameFrameProps = {
  text: string,
}

type GameFrameState = {
  text: string,
}

class GameFrame extends React.Component<GameFrameProps, GameFrameState> {

  constructor(props: GameFrameProps) {
    super(props)

    this.state = {
      text: '',
    }
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
        <div className="text">
          {this.renderText()}
        </div>
      </div>
    )
  }
}

export default GameFrame
