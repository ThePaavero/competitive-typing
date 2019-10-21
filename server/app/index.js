const websocket = require('ws')
const http = require('http')
const express = require('express')
const sentences = require('./../data/sentences')
const app = express()
const server = http.createServer(app)

wss = new websocket.Server({server})
app.on('upgrade', wss.handleUpgrade)

const port = 3030

const state = {
  players: [],
  gameHasStarted: false,
}

let runningPlayerNumber = 1

wss.on('connection', connection => {

  runningPlayerNumber++

  const playerName = `Player ${runningPlayerNumber}`
  const playerObject = {
    connection,
    name: playerName,
    points: 0,
    wpm: 0,
    ready: false,
  }

  state.players.push(playerObject)

  console.log(`A new player ("${playerName}") connected. (${state.players.length}) players online.`)

  broadcastNewPlayerData()

  send(connection, {
    type: 'MESSAGE',
    data: 'You are connected. Welcome!'
  })

  connection.on('message', msg => {
    msg = JSON.parse(msg)
    switch (msg.type) {
      case 'SET_PLAYER_NAME':
        console.log('Setting player name from "' + (getPlayerByConnection(connection).name) + '" to "' + msg.data + '"')
        getPlayerByConnection(connection).name = msg.data
        broadcastNewPlayerData()
        break
      case 'SET_READY':
        getPlayerByConnection(connection).ready = msg.data
        console.log(`Player "${getPlayerByConnection(connection).name}" marked as READY.`)
        broadcastNewPlayerData()
        if (!state.gameHasStarted && allPlayersAreReady()) {
          console.log('All players are ready!')
          state.gameHasStarted = true
          broadcastNewSentence(sentences[0].string)
        }
        break
    }
  })

  connection.on('close', () => {
    state.players = state.players.filter(p => p.connection !== getPlayerByConnection(connection).connection)
    console.log('Players now online: ' + state.players.length)
    broadcastNewPlayerData()
  })
})

const allPlayersAreReady = () => {
  return state.players.filter(player => player.ready).length === state.players.length
}

const getPlayerByConnection = (connection) => {
  return state.players.find(p => p.connection === connection)
}

const broadcastNewPlayerData = () => {
  state.players.forEach(playerObject => {
    send(playerObject.connection, {
      type: 'UPDATE_PLAYERS',
      data: state.players.map(player => {
        return {
          name: player.name,
          points: player.points,
          wpm: player.wpm,
          ready: player.ready,
        }
      }),
    })
  })
}

const broadcastNewSentence = (sentence) => {
  console.log(`Broadcasting new sentence to ${state.players.length} players.`)
  state.players.forEach(playerObject => {
    send(playerObject.connection, {
      type: 'SET_SENTENCE',
      data: sentence,
    })
  })
}

server.listen(port, () => {
  console.log(`Socket server is listenting @ ws://localhost:${port}`)
})

const send = (connection, data) => {
  connection.send(JSON.stringify(data))
}
