const websocket = require('ws')
const http = require('http')
const express = require('express')
const texts = require('./../data/texts')
const rooms = require('./../data/rooms')
const app = express()
const server = http.createServer(app)

wss = new websocket.Server({server})
app.on('upgrade', wss.handleUpgrade)

const port = 3030

const state = {
  players: [],
  gameHasStarted: false,
  currentText: '',
}

state.currentText = texts[1].string // @todo

let runningPlayerNumber = 1

wss.on('connection', connection => {

  runningPlayerNumber++

  const playerName = `Player ${runningPlayerNumber}`
  const playerObject = {
    connection,
    name: playerName,
    progress: 0,
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
        if (playerNameExists(msg.data.trim())) {
          console.log('Duplicate player name, rejecting...')
          send(connection, {type: 'ERROR_DUPLICATE_NAME'})
          return
        }
        console.log('Setting player name from "' + (getPlayerByConnection(connection).name) + '" to "' + msg.data + '"')
        getPlayerByConnection(connection).name = msg.data
        broadcastNewPlayerData()
        break

      case 'SET_READY':
        getPlayerByConnection(connection).ready = msg.data
        console.log(`Player "${getPlayerByConnection(connection).name}" marked as READY.`)
        broadcastNewPlayerData()
        if (state.gameHasStarted) {
          broadcastNewText(state.currentText, connection)
          return
        }
        if (!state.gameHasStarted && allPlayersAreReady()) {
          console.log('All players are ready!')
          state.gameHasStarted = true
          broadcastNewText(state.currentText)
        }
        break
    }
  })

  connection.on('close', () => {
    console.log(`Player "${getPlayerByConnection(connection).name}" quit.`)
    state.players = state.players.filter(p => p.connection !== getPlayerByConnection(connection).connection)
    console.log('Players now online: ' + state.players.length)
    broadcastNewPlayerData()
  })
})

const playerNameExists = (name) => {
  return state.players.filter(p => p.name === name).length > 0
}

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
          progress: player.progress,
          ready: player.ready,
        }
      }),
    })
  })
}

const broadcastNewText = (text, singlePlayerConnection = null) => {
  if (singlePlayerConnection) {
    console.log(`Broadcasting new text to player "${getPlayerByConnection(singlePlayerConnection).name}".`)
    send(singlePlayerConnection, {
      type: 'SET_TEXT',
      data: text,
    })
    return
  }
  console.log(`Broadcasting new text to ${state.players.length} players.`)
  state.players.forEach(playerObject => {
    send(playerObject.connection, {
      type: 'SET_TEXT',
      data: text,
    })
  })
}

server.listen(port, () => {
  console.log(`Socket server is listenting @ ws://localhost:${port}`)
})

const send = (connection, data) => {
  connection.send(JSON.stringify(data))
}
