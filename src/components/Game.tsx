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
      serverOWD: 100,
      clientOWD: 100,
      prediction: true,
    }
  }

  componentDidMount() {
    const canvas = this.refs.game as HTMLCanvasElement

    this.server = new Server()
    this.client = new Client(canvas)

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
      <canvas
        ref="game"
        className="game"
        width={GAME_WIDTH}
        height={GAME_HEIGHT} />
    )
  }
}

export default Game
