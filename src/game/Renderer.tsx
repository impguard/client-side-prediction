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
import Server from './Server'
import Player from './Player'
import Projectile from './Projectile'
import { GameState } from './types'
import { drawGrid } from '../util'
import { Vector2 } from 'three'
import { has, values, includes, cloneDeep } from 'lodash/fp'
import { v4 as uuid } from 'uuid'


export default class Renderer {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
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

  clear() {
    this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
  }

  reset() {
    this.clear()

    this.state.player.position.set(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2
    )
    this.state.projectiles = {}
  }

  start() {
    this.lastTick = performance.now()
    this.playing = true
    window.requestAnimationFrame(this.tick.bind(this))
  }

  stop() {
    this.playing = false
  }

  render() {
    this.clear()

    drawGrid(this.ctx, GAME_WIDTH, GAME_HEIGHT)

    const x = this.state.player.position.x - PLAYER_WIDTH / 2
    const y = this.state.player.position.y - PLAYER_HEIGHT / 2
    this.ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)

    values(this.state.projectiles).forEach(projectile => {
      const x = projectile.position.x - PROJECTILE_WIDTH / 2
      const y = projectile.position.y - PROJECTILE_HEIGHT / 2
      this.ctx.fillRect(x, y, PROJECTILE_WIDTH, PROJECTILE_HEIGHT)
    })
  }

  tick(timestamp: number) {
    const dt = timestamp - this.lastTick
    this.lastTick = timestamp

    this.tick(dt)

    this.render()

    if(this.playing) {
      window.requestAnimationFrame(this.tick.bind(this))
    }
  }

  update(dt: number) {
    throw new Error('Update is not implemented')
  }
}
