import * as React from 'react'
import Client from '../game/client'
import Server from '../game/server'
import { GAME_WIDTH, GAME_HEIGHT } from '../constants'

declare global {
  interface Window {
    client: Client
    server: Server
    config: {
      serverOWD: number
      clientOWD: number
      prediction: boolean
    }
  }
}

class Game extends React.Component {
  client: Client
  server: Server

  constructor(props: any) {
    super(props)

    window.config = {
      serverOWD: 500,
      clientOWD: 500,
      prediction: true,
    }
  }

  componentDidMount() {
    const oneCanvas = this.refs.player1 as HTMLCanvasElement
    const serverCanvas = this.refs.server as HTMLCanvasElement

    this.server = new Server(serverCanvas)
    this.client = new Client(oneCanvas)

    this.server.connect(this.client)
    this.client.connect(this.server)

    window.client = this.client
    window.server = this.server

    this.server.reset()
    this.server.start()

    this.client.reset()
    this.client.start()
  }

  render() {
    return (
      <div>
        <div className="title">Player 1</div>
        <canvas
          ref="player1"
          className="game"
          width={GAME_WIDTH}
          height={GAME_HEIGHT} />
        <div className="title">Server</div>
        <canvas
          ref="server"
          className="game"
          width={GAME_WIDTH}
          height={GAME_HEIGHT} />
      </div>
    )
  }
}

export default Game
