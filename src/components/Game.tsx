import * as React from 'react'
import Client from '../game/client'
import Server from '../game/server'
import { GAME_WIDTH, GAME_HEIGHT } from '../constants'

declare global {
  interface Window {
    client: Client
    server: Server
  }
}

class Game extends React.Component {
  client: Client
  server: Server

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
