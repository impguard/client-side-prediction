import * as React from 'react'
import { Vector2 } from 'three'
import { vectorToString } from '../util'
import { PLAYER_SPEED } from '../constants'

interface DebugState {
  clientFrame: number
  serverFrame: number
  prediction: boolean
  reconciliation: boolean
  buffer: number
  clientOWD: number
  serverOWD: number
  clientPosition: Vector2
  serverPosition: Vector2
  speedhack: boolean
}

class Debug extends React.Component<{}, DebugState> {
  private boundUpdate = this.update.bind(this)
  private boundHandleCheck = this.handleCheck.bind(this)
  private boundHandleText = this.handleText.bind(this)

  constructor(props: any) {
    super(props)

    this.state = {
      clientFrame: 0,
      serverFrame: 0,
      clientPosition: new Vector2(0, 0),
      serverPosition: new Vector2(0, 0),
      speedhack: false,
      buffer: window.config.buffer,
      clientOWD: window.config.clientOWD,
      serverOWD: window.config.serverOWD,
      prediction: window.config.prediction,
      reconciliation: window.config.reconciliation,
    }
  }

  public componentDidMount() {
    window.requestAnimationFrame(this.boundUpdate)
  }

  public handleCheck(event: any) {
    const { checked, name } = event.target

    if (name === 'prediction' && !checked) {
      this.setState({
        reconciliation: false
      })
      window.config.reconciliation = false
    }

    if (name === 'speedhack') {
      const speed = PLAYER_SPEED * (checked ? 3 : 1)
      window.client.state.player.speed = speed
      this.setState({ speedhack: checked })
    }

    (window.config as any)[name] = checked
    this.setState({
      [name]: checked
    })
  }

  public handleText(event: any) {
    const { value, name } = event.target

    const num = +value;
    (window.config as any)[name] = num
    this.setState({
      [name]: num
    })
  }

  public render() {
    return (
      <div className="debug">
        <div>Client Frame: {this.state.clientFrame}</div>
        <div>Server Frame: {this.state.serverFrame}</div>
        <div>Frame Delta: {this.state.clientFrame - this.state.serverFrame}</div>
        <div>Client Position: {vectorToString(this.state.clientPosition)}</div>
        <div>Server Position: {vectorToString(this.state.serverPosition)}</div>
        <form>
          <label>
            Server Command Buffer:
            <input
              type="number"
              name="buffer"
              value={this.state.buffer}
              onChange={this.boundHandleText}
            />
          </label>
          <br />
          <label>
            Client Delay:
            <input
              type="number"
              name="clientOWD"
              value={this.state.clientOWD}
              onChange={this.boundHandleText}
            />
          </label>
          <br />
          <label>
            Server Delay:
            <input
              type="number"
              name="serverOWD"
              value={this.state.serverOWD}
              onChange={this.boundHandleText}
            />
          </label>
          <br />
          <label>
            Prediction:
            <input
              type="checkbox"
              name="prediction"
              checked={this.state.prediction}
              onChange={this.boundHandleCheck}
            />
          </label>
          <br />
          <label>
            Reconciliation:
            <input
              type="checkbox"
              name="reconciliation"
              checked={this.state.reconciliation}
              onChange={this.boundHandleCheck}
            />
          </label>
          <br />
          <label>
            Speed Hack:
            <input
              type="checkbox"
              name="speedhack"
              checked={this.state.speedhack}
              onChange={this.boundHandleCheck}
            />
          </label>
        </form>
      </div>
    )
  }

  private update() {
    this.setState({
      clientFrame: window.client.state.frame,
      serverFrame: window.server.state.frame,
      clientPosition: window.client.state.player.position,
      serverPosition: window.server.state.player.position,
    })

    window.requestAnimationFrame(this.boundUpdate)
  }
}

export default Debug
