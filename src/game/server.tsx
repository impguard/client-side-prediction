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
import Client from './Client'
import Player from './Player'
import Projectile from './Projectile'
import { GameState } from './types'
import { Vector2 } from 'three'
import { pickBy, values, keys, has, cloneDeep } from 'lodash/fp'


export default class Server {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  client: Client
  lastTick: number
  playing: boolean = false

  state: GameState = {
    player: new Player(),
    projectiles: {}
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
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
    this.state.player.frame = state.player.frame

    values(state.projectiles).forEach(projectile => {
      if (!projectile.valid && !has(projectile.id, this.state.projectiles)) {
        this.state.projectiles[projectile.id] = projectile
      }

      this.state.projectiles[projectile.id].frame = projectile.frame
    })
  }

  clear() {
    this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
  }

  render() {
    this.clear()

    const x = this.state.player.position.x - PLAYER_WIDTH / 2
    const y = this.state.player.position.y - PLAYER_HEIGHT / 2
    this.ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)

    values(this.state.projectiles).forEach(projectile => {
      if (!window.config.prediction && !projectile.valid) return

      const x = projectile.position.x - PROJECTILE_WIDTH / 2
      const y = projectile.position.y - PROJECTILE_HEIGHT / 2
      this.ctx.fillRect(x, y, PROJECTILE_WIDTH, PROJECTILE_HEIGHT)
    })
  }

  tick(timestamp: number) {
    const dt = timestamp - this.lastTick
    this.lastTick = timestamp

    this.state.player.tick(dt)
    values(this.state.projectiles).forEach(projectile => {
      projectile.setValid()
      projectile.tick(dt)
    })

    this.clean()

    this.render()

    const serverState = cloneDeep(this.state)
    window.setTimeout(() => {
      this.client.send(serverState)
    }, window.config.serverOWD)

    if (this.playing) {
      window.requestAnimationFrame(this.tick.bind(this))
    }
  }
}
