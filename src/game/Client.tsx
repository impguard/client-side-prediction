import {
  PLAYER_SPEED,
  KEYCODES,
} from '../constants'
import Renderer from './Renderer'
import Server from './Server'
import Projectile from './Projectile'
import { GameState } from './types'
import { Vector2 } from 'three'
import { values, includes, cloneDeep } from 'lodash/fp'
import { v4 as uuid } from 'uuid'
import { frameDelta } from '../util'

export default class Client extends Renderer {
  public server: Server

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    document.addEventListener('keydown', this.keydown.bind(this))
    document.addEventListener('keyup', this.keyup.bind(this))
    canvas.addEventListener('click', this.click.bind(this))
  }

  public connect(server: Server) {
    this.server = server
  }

  public send(state: GameState) {
    this.state.frame += frameDelta(this.state.frame, state.frame)

    if (window.config.reconciliation) {
      this.state.player.reconcile(state.frame, state.player.position)
    } else {
      this.state.player.position = state.player.position
    }

    values(state.projectiles).forEach(projectile => {
      const isMissing = !this.state.projectiles[projectile.id]
      const isDeleted = projectile.deleted

      if (isMissing && isDeleted) {
        return
      }

      if (isMissing) {
        this.state.projectiles[projectile.id] = projectile
      }

      if (window.config.reconciliation) {
        this.state.projectiles[projectile.id].deleted = projectile.deleted
        this.state.projectiles[projectile.id].reconcile(state.frame, projectile.position)
      } else {
        this.state.projectiles[projectile.id] = projectile
      }
    })
  }

  protected update(dt: number, frame: number) {
    if (window.config.prediction) {
      this.state.player.update(dt, frame, window.config.reconciliation)
      values(this.state.projectiles).forEach(projectile => {
        projectile.update(dt, frame, window.config.reconciliation)
      })
    }

    const state = cloneDeep(this.state)
    window.setTimeout(() => {
      this.server.send(state)
    }, window.config.clientOWD)
  }

  private keypress(key: number, isPressed: boolean) {
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

  private keydown(event: KeyboardEvent) {
    const key = event.keyCode || event.which
    this.keypress(key, true)

    if (includes(key, KEYCODES.Q)) {
      if (this.state.player.speed === PLAYER_SPEED) {
        this.state.player.speed = PLAYER_SPEED * 2
      } else {
        this.state.player.speed = PLAYER_SPEED
      }
    }
  }

  private keyup(event: KeyboardEvent) {
    const key = event.keyCode || event.which
    this.keypress(key, false)
  }

  private click(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect()
    const direction = new Vector2(
      event.clientX - rect.left,
      event.clientY - rect.top
    ).sub(this.state.player.position)

    const projectile = new Projectile(uuid(), this.state.player.position, direction)

    this.state.projectiles[projectile.id] = projectile
  }
}
