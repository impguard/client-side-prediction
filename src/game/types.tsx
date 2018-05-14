import Player from './Player'
import Projectile from './Projectile'

export interface GameState {
  player: Player
  projectiles: {
    [prop: string]: Projectile
  }
}
