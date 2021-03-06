import React from 'react'
import _ from 'lodash'
import PlayerObject from './../types/PlayerObject'

interface ResultsProps {
  players: Array<PlayerObject>
  playerName: string | null
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
    let deltaToWinner: string | number = Math.round((player.doneTimestamp - winningTimestamp) / 1000)
    if (deltaToWinner > 0) {
      deltaToWinner = deltaToWinner + ' seconds slower than winner.'
    } else {
      deltaToWinner = '-'
    }
    return (
      <div className="delta-to-fastest">
        {deltaToWinner}
      </div>
    )
  }

  playerIsPlayer(player: PlayerObject): boolean {
    return this.props.playerName === player.name
  }

  rejoin(): void {
    window.location.reload()
  }

  render(): JSX.Element {
    let rank: number = 0
    const rankedPlayers: Array<PlayerObject> = _.orderBy(this.props.players, ['doneTimestamp'], ['asc'])
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
              const you: boolean = this.playerIsPlayer(player)
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
        <button onClick={this.rejoin}>Rejoin</button>
      </div>
    )
  }
}

export default Results
