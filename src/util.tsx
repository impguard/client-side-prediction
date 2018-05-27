import { GAME_WIDTH, GAME_HEIGHT } from './constants'
import { Vector2 } from 'three'

export const drawGrid = (context: CanvasRenderingContext2D,
                         width: number,
                         height: number,
                         spacing: number = 100) => {

  context.beginPath()

  for (let x = 0; x < width; x += spacing) {
    context.moveTo(x, 0)
    context.lineTo(x, height)
  }

  for (let y = 0; y < height; y += spacing) {
    context.moveTo(0, y)
    context.lineTo(width, y)
  }

  context.strokeStyle = 'black'
  context.stroke()
}

export const vectorToString = (vector: Vector2) => {
  return `(${Math.round(vector.x)}, ${Math.round(vector.y)})`
}
