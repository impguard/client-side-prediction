import * as React from 'react'
import { GAME_HEIGHT, GAME_WIDTH } from '../constants'
import Client from '../game/Client'
import Server from '../game/Server'
import Debug from './Debug'

declare global {
  interface Window {
    client: Client
    server: Server
    config: {
      refreshRate: number
      buffer: number
      serverOWD: number
      clientOWD: number
      prediction: boolean
      reconciliation: boolean
    }
  }
}

class Game extends React.Component {
  private client: Client
  private server: Server

  private p1Canvas: React.RefObject<HTMLCanvasElement>
  private serverCanvas: React.RefObject<HTMLCanvasElement>

  constructor(props: any) {
    super(props)

    window.config = {
      refreshRate: 16,
      buffer: 20,
      clientOWD: 50,
      serverOWD: 50,
      prediction: true,
      reconciliation: true,
    }

    this.p1Canvas = React.createRef()
    this.serverCanvas = React.createRef()
  }

  public componentDidMount() {
    const serverCanvas = this.serverCanvas.current
    const p1Canvas = this.p1Canvas.current

    this.server = new Server(serverCanvas)
    this.client = new Client(p1Canvas)

    this.server.connect(this.client)
    this.client.connect(this.server)

    window.client = this.client
    window.server = this.server

    this.server.reset()
    this.server.start()

    const rtt = (window.config.clientOWD + window.config.serverOWD) / 2
    this.client.state.frame = Math.ceil(rtt / window.config.refreshRate + window.config.buffer)

    this.client.reset()
    this.client.start()
  }

  public render() {
    return (
      <div>
        <div className="title">Player 1</div>
        <canvas
          ref={this.p1Canvas}
          className="game"
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
        />
        <div className="title">Server</div>
        <canvas
          ref={this.serverCanvas}
          className="game"
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
        />
        <Debug />
      </div>
    )
  }
}

export default Game
