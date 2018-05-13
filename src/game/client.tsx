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
import Player from './player'
import Projectile from './projectile'
import { Vector2 } from 'three'
import { includes } from 'lodash/fp'
import { v4 as uuid } from 'uuid'


interface ClientState {
  player: Player
  projectiles: Projectile[]
}

export default class Client {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  intervalId: number
  lastTick: number
  playing: boolean = false

  state: ClientState = {
    player: new Player(new Vector2(0, 0)),
    projectiles: [],
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
    const x = (GAME_WIDTH - PLAYER_WIDTH) / 2
    const y = (GAME_HEIGHT - PLAYER_HEIGHT) / 2

    this.ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)

    this.state.player.position.set(
      x + PLAYER_WIDTH / 2,
      y + PLAYER_HEIGHT / 2
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

    this.state.projectiles.push(projectile)
  }

  render() {
    this.clear()

    const x = this.state.player.position.x - PLAYER_WIDTH / 2
    const y = this.state.player.position.y - PLAYER_HEIGHT / 2
    this.ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT)

    this.state.projectiles.forEach(projectile => {
      const x = projectile.position.x - PROJECTILE_WIDTH / 2
      const y = projectile.position.y - PROJECTILE_HEIGHT / 2
      this.ctx.fillRect(x, y, PROJECTILE_WIDTH, PROJECTILE_HEIGHT)
    })
  }

  clean() {
    const filteredProjectiles = this.state.projectiles.filter(projectile =>
      !(projectile.position.x < -PROJECTILE_WIDTH
      || projectile.position.x > GAME_WIDTH + PROJECTILE_WIDTH
      || projectile.position.y < -PROJECTILE_HEIGHT
      || projectile.position.y > GAME_HEIGHT + PROJECTILE_HEIGHT)
    )

    this.state.projectiles = filteredProjectiles
  }

  tick(nowish: number) {
    const dt = nowish - this.lastTick
    this.lastTick = nowish

    this.state.player.tick(dt)
    this.state.projectiles.forEach(projectile => projectile.tick(dt))

    this.render()
    this.clean()

    if (this.playing) {
      window.requestAnimationFrame(this.tick.bind(this))
    }
  }
}
