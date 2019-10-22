import React from 'react'

interface PlayerListProps {
  players: Array<PlayerObject>
  playerName: string | null
}

type PlayerObject = {
  ready: boolean,
  name: string,
  progress: number,
  fuckUps?: number,
}

class PlayerList extends React.Component<PlayerListProps> {

  playerIsPlayer(player: PlayerObject): boolean {
    return this.props.playerName === player.name
  }

  render(): JSX.Element {
    const playerCount = this.props.players.length
    return (
      <div className="PlayerList">
        <h2>{playerCount} player{playerCount > 1 ? 's' : ''} online{playerCount < 2 ? ' (It\'s just you)' : ''}</h2>
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
              const you = this.playerIsPlayer(player)
              return (
                <tr key={player.name} className={you ? 'you' : ''}>
                  <td>{player.name}{you ? ' (YOU)' : ''}</td>
                  <td>{player.ready ? 'YES' : 'NO'}</td>
                  <td className="progress-cell">
                    <span style={{width: player.progress + '%'}}/>
                    {player.progress}%
                  </td>
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
