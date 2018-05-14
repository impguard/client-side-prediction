import { Vector2 } from 'three'
import { filter } from 'lodash/fp'

interface Move {
  timestamp: number
  position: Vector2
  direction: Vector2
  speed: number
}

export default class Movable {
  timestamp: number
  position: Vector2 = new Vector2(0, 0)
  history: Move[] = []

  move(timestamp: number, dt: number, direction: Vector2, speed: number, save: boolean = false) {
    this.timestamp = timestamp

    const delta = direction.clone().normalize().multiplyScalar(speed * dt)
    this.position.add(delta)

    if (save) {
      const move = {
        timestamp,
        position: this.position.clone(),
        direction: direction.clone(),
        speed
      }

      this.history.push(move)
    }
  }

  reconcile(timestamp: number, position: Vector2) {
    const newHistory = filter(move => move.timestamp > timestamp, this.history)

    let currPosition = position
    let currTimestamp = timestamp
    for (let i = 0; i < newHistory.length; i++) {
      const move = newHistory[i]
      const dt = move.timestamp - currTimestamp
      const delta = move.direction.clone().normalize().multiplyScalar(move.speed * dt)
      const newPos = currPosition.clone().add(delta)

      if (newPos.equals(move.position) && move.timestamp === currTimestamp) {
        break
      }

      currPosition = move.position
      currTimestamp = move.timestamp
    }

    this.position = newHistory[newHistory.length - 1].position
    this.history = newHistory
  }
}
