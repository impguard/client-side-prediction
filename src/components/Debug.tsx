import * as React from 'react'
import { Vector2 } from 'three'
import { vectorToString } from '../util'

interface DebugState {
  clientFrame: number
  serverFrame: number
  clientPosition: Vector2
  serverPosition: Vector2
}

class Debug extends React.Component<{}, DebugState> {
  private boundUpdate = this.update.bind(this)

  constructor(props: any) {
    super(props)

    this.state = {
      clientFrame: 0,
      serverFrame: 0,
      clientPosition: new Vector2(0, 0),
      serverPosition: new Vector2(0, 0)
    }
  }

  public componentDidMount() {
    window.requestAnimationFrame(this.boundUpdate)
  }

  public render() {
    return (
      <div className="debug">
        <div>Client Frame: {this.state.clientFrame}</div>
        <div>Server Frame: {this.state.serverFrame}</div>
        <div>Client Position: {vectorToString(this.state.clientPosition)}</div>
        <div>Server Position: {vectorToString(this.state.serverPosition)}</div>
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
