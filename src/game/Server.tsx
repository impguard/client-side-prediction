import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
} from '../constants'
import Renderer from './Renderer'
import Client from './Client'
import { GameState } from './types'
import { pickBy, values, has, cloneDeep } from 'lodash/fp'

export default class Server extends Renderer {
  public client: Client

  // TODO: fix
  public clean() {
    const filteredProjectiles = pickBy(projectile => {
      const should = !(projectile.position.x < -PROJECTILE_WIDTH
      || projectile.position.x > GAME_WIDTH + PROJECTILE_WIDTH
      || projectile.position.y < -PROJECTILE_HEIGHT
      || projectile.position.y > GAME_HEIGHT + PROJECTILE_HEIGHT)

      return should
    }
    , this.state.projectiles)

    this.state.projectiles = filteredProjectiles
  }

  public connect(client: Client) {
    this.client = client
  }

  public send(state: GameState) {
    this.state.player.controls = state.player.controls
    this.state.player.frame = state.player.frame

    values(state.projectiles).forEach(projectile => {
      if (!projectile.valid && !has(projectile.id, this.state.projectiles)) {
        this.state.projectiles[projectile.id] = projectile
      }

      this.state.projectiles[projectile.id].frame = projectile.frame
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
