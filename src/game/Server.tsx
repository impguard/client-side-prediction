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
      if (!!this.state.projectiles[projectile.id]) {
        return
      }

      this.state.projectiles[projectile.id] = projectile
    })
  }

  protected update(dt: number) {
    this.state.player.update(dt)
    values(this.state.projectiles).forEach(projectile => {
      projectile.setValid()
      projectile.update(dt)
    })

    const serverState = cloneDeep(this.state)
    window.setTimeout(() => {
      this.client.send(serverState)
    }, window.config.serverOWD)
  }
}
