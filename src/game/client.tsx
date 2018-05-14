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
import { Vector2 } from 'three'
import { has, values, includes, cloneDeep } from 'lodash/fp'
import { v4 as uuid } from 'uuid'


export default class Client {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  server: Server
  intervalId: number
  lastTick: number
  playing: boolean = false

  state: GameState = {
    player: new Player(),
    projectiles: {}
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    document.addEventListener('keydown', this.keydown.bind(this))
    document.addEventListener('keyup', this.keyup.bind(this))
    document.addEventListener('click', this.click.bind(this))
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
  }

  start() {
    this.lastTick = performance.now()
    this.playing = true
    window.requestAnimationFrame(this.tick.bind(this))
  }

  stop() {
    this.playing = false
  }

  keypress(event: KeyboardEvent, isPressed: boolean) {
    const key = event.keyCode || event.which

    if (includes(key, KEYCODES.LEFT)) {
      this.state.player.controls.left = isPressed
    } else if (includes(key, KEYCODES.RIGHT)) {
      this.state.player.controls.right = isPressed
    } else if (includes(key, KEYCODES.UP)) {
      this.state.player.controls.up = isPressed
    } else if (includes(key, KEYCODES.DOWN)) {
      this.state.player.controls.down = isPressed
    } else if (includes(key, KEYCODES.Q)) {
      // TODO: what is going on here?
      if (this.state.player.speed === PLAYER_SPEED) {
        this.state.player.speed = PLAYER_SPEED * 2
      } else {
        this.state.player.speed = PLAYER_SPEED
      }
    } else {
      return
    }

    event.stopPropagation()
  }

  keydown(event: KeyboardEvent) {
    this.keypress(event, true)
  }

  keyup(event: KeyboardEvent) {
    this.keypress(event, false)
  }

  click(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect()

    const direction = new Vector2(
      event.clientX - rect.left,
      event.clientY - rect.top
    ).sub(this.state.player.position)

    const projectile = new Projectile(uuid(), this.state.player.position, direction)

    this.state.projectiles[projectile.id] = projectile
  }

  connect(server: Server) {
    this.server = server
  }

  send(state: GameState) {
    if (window.config.prediction) {
      this.state.player.reconcile(state.player.timestamp, state.player.position)
    } else {
      this.state.player.position = state.player.position
    }

    values(this.state.projectiles).forEach(projectile => {
      if (!projectile.valid || has(projectile.id, state.projectiles))
        return

      delete this.state.projectiles[projectile.id]
    })

    values(state.projectiles).forEach(projectile => {
      if (window.config.prediction && has(projectile.id, this.state.projectiles)) {
        this.state.projectiles[projectile.id].reconcile(projectile.timestamp, projectile.position)
      } else {
        this.state.projectiles[projectile.id] = projectile
      }
    })
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

    this.render()

    if (window.config.prediction) {
      this.state.player.tick(timestamp, dt, window.config.prediction)
      values(this.state.projectiles).forEach(projectile => {
        projectile.tick(timestamp, dt, window.config.prediction)
      })
    }

    const state = cloneDeep(this.state)
    window.setTimeout(() => {
      this.server.send(state)
    }, window.config.clientOWD)

    if (this.playing) {
      window.requestAnimationFrame(this.tick.bind(this))
    }
  }
}
