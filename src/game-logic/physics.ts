import { ActiveAttack, Player, InGameState, Hitbox } from "../types";

// Called each frame
export const checkCollisions = (state: InGameState): InGameState => {
  return {
    ...state,
    players: nextPlayers(state)
  }
}

const removeHitbox = (hitbox: Hitbox): void => {
  // TODO: Hitbox connected, deactivate hitbox
}

const nextPlayers = (state: InGameState): Player[] => {
  let nextPlayers = state.players

  // TODO: Check for wall/floorbounce

  // TODO: Check for hitlag/landing/hitstun and tick timers

  // Check for collisions with hitboxes
  nextPlayers = nextPlayers.map((player: Player): Player => {
    let hit: boolean = false
    let damage: number = 0
    let xKnockback: number = 0
    let yKnockback: number = 0
    let stunDuration: number = 0
    state.activeAttacks.forEach(attack => {
      if (attack.player != player.playerSlot) {
        attack.hitboxes.forEach(hitbox => {
          // TODO: Doesn't handle hitboxes that don't move with character
          if (Math.sqrt(Math.pow((state.players[attack.player].x + hitbox.x) - player.x, 2) + Math.pow((state.players[attack.player].y + hitbox.y) - player.y, 2)) < hitbox.radius + player.character.hurtboxRadius) {
            hit = true
            damage = hitbox.damage
            let growth = 1 - (player.health / player.character.maxHealth)
            xKnockback = (hitbox.knockbackX * hitbox.knockbackBase) + (hitbox.knockbackGrowth * growth)
            yKnockback = (hitbox.knockbackY * hitbox.knockbackBase) + (hitbox.knockbackGrowth * growth)
            stunDuration = hitbox.hitstunBase + (hitbox.hitstunGrowth * growth)
            removeHitbox(hitbox)
          }
        })
      }
    })
    // TODO: Refactor this later to take into account getting hit by multiple hitboxes at once
    return {
      ...player,
      health: hit ? player.health - damage: player.health,
      xSpeed: hit ? xKnockback : player.xSpeed,
      ySpeed: hit ? yKnockback : player.ySpeed,
      framesUntilNeutral: hit ? stunDuration : player.framesUntilNeutral,
      state: hit ? 'hitstun' : player.state
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
