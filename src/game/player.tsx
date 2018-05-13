import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
} from '../constants'
import { Vector2 } from 'three'

interface Controls {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export default class Player {
  position: Vector2
  controls: Controls = { up: false, down: false, left: false, right: false }

  constructor(position: Vector2) {
    this.position = position.clone()
  }

  tick(dt: number) {
    const deltaPos = new Vector2(
      (this.controls.left ? -1 : 0) +
      (this.controls.right ? 1 : 0),
      (this.controls.up ? -1 : 0) +
      (this.controls.down ? 1 : 0)
    )

    deltaPos.normalize().multiplyScalar(PLAYER_SPEED * dt)
    this.position.add(deltaPos)
    this.position.clamp(
      new Vector2(PLAYER_WIDTH / 2, PLAYER_HEIGHT / 2),
      new Vector2(GAME_WIDTH - PLAYER_WIDTH / 2, GAME_HEIGHT - PLAYER_HEIGHT / 2)
    )
  }
}
