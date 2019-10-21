import React from 'react'

interface PlayerListProps {
  players: Array<PlayerObject>
}

type PlayerObject = {
  ready: boolean,
  name: string,
  progress: number,
}

class PlayerList extends React.Component<PlayerListProps> {

  render(): JSX.Element {
    return (
      <div className="PlayerList">
        <h2>{this.props.players.length} players online</h2>
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Ready</th>
            <th>Progress</th>
          </tr>
          </thead>
          <tbody>
          {
            this.props.players.map((player: PlayerObject): JSX.Element => {
              return (
                <tr key={player.name}>
                  <td>{player.name}</td>
                  <td>{player.ready ? 'YES' : 'NO'}</td>
                  <td>{player.progress}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default PlayerList
