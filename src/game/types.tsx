import Player from './player'
import Projectile from './projectile'

export interface GameState {
  player: Player
  projectiles: any
}

