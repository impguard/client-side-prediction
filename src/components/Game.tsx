import * as React from 'react'
import { GAME_HEIGHT, GAME_WIDTH } from '../constants'
import Client from '../game/Client'
import Server from '../game/Server'

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
  private client: Client
  private server: Server

  private p1Canvas: React.RefObject<HTMLCanvasElement>
  private serverCanvas: React.RefObject<HTMLCanvasElement>

  constructor(props: any) {
    super(props)

    window.config = {
      clientOWD: 500,
      serverOWD: 500,
      prediction: true,
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
      </div>
    )
  }
}

export default Game
