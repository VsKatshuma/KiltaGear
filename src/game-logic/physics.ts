import { ActiveAttack, Player, InGameState, Hitbox } from "../types";

// Called each frame
export const checkCollisions = (state: InGameState): InGameState => {
  return {
    ...state,
    players: nextPlayers(state.players)
  }
}

const nextPlayers = (players: Player[]): Player[] => {
  let nextPlayers = players

  // TODO: Check for wall/floorbounce

  // TODO: Check for hitlag/landing/hitstun and tick timers

  // Check for collisions with hitboxes
  nextPlayers = nextPlayers.map((player: Player): Player => {
    return {
      ...player,
      // TODO
    }
  })

  // movement, physics, landing
  nextPlayers = nextPlayers.map((player) => {
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

  return nextPlayers
}

export const handlePlayerMove = (player: Player, direction: -1 | 1): Player => {
  return {
    ...player,
    facing: direction === -1 ? 'left' : 'right',
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


// Attack handling

export const updateAttacks = (state: InGameState): InGameState => {
  const newAttacks = {
    ...state,
    activeAttacks: state.activeAttacks.map(
      (attack: ActiveAttack) => ({
        ...attack,
        hitboxes: attack.hitboxes.map((hitbox: Hitbox) => ({
          ...hitbox,
          framesUntilActivation: hitbox.framesUntilActivation - 1,
          framesUntilEnd: hitbox.framesUntilEnd - 1,
        })).filter((hitbox: Hitbox) => hitbox.framesUntilEnd > 0)
      })
    )
    .filter((attack) => attack.hitboxes.length > 0)
  }

  newAttacks.activeAttacks.forEach(handleHitBoxFunctions)

  return newAttacks
}

const handleHitBoxFunctions = (attack: ActiveAttack): void => {
  attack.hitboxes.forEach((hitbox: Hitbox) => {
    if (hitbox.framesUntilActivation === 0 && hitbox.onActivation) {
      hitbox.onActivation()
    }
    if (hitbox.framesUntilEnd === 1 && hitbox.onEnd) {
      hitbox.onEnd()
    }
  })
}
