import { ActiveAttack, Player, InGameState, Hitbox, CharacterState } from "../types";

// Called each frame
export const nextPhysicsState = (state: InGameState): InGameState => {
  return nextPlayers(state)
}

const nextPlayers = (state: InGameState): InGameState => {
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
      if (attack.playerSlot != player.playerSlot) {
        // TODO: Check if hitbox is active before taking damage from it
        attack.hitboxes.forEach(hitbox => {
          // TODO: Doesn't handle hitboxes that don't move with character
          if (Math.sqrt(Math.pow((state.players[attack.playerSlot].x + hitbox.x * attack.xDirection) - player.x, 2) + Math.pow((state.players[attack.playerSlot].y + hitbox.y) - player.y, 2)) < hitbox.radius + player.character.hurtboxRadius) {
            hit = true
            damage = hitbox.damage
            let growth = 1 - (player.health / player.character.maxHealth)
            xKnockback = ((hitbox.knockbackX * hitbox.knockbackBase) * (hitbox.knockbackGrowth * (1 + growth))) * attack.xDirection
            yKnockback = (hitbox.knockbackY * hitbox.knockbackBase) * (hitbox.knockbackGrowth * (1 + growth))
            stunDuration = hitbox.hitstunBase + (hitbox.hitstunGrowth * growth)
            hitbox.hasHit = true
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
    const nextY = Math.min(600, player.y + player.ySpeed)
    const nextYSpeed = nextY >= 600 ? 0 : Math.min(18, player.ySpeed + 0.6)
    const nextJumps = player.y < 600 && nextY >= 600 ? player.character.maxJumps : player.jumps
    const nextFramesUntilNeutral = Math.max(0, player.framesUntilNeutral - 1)
    const nextState = nextPlayerState(player.state, nextY, nextFramesUntilNeutral)
    return {
      ...player,
      state: nextState,
      x: Math.max(player.character.hurtboxRadius, Math.min(1200 - player.character.hurtboxRadius, player.x + player.xSpeed)),
      y: nextY,
      ySpeed: nextYSpeed,
      xSpeed: Math.abs(player.xSpeed) < 0.3 ? 0 : player.xSpeed * 0.86,
      jumps: nextJumps,
      framesUntilNeutral: nextFramesUntilNeutral
    }
  })

  return {
    ...state,
    players: nextPlayers
  }
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
    .filter(isAttackUnused) // Remove attacks after one of their hitboxes has hit
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

const isAttackUnused = (attack: ActiveAttack): boolean => {
  // findIndex returns -1 if no used hitbox is found
  return -1 === attack.hitboxes.findIndex((hitbox: Hitbox) => hitbox.hasHit === true)
}

const nextPlayerState = (state: CharacterState, nextY: number, nextFramesUntilNeutral: number): CharacterState => {
  if (state === 'hitstun' && nextFramesUntilNeutral > 0) {
    return 'hitstun'
  } else if (nextY < 600) {
    return 'airborne'
  } else {
    return 'groundborne'
  }
}
