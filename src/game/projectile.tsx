import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PROJECTILE_SPEED,
} from '../constants'
import Movable from './Movable'
import { Vector2 } from 'three'

export default class Projectile extends Movable {
  id: string
  direction: Vector2
  valid: boolean = false

  constructor(id: string, position: Vector2, direction: Vector2) {
    super()

    this.id = id
    this.position = position.clone()
    this.direction = direction.clone().normalize()
  }

  setValid() {
    this.valid = true
  }

  tick(dt: number, save: boolean = false) {
    const delta = this.direction.clone().multiplyScalar(PROJECTILE_SPEED * dt)
    this.move(this.position, delta, save)
  }
}
