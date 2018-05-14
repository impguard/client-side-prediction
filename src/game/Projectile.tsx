import {
  PROJECTILE_SPEED,
} from '../constants'
import Movable from './Movable'
import { Vector2 } from 'three'

export default class Projectile extends Movable {
  public id: string
  public direction: Vector2
  public valid: boolean = false

  constructor(id: string, position: Vector2, direction: Vector2) {
    super()

    this.id = id
    this.position = position.clone()
    this.direction = direction.clone().normalize()
  }

  public setValid() {
    this.valid = true
  }

  public update(dt: number, save: boolean = false) {
    const delta = this.direction.clone().multiplyScalar(PROJECTILE_SPEED * dt)
    this.move(this.position, delta, save)
  }
}
