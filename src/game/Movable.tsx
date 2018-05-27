import { Vector2 } from 'three'
import { filter } from 'lodash/fp'

interface Move {
  frame: number
  delta: Vector2
  position: Vector2
}

export default class Movable {
  public position: Vector2 = new Vector2(0, 0)
  public history: Move[] = []

  public reconcile(frame: number, position: Vector2) {
    this.history = filter(move => move.frame > frame, this.history)

    if (this.history.length === 0) {
      return
    }

    this.position = position
    for (const move of this.history) {
      this.move(move.frame, move.delta)
      move.position = this.position
    }
  }

  protected move(frame: number, delta: Vector2, save: boolean = false) {
    this.position.add(delta)

    if (save) {
      const move = {
        frame,
        delta,
        position: this.position.clone(),
      }

      this.history.push(move)
    }
  }
}
