import Renderer from './Renderer'
import Client from './Client'
import { GameState } from './types'
import { values, cloneDeep } from 'lodash/fp'

export default class Server extends Renderer {
  public client: Client

  public connect(client: Client) {
    this.client = client
  }

  public send(state: GameState) {
    this.state.player.controls = state.player.controls
    this.state.player.frame = state.player.frame

    values(state.projectiles).forEach(projectile => {
      const isFound = !!this.state.projectiles[projectile.id]
      const isDeleted = projectile.deleted

      if (isFound || isDeleted) {
        return
      }

      this.state.projectiles[projectile.id] = projectile
    })
  }

  protected update(dt: number) {
    this.state.player.update(dt)
    values(this.state.projectiles).forEach(projectile => {
      projectile.update(dt)
      projectile.updateDelete()
    })

    const state = cloneDeep(this.state)
    window.setTimeout(() => {
      this.client.send(state)
    }, window.config.serverOWD)
  }
}
