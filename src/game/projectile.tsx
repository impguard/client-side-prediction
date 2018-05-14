import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
  PROJECTILE_SPEED,
} from '../constants'
import Movable from './Movable'
import { Vector2 } from 'three'

export default class Projectile extends Movable {
  public id: string
  public direction: Vector2
  public deleted: boolean = false

  private buffer: number = 10

  constructor(id: string, position: Vector2, direction: Vector2) {
    super()

    this.id = id
    this.position = position.clone()
    this.direction = direction.clone().normalize()
  }

  public updateDelete() {
    const isInPlay =
      this.position.x > -PROJECTILE_WIDTH - this.buffer
      && this.position.x < GAME_WIDTH + PROJECTILE_WIDTH + this.buffer
      && this.position.y > -PROJECTILE_HEIGHT - this.buffer
      && this.position.y < GAME_HEIGHT + PROJECTILE_HEIGHT + this.buffer

    this.deleted = !isInPlay
  }

  public update(dt: number, save: boolean = false) {
    const delta = this.direction.clone().multiplyScalar(PROJECTILE_SPEED * dt)
    this.move(this.position, delta, save)
  }
}
