import * as React from 'react'
import Client from '../game/client'
import { GAME_WIDTH, GAME_HEIGHT } from '../constants'

declare global {
  interface Window {
    client: Client
  }
}

class Game extends React.Component {
  client: Client

  componentDidMount() {
    const canvas = this.refs.game as HTMLCanvasElement

    this.client = new Client(canvas)
    this.client.reset()
    this.client.start()

    window.client = this.client
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
