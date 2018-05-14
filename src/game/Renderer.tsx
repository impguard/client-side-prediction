import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
} from '../constants'
import Player from './Player'
import { GameState } from './types'
import { drawGrid } from '../util'
import { values, pickBy } from 'lodash/fp'

export default class Renderer {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public state: GameState = {
    player: new Player(),
    projectiles: {}
  }

  private lastTick: number
  private playing: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  public clear() {
    this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
  }

  public reset() {
    this.clear()

    this.state.player.position.set(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2
    )
    this.state.projectiles = {}
  }

  public start() {
    this.lastTick = performance.now()
    this.playing = true
    window.requestAnimationFrame(this.tick.bind(this))
  }

  public stop() {
    this.playing = false
  }

  protected update(dt: number) {
    throw new Error('Update is not implemented')
  }

  private render() {
    this.clear()

    drawGrid(this.ctx, GAME_WIDTH, GAME_HEIGHT)

    const x = this.state.player.position.x - PLAYER_WIDTH / 2
    const y = this.state.player.position.y - PLAYER_HEIGHT / 2
    this.ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)

    values(this.state.projectiles).forEach(projectile => {
      const px = projectile.position.x - PROJECTILE_WIDTH / 2
      const py = projectile.position.y - PROJECTILE_HEIGHT / 2
      this.ctx.fillRect(px, py, PROJECTILE_WIDTH, PROJECTILE_HEIGHT)
    })
  }

  private tick(timestamp: number) {
    const dt = timestamp - this.lastTick
    this.lastTick = timestamp

    this.tick(dt)

    this.render()
    this.clean()

    if (this.playing) {
      window.requestAnimationFrame(this.tick.bind(this))
    }
  }

  private clean() {
    const filteredProjectiles = pickBy(
      projectile => !projectile.deleted,
      this.state.projectiles
    )

    this.state.projectiles = filteredProjectiles
  }
}
