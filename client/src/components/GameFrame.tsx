import React from 'react'

type GameFrameProps = {
  sentence: string,
}

type GameFrameState = {
  sentence: string,
}

class GameFrame extends React.Component<GameFrameProps, GameFrameState> {

  constructor(props: GameFrameProps) {
    super(props)

    this.state = {
      sentence: '',
    }
  }

  renderSentence(): JSX.Element {
    return (
      <div>
        {this.props.sentence}
      </div>
    )
  }

  render(): JSX.Element {
    return (
      <div className="GameFrame">
        [GAME FRAME]
        <div className="sentence">
          {this.renderSentence()}
        </div>
      </div>
    )
  }
}

export default GameFrame
