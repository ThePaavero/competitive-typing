import React from 'react'
import './App.scss'
import GameFrame from './components/GameFrame'
import PlayerList from './components/PlayerList'

const url = 'ws://localhost:3030'

type AppProps = {}

type PlayerObject = {
  connection: object,
  ready: boolean,
  name: string,
  points: number,
}

type AppState = {
  sentence: string,
  messages: Array<string>,
  players: Array<PlayerObject>,
  connection: any,
  ready: boolean,
  playerNameManuallySet: boolean,
}

type ServerEvent = {
  type: string,
  data: any,
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props)

    this.state = {
      connection: null,
      sentence: '',
      messages: [],
      players: [],
      ready: false,
      playerNameManuallySet: false,
    }

    this.sendToServer = this.sendToServer.bind(this)

    const connection = new WebSocket(url)
    connection.addEventListener('open', (event: any): any => {
      this.setState({connection})
      this.state.messages.push('Successfully connected with the server.')
      this.setState({messages: this.state.messages})
    })

    connection.onerror = (e: any): any => {
      console.warn(e)
    }

    connection.onclose = (e: any): any => {
      window.alert('Server was restarted, session lost. Refreshing.')
      window.location.reload(true)
    }

    connection.onmessage = (event: ServerEvent): void => {
      this.handleMessageFromServer(event.data)
    }
  }

  handleMessageFromServer(event: string): void {
    const payload = JSON.parse(event)

    switch (payload.type) {
      case 'SET_SENTENCE':
        this.setState({sentence: payload.data})
        break

      case 'MESSAGE':
        this.state.messages.push(payload.data)
        this.setState({messages: this.state.messages})
        break

      case 'ERROR_MESSAGE':
        window.alert('ERROR:\n\n' + payload.data.trim())
        this.promptForName()
        return

      case 'UPDATE_PLAYERS':
        this.setState({players: payload.data})
        break
    }
  }

  componentDidMount(): void {
  }

  componentWillUnmount(): void {
  }

  sendToServer(messageObject: object): void {
    if (!this.state.connection) {
      return console.warn('NO CONNECTION')
    }
    const message = JSON.stringify(messageObject)
    console.log('Sending to server:', message)
    this.state.connection.send(message)
  }

  getReadyButton(): JSX.Element | null {
    if (this.state.ready || !this.state.playerNameManuallySet) {
      return null
    }
    return (
      <button onClick={() => {
        this.setState({ready: true})
        this.sendToServer({
          type: 'SET_READY',
          data: true,
        })
      }}>
        Ready!
      </button>
    )
  }

  promptForName() {
    const playerName = window.prompt('Enter player name')
    this.sendToServer({
      type: 'SET_PLAYER_NAME',
      data: playerName
    })
    this.setState({playerNameManuallySet: true})
  }

  getSetPlayerNameButton(): JSX.Element | null {
    if (this.state.playerNameManuallySet) {
      return null
    }
    return (
      <button onClick={this.promptForName.bind(this)}>
        Set player name
      </button>
    )
  }

  everyPlayerReady(): boolean {
    return this.state.players.filter((player: PlayerObject) => !player.ready).length < 1
  }

  getGameFrame(): JSX.Element {
    return this.everyPlayerReady() ? (
      <GameFrame sentence={this.state.sentence}/>
    ) : (
      <div className="waiting-for-players">
        Waiting for all players to be ready...
      </div>
    )
  }

  render(): JSX.Element {
    return (
      <div className="App">
        {this.getReadyButton()}
        {this.getSetPlayerNameButton()}
        {this.getGameFrame()}
        <div className="players">
          <PlayerList players={this.state.players}/>
        </div>
        <pre className='state-debug'>
          {JSON.stringify(this.state, null, 2)}
        </pre>
      </div>
    )
  }
}

export default App
