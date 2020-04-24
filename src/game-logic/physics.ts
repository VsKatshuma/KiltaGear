import { ActiveAttack, Player, InGameState, Hitbox, CharacterState, NeutralCharacterState } from "../types";
import { playHitSound, isHitboxActive, hasHitboxEnded, hasAttackEnded, playerCanAct, playerHasHitlag } from "../utilities";

// Called each frame
export const nextPhysicsState = (state: InGameState): InGameState => {
  return nextPlayers(state)
}

const nextPlayers = (state: InGameState): InGameState => {
  let nextPlayers = state.players

  // Check for collisions with hitboxes
  nextPlayers = nextPlayers.map((player: Player): Player => {
    let hit: boolean = false
    let damage: number = 0
    let xKnockback: number = 0
    let yKnockback: number = 0
    let hitlagRemaining: number = player.hitlagRemaining
    let stunDuration: number = 0

    state.activeAttacks.forEach((attack: ActiveAttack) => {
      if (attack.playerSlot !== player.playerSlot) {
        attack.hitboxes.forEach((hitbox: Hitbox) => {
          if (isHitboxActive(hitbox)) {
            // TODO: Handle hitboxes that don't move with character
            // Calculate hit if hitbox overlaps with hurtbox
            if (Math.sqrt(
                    Math.pow((state.players[attack.playerSlot].x + hitbox.x * attack.xDirection) - player.x, 2)
                  + Math.pow((state.players[attack.playerSlot].y + hitbox.y) - player.y, 2)
                )
                < hitbox.radius + player.character.hurtboxRadius) {
              hit = true
              damage = hitbox.damage
              const growth = 1 - (player.health / player.character.maxHealth)
              xKnockback = ((hitbox.knockbackX * hitbox.knockbackBase) * (hitbox.knockbackGrowth * (1 + growth))) * attack.xDirection
              yKnockback = (hitbox.knockbackY * hitbox.knockbackBase) * (hitbox.knockbackGrowth * (1 + growth))
              stunDuration = hitbox.hitstunBase + (hitbox.hitstunGrowth * growth)

              hitbox.hasHit = true
              playHitSound()
              hitbox.onHit && hitbox.onHit(state, attack)

              // Assign hitlag to both players
              hitlagRemaining = Math.max(hitbox.hitLag, hitlagRemaining)
              nextPlayers[attack.playerSlot].hitlagRemaining = Math.max(hitbox.hitLag, nextPlayers[attack.playerSlot].hitlagRemaining)
            }
          }
        })
      }
    })

    return {
      ...player,
      health: hit ? player.health - damage : player.health,
      xSpeed: hit ? xKnockback : player.xSpeed,
      ySpeed: hit ? yKnockback : player.ySpeed,
      hitlagRemaining: hitlagRemaining,
      framesUntilNeutral: hit ? stunDuration : player.framesUntilNeutral,
      state: hit ? 'hitstun' : player.state
    }
  })

  // movement, physics, landing, state updates
  nextPlayers = nextPlayers.map((player: Player): Player => {
    let nextPlayer = { ...player }

    // position and speeds
    if (!playerHasHitlag(nextPlayer)) {
      const minX = player.character.hurtboxRadius
      const maxX = 1200 - player.character.hurtboxRadius

      nextPlayer.x = Math.max(minX, Math.min(maxX, player.x + player.xSpeed))
      nextPlayer.xSpeed =
          (player.state === 'hitstun') ?
              player.xSpeed * 0.975 *
                  ((nextPlayer.x <= minX || nextPlayer.x >= maxX) ? -1 : 1) // reverse speed on wall hit
              : Math.abs(player.xSpeed) < 0.3 ? 0 : player.xSpeed * 0.86 // more friction when not in hitstun

      nextPlayer.y = Math.min(600, player.y - player.ySpeed) // Reversed Y axis; helps a lot elsewhere
      nextPlayer.ySpeed = nextPlayer.y >= 600 ? 0 : Math.max(-18, player.ySpeed - (0.6 * player.character.weight)) // Gravity if in air
      nextPlayer.jumps = player.y < 600 && nextPlayer.y >= 600 ? player.character.maxJumps : player.jumps // Refresh jumps if landed

      // Landing lag could be: if (player.y < 600 && nextPlayer.y >= 600) nextPlayer.hitlagRemaining += 2
      // TODO: Add hitlag on floor/groundbounce
    }

    nextPlayer = handlePlayerState(nextPlayer)
    return nextPlayer
  })

  return {
    ...state,
    players: nextPlayers
  }
}

