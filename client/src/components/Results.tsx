import React from 'react'

interface ResultsProps {
  players: Array<PlayerObject>
  playerName: string | null
}

type PlayerObject = {
  ready: boolean,
  name: string,
  progress: number,
  doneTimestamp: number,
  fuckUps?: number,
}

class Results extends React.Component<ResultsProps> {

  playerIsPlayer(player: PlayerObject): boolean {
    return this.props.playerName === player.name
  }

  render(): JSX.Element {
    let rank = 0
    return (
      <div className="Results">
        <table>
          <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Fuck-ups</th>
            <th>Slower than fastest</th>
          </tr>
          </thead>
          <tbody>
          {
            this.props.players.map((player: PlayerObject): JSX.Element => {
              const you = this.playerIsPlayer(player)
              rank++
              return (
                <tr key={player.name} className={you ? 'you' : ''}>
                  <td>{rank}</td>
                  <td>{player.name}</td>
                  <td>{player.fuckUps}</td>
                  <td>
                    [todo: Time delta to fastest]
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

export default Results
