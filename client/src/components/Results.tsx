import React from 'react'
import _ from 'lodash'

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

let winningTimestamp = 0

class Results extends React.Component<ResultsProps> {

  getDeltaToFastestPlayer(player: PlayerObject, rank: number): JSX.Element {
    if (rank === 1) {
      winningTimestamp = player.doneTimestamp
      return (
        <span className="winner">WINNER!</span>
      )
    }
    return (
      <div className="delta-to-fastest">
        {Math.round((player.doneTimestamp - winningTimestamp) / 1000)} seconds slower than winner.
      </div>
    )
  }

  playerIsPlayer(player: PlayerObject): boolean {
    return this.props.playerName === player.name
  }

  render(): JSX.Element {
    let rank = 0
    // @todo Rank by timestamp, not index :rolleyes.
    const rankedPlayers = _.orderBy(this.props.players, ['rank'], ['asc'])
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
            rankedPlayers.map((player: PlayerObject): JSX.Element => {
              const you = this.playerIsPlayer(player)
              rank++
              return (
                <tr key={player.name} className={you ? 'you' : ''}>
                  <td>{rank}</td>
                  <td>{player.name}</td>
                  <td>{player.fuckUps}</td>
                  <td>{this.getDeltaToFastestPlayer(player, rank)}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </
        div>
    )
  }
}

export default Results
