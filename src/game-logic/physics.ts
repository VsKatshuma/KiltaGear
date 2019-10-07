import { ActiveAttack, Player, InGameState } from "../types";

// Called each frame
export const checkCollisions = (state: InGameState): InGameState => {
  return {
    ...state,
    players: nextPlayers(state.players)
  }
}

const nextPlayers = (players: Player[]): Player[] => {

  // TODO: Check for wall/floorbounce

  // TODO: Check for collisions with hitboxes)

  // movement, physics, landing
  return players.map((player) => {
    let nextY = Math.min(600, player.y + player.ySpeed)
    let nextYSpeed = nextY >= 600 ? 0 : Math.min(18, player.ySpeed + 0.6)
    let nextJumps = player.y < 600 && nextY >= 600 ? player.character.maxJumps : player.jumps
    return {
      ...player,
      x: Math.max(player.character.hurtboxRadius, Math.min(1200 - player.character.hurtboxRadius, player.x + player.xSpeed)),
      y: nextY,
      ySpeed: nextYSpeed,
      xSpeed: Math.abs(player.xSpeed) < 0.3 ? 0 : player.xSpeed * 0.86,
      jumps: nextJumps,
    }
  })

}

export const handlePlayerMove = (player: Player, direction: -1 | 1): Player => {
  return {
    ...player,
    xSpeed: direction * (player.state === 'airborne' ? player.character.airSpeed : player.character.walkSpeed)
  }
}

export const handlePlayerJump = (player): Player => {
  if (player.jumps > 0) {
    console.log('now we really JUMP')
    return {
      ...player,
      jumps: player.jumps - 1,
      ySpeed: player.character.jumpStrength * -16 // positive y is downwards
    }
  }
  return player
}
