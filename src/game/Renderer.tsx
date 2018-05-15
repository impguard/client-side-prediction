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

  private boundTick: (timestamp: number) => void
  private id: number

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    this.boundTick = this.tick.bind(this)
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
    this.id = window.setInterval(
      this.boundTick,
      window.config.refreshRate,
      window.config.refreshRate
    )
  }

  public stop() {
    window.clearInterval(this.id)
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

  private tick(dt: number) {
    this.update(dt)

    this.render()
    this.clean()
  }

  private clean() {
    const filteredProjectiles = pickBy(
      projectile => !projectile.deleted,
      this.state.projectiles
    )

    this.state.projectiles = filteredProjectiles
  }
}
