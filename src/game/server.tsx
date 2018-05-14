import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
  PLAYER_SPEED,
  KEYCODES,
} from '../constants'
import Renderer from './Renderer'
import Client from './Client'
import Player from './Player'
import Projectile from './Projectile'
import { drawGrid } from '../util'
import { GameState } from './types'
import { Vector2 } from 'three'
import { pickBy, values, keys, has, cloneDeep } from 'lodash/fp'


export default class Server extends Renderer {
  client: Client

  clean() {
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

  connect(client: Client) {
    this.client = client
  }

  send(state: GameState) {
    this.state.player.controls = state.player.controls
    this.state.player.frame = state.player.frame

    values(state.projectiles).forEach(projectile => {
      if (!projectile.valid && !has(projectile.id, this.state.projectiles)) {
        this.state.projectiles[projectile.id] = projectile
      }

      this.state.projectiles[projectile.id].frame = projectile.frame
    })
  }

  update(dt: number) {
    this.state.player.tick(dt)
    values(this.state.projectiles).forEach(projectile => {
      projectile.setValid()
      projectile.tick(dt)
    })

    const serverState = cloneDeep(this.state)
    window.setTimeout(() => {
      this.client.send(serverState)
    }, window.config.serverOWD)
  }
}
