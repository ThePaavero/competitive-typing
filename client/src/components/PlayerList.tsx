import React from 'react'

interface PlayerListProps {
  players: Array<PlayerObject>
}

type PlayerObject = {
  ready: boolean,
  name: string,
  points: number,
}

class PlayerList extends React.Component<PlayerListProps> {

  constructor(props: PlayerListProps) {
    super(props)
  }

  render(): JSX.Element {
    return (
      <div className="PlayerList">
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Ready</th>
            <th>Points</th>
          </tr>
          </thead>
          <tbody>
          {
            this.props.players.map((player: PlayerObject): JSX.Element => {
              return (
                <tr key={player.name}>
                  <td>{player.name}</td>
                  <td>{player.ready ? 'YES' : 'NO'}</td>
                  <td>{player.points}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
        {this.props.players.length} players online
      </div>
    )
  }
}

export default PlayerList
