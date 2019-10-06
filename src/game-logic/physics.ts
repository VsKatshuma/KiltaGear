import { ActiveAttack, Player, InGameState } from "../types";

export const checkCollisions = (state: InGameState): InGameState => {
  let players: Player[] = state.players
  const activeAttacks: ActiveAttack[] = state.activeAttacks

  // activeAttacks

  // TODO: Check for wall/floorbounce

  // movement, physics, landing
  players = players.map((player) => {
    return {
      ...player,
      x: Math.max(player.character.hurtboxRadius, Math.min(1200 - player.character.hurtboxRadius, player.x + player.xSpeed)),
      y: Math.min(600, player.y + player.ySpeed),
      ySpeed: player.y >= 600 ? 0 : Math.min(18, player.ySpeed + 0.6),
      xSpeed: Math.abs(player.xSpeed) < 0.3 ? 0 : player.xSpeed * 0.86,
      jumps: player.y >= 600 ? player.character.maxJumps : player.jumps,
    }
  })

  return { ...state, players: players }
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
