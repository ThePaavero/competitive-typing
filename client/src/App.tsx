import React from 'react'
import './App.scss'
import GameFrame from './components/GameFrame'
import PlayerList from './components/PlayerList'
import Results from './components/Results'

const url = 'ws://localhost:3030'

type AppProps = {}

type PlayerObject = {
  connection: object,
  ready: boolean,
  name: string,
  progress: number,
  done: boolean,
  doneTimestamp: number,
  fuckUps: number,
}

type AppState = {
  text: string,
  messages: Array<string>,
  players: Array<PlayerObject>,
  connection: any,
  ready: boolean,
  playerNameManuallySet: boolean,
  playerName: string | null,
  showResults: boolean,
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
      text: '',
      messages: [],
      players: [],
      ready: false,
      playerNameManuallySet: false,
      playerName: '',
      showResults: false,
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
      case 'SET_TEXT':
        this.setState({text: payload.data})
        break

      case 'MESSAGE':
        this.state.messages.push(payload.data)
        this.setState({messages: this.state.messages})
        break

      case 'ERROR_DUPLICATE_NAME':
        window.alert('ERROR:\n\nName is already taken. Please try again.')
        this.promptForName()
        return

      case 'UPDATE_PLAYERS':
        this.setState({players: payload.data})
        break

      case 'GAME_ENDED_SHOW_RESULTS':
        this.setState({showResults: true})
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
    const playerName: string | null = window.prompt('Enter player name', '')
    if (!playerName || playerName.trim() === '') {
      this.promptForName()
      return
    }
    this.sendToServer({
      type: 'SET_PLAYER_NAME',
      data: playerName
    })
    this.setState({
      playerNameManuallySet: true,
      playerName,
    })
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

  doOnDone() {
    console.log('DONE! @todo Do something?')
  }

  sendFuckupToServer(fuckUps: number): void {
    this.sendToServer({
      type: 'SET_FUCKUPS',
      data: fuckUps,
    })
  }

  onProgressChange(progress: number): void {
    this.sendToServer({
      type: 'SET_PROGRESS',
      data: progress,
    })
  }

  getGameFrame(): JSX.Element {
    if (this.state.showResults) {
      return <Results
        players={this.state.players}
        playerName={this.state.playerName}/>
    }
    return this.everyPlayerReady() ? (
      <GameFrame
        doOnDone={this.doOnDone.bind(this)}
        sendFuckupToServer={this.sendFuckupToServer.bind(this)}
        onProgressChange={this.onProgressChange.bind(this)}
        text={this.state.text}/>
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
          <PlayerList
            players={this.state.players}
            playerName={this.state.playerName}/>
        </div>
      </div>
    )
  }
}

export default App
