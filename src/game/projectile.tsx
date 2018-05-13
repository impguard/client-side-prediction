import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PROJECTILE_SPEED,
} from '../constants'
import { Vector2 } from 'three'

export default class Projectile {
  id: string
  position: Vector2
  direction: Vector2

  constructor(id: string, position: Vector2, direction: Vector2) {
    this.id = id
    this.position = position.clone()
    this.direction = direction
      .clone()
      .normalize()
      .multiplyScalar(PROJECTILE_SPEED)
  }

  tick(dt: number) {
    const deltaPos = this.direction.clone().multiplyScalar(dt)
    this.position.add(deltaPos)
  }
}
