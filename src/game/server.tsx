import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
} from '../constants'
import Client from './client'
import Player from './player'
import Projectile from './projectile'
import { GameState } from './types'
import { Vector2 } from 'three'
import { pickBy, values, keys, has, cloneDeep } from 'lodash/fp'


export default class Server {
  lastTick: number
  playing: boolean = false
  client: Client

  state: GameState = {
    player: new Player(new Vector2(0, 0)),
    projectiles: {}
  }

  reset() {
    this.state.player.position.set(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2
    )
  }

  start() {
    this.lastTick = performance.now()
    this.playing = true
    window.requestAnimationFrame(this.tick.bind(this))
  }

  clean() {
    const filteredProjectiles = pickBy(projectile =>
      !(projectile.position.x < -PROJECTILE_WIDTH
      || projectile.position.x > GAME_WIDTH + PROJECTILE_WIDTH
      || projectile.position.y < -PROJECTILE_HEIGHT
      || projectile.position.y > GAME_HEIGHT + PROJECTILE_HEIGHT)
    , this.state.projectiles)

    this.state.projectiles = filteredProjectiles
  }

  connect(client: Client) {
    this.client = client
  }

  send(state: GameState) {
    this.state.player.controls = state.player.controls

    values(state.projectiles).forEach(projectile => {
      if (projectile.valid || has(projectile.id, this.state.projectiles))
        return

      this.state.projectiles[projectile.id] = projectile
    })
  }

  tick(nowish: number) {
    const dt = nowish - this.lastTick
    this.lastTick = nowish

    this.state.player.tick(dt)
    values(this.state.projectiles).forEach(projectile => {
      projectile.setValid()
      projectile.tick(dt)
    })

    const state = cloneDeep(this.state)
    window.setTimeout(() => {
      this.client.send(state)
    }, 100)

    this.clean()

    if (this.playing) {
      window.requestAnimationFrame(this.tick.bind(this))
    }
  }
}