export const handlePlayerMove = (player: Player, direction: -1 | 1): Player => {
  return {
    ...player,
    facing: player.state === 'groundborne' ? (direction === -1 ? 'left' : 'right') : player.facing,
    xSpeed: direction * (player.state === 'airborne' ? player.character.airSpeed : player.character.walkSpeed)
  }
}

export const handlePlayerJump = (player: Player): Player => {
  if (player.jumps > 0) {
    return {
      ...player,
      jumps: player.jumps - 1,
      ySpeed: player.character.jumpStrength * 16
    }
  }
  return player
}

export const handlePlayerFastFall = (player: Player): Player => {
  if (player.state === 'airborne') {
    player.ySpeed += player.character.weight * -8.8 // Increase gravity immediately regardless of jumps left
  }
  return player
}


// Attack handling

export const updateAttacks = (state: InGameState): InGameState => {
  let newState = {
    ...state,
    activeAttacks: state.activeAttacks
      .filter(attack => !hasAttackEnded(attack)) // Only pass attacks that have not ended to the next frame
      .map(
        (attack: ActiveAttack): ActiveAttack => ({
          ...attack,
          currentFrame: attack.currentFrame + 1,
          hitboxes: attack.hitboxes.map((hitbox: Hitbox): Hitbox => ({
            ...hitbox,
            framesUntilActivation: hitbox.framesUntilActivation - 1,
          })).filter((hitbox: Hitbox) => !hasHitboxEnded(hitbox))
        })
      )
  }

  // Handle onStart for all new attacks
  newState.activeAttacks
      .filter(attack => attack.currentFrame === 1)
      .forEach(attack => {
        if (attack.onStart) {
          newState = attack.onStart(newState, attack)
        }
      })

  // Handle onEnd for all removed attacks
  state.activeAttacks
      .filter(attack => hasAttackEnded(attack))
      .forEach(attack => {
        if (attack.onEnd) {
          newState = attack.onEnd(newState, attack)
        }
      })

  newState.activeAttacks.forEach(attack => { newState = handleHitBoxFunctions(newState, attack) })

  return newState
}

const handleHitBoxFunctions = (state: InGameState, attack: ActiveAttack): InGameState => {
  let newState = state
  attack.hitboxes.forEach((hitbox: Hitbox) => {
    if (hitbox.framesUntilActivation === 0 && hitbox.onActivation) {
      newState = hitbox.onActivation(newState, attack)
    }
    if (hasHitboxEnded(hitbox) && hitbox.onEnd) {
      newState = hitbox.onEnd(newState, attack)
    }
  })
  return newState
}

// Hitlag/hitstun and state update. Don't decrease framesUntilNeutral if the player is in hitlag.
const handlePlayerState = (player: Player): Player => {
  const nextPlayer = { ...player }
  nextPlayer.framesUntilNeutral = playerHasHitlag(player) ?
      player.framesUntilNeutral
      : Math.max(0, player.framesUntilNeutral - 1)
  nextPlayer.hitlagRemaining = Math.max(0, nextPlayer.hitlagRemaining - 1)
  nextPlayer.state = playerState(nextPlayer)
  return nextPlayer
}

const playerState = (player: Player): CharacterState => {
  // need to spend time in lag state if nextFramesUntilNeutral > 0
  if (player.framesUntilNeutral > 0 && !playerCanAct(player)) {
    return player.state
  }

  // Return to neutral after nextFramesUntilNeutral === 0
  return nextNeutralState(player.y)
}

export const nextNeutralState = (nextY: number): NeutralCharacterState => {
  if (nextY < 600) {
    return 'airborne'
  } else {
    return 'groundborne'
  }
}
