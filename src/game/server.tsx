import Renderer from './Renderer'
import Client from './Client'
import { GameState } from './types'
import { values, cloneDeep } from 'lodash/fp'

export default class Server extends Renderer {
  public client: Client
  private buffer: {
    [frame: number]: GameState
  } = {}

  public connect(client: Client) {
    this.client = client
  }

  public send(state: GameState) {
    this.buffer[state.frame] = state
  }

  protected update(dt: number, frame: number) {
    if (this.buffer[frame]) {
      this.updateState(this.buffer[frame])
      delete this.buffer[frame]
    }

    this.state.player.update(dt, frame)
    values(this.state.projectiles).forEach(projectile => {
      projectile.update(dt, frame)
      projectile.updateDelete()
    })

    const state = cloneDeep(this.state)
    window.setTimeout(() => {
      this.client.send(state)
    }, window.config.serverOWD)
  }

  private updateState(state: GameState) {
    this.state.player.controls = state.player.controls

    values(state.projectiles).forEach(projectile => {
      const isFound = !!this.state.projectiles[projectile.id]
      const isDeleted = projectile.deleted

      if (isFound || isDeleted) {
        return
      }

      this.state.projectiles[projectile.id] = projectile
    })
  }
}
