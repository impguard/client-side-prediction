import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
} from '../constants'
import Movable from './Movable'
import { Vector2 } from 'three'

interface Controls {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export default class Player extends Movable {
  public controls: Controls = { up: false, down: false, left: false, right: false }
  public speed = PLAYER_SPEED

  public update(dt: number, save: boolean = false) {
    const direction = new Vector2(
      (this.controls.left ? -1 : 0) +
      (this.controls.right ? 1 : 0),
      (this.controls.up ? -1 : 0) +
      (this.controls.down ? 1 : 0)
    )

    const delta = direction.normalize().multiplyScalar(this.speed * dt)
    this.move(this.position, delta, save)

    this.position.clamp(
      new Vector2(PLAYER_WIDTH / 2, PLAYER_HEIGHT / 2),
      new Vector2(GAME_WIDTH - PLAYER_WIDTH / 2, GAME_HEIGHT - PLAYER_HEIGHT / 2)
    )
  }
}
