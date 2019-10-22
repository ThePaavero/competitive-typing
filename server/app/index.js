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
    done: false,
    doneTimestamp: null,
    fuckUps: 0,
  }

  state.players.push(playerObject)

  console.log(`A new player ("${playerName}") connected. (${state.players.length}) players online.`)

  broadcastNewPlayerData()

  send(connection, {
    type: 'MESSAGE',
    data: 'You are connected. Welcome!'
  })

  const player = getPlayerByConnection(connection)

  connection.on('message', msg => {
    msg = JSON.parse(msg)
    switch (msg.type) {

      case 'SET_PLAYER_NAME':
        if (playerNameExists(msg.data.trim())) {
          console.log('Duplicate player name, rejecting...')
          send(connection, {type: 'ERROR_DUPLICATE_NAME'})
          return
        }
        console.log('Setting player name from "' + (player.name) + '" to "' + msg.data + '"')
        player.name = msg.data
        broadcastNewPlayerData()
        break

      case 'SET_FUCKUPS':
        player.fuckUps = msg.data
        broadcastNewPlayerData()
        break

      case 'SET_READY':
        player.ready = msg.data
        console.log(`Player "${player.name}" marked as READY.`)
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

      case 'SET_PROGRESS':
        player.progress = msg.data
        if (msg.data > 99) {
          player.done = true
          player.doneTimestamp = new Date().getTime()

          // Are we the last to finish? If so, end the game and show the results.
          if (state.players.filter(p => p.done).length === state.players.length) {
            broadcastGameEndedResults()
          }
        }
        broadcastNewPlayerData()
        break
    }
  })

  connection.on('close', () => {
    console.log(`Player "${player.name}" quit.`)
    state.players = state.players.filter(p => p.connection !== player.connection)
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
          done: player.done,
          doneTimestamp: player.doneTimestamp,
          fuckUps: player.fuckUps,
        }
      }),
    })
  })
}

const broadcastGameEndedResults = () => {
  state.players.forEach(playerObject => {
    send(playerObject.connection, {
      type: 'GAME_ENDED_SHOW_RESULTS',
      data: null,
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
