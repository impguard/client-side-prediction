import Player from './Player'
import Projectile from './Projectile'

export interface GameState {
  frame: number
  player: Player
  projectiles: {
    [prop: string]: Projectile
  }
}
