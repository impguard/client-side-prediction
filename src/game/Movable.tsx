import { Vector2 } from 'three'
import { filter } from 'lodash/fp'

interface Move {
  frame: number
  delta: Vector2
  position: Vector2
}

export default class Movable {
  frame: number = 0
  position: Vector2 = new Vector2(0, 0)
  history: Move[] = []

  incrementFrame() {
    this.frame += 1
  }

  move(position: Vector2, delta: Vector2, save: boolean = false) {
    this.position.add(delta)

    if (save) {
      const move = {
        frame: this.frame,
        position: this.position.clone(),
        delta
      }

      this.history.push(move)
    }
  }

  reconcile(frame: number, position: Vector2) {
    const newHistory = filter(move => move.frame > frame, this.history)
    this.history = newHistory

    if (newHistory.length === 0) {
      return
    }

    let currPosition = position
    for (let i = 0; i < newHistory.length; i++) {
      const move = newHistory[i]
      const newPos = currPosition.clone().add(move.delta)

      if (newPos.equals(move.position)) {
        break
      }

      move.position = newPos

      currPosition = move.position
    }

    this.position = newHistory[newHistory.length - 1].position
  }
}
