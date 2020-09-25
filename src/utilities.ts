import { AttackStrength, AttackDirection, Hitbox, Attack, ActiveAttack, Player, PlayerInput, DirectionalInput } from './types'

// General use

// Restrict a number between a min/max
export const clamp = (number: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, number))
}

export const sum = (array: number[]): number => {
  return array.reduce((a, b) => a + b)
}

// Explicitly check that all inferred types are used - see e.g. game-loop.ts
export function assertNever(x: never): never {
  throw new Error(`Unexpected object in assertNever:\n  ${x}`);
}

// Music and other assets

const damageslashUrl = require('./assets/audio/damageslash.wav')
const sounds = [new Audio(damageslashUrl)]
sounds.forEach(snd => snd.volume = 0.22)

const midnightCarnivalUrl = require('./assets/audio/gametal-midnight-carnival.mp3')
const track = new Audio(midnightCarnivalUrl)
track.volume = 0.3
track.loop = true

export const playMusic = (): void => {
  track.play()
}

export const getMusicVolume = (): number => {
  return track.volume
}

export const setMusicVolume = (volume: number): void => {
  track.volume = volume
}

export const toggleMusicMuted = (): void => {
    const newVolume = getMusicVolume() !== 0 ? 0 : 0.3
    setMusicVolume(newVolume)
}

export const playHitSound = (): void => {
  sounds[0].play()
}

// State handling and checks

export const playerCanAct = (player: Player): boolean => {
  return !playerHasHitlag(player) && player.framesUntilNeutral <= 0 && (player.state === 'airborne' || player.state === 'groundborne')
}

export const playerCanMove = (player: Player): boolean => {
  return !playerHasHitlag(player) && (player.state === 'airborne' || player.state === 'groundborne' || player.state === 'attacking')
}

export const playerCanSDI = (player: Player): boolean => {
  return player.canSDI && player.hitlagRemaining > 0
}

export const playerHasHitlag = (player: Player): boolean => {
  return player.hitlagRemaining > 0
}

export const gainMeter = (amount: number, player: Player): Player => {
  return { ...player, meter: clamp(player.meter + amount, 0, player.character.maxMeter) }
}

export const isHitboxActive = (hitbox: Hitbox): boolean => {
  return !hitbox.hasHit && hitbox.framesUntilActivation <= 0 &&
    hitbox.framesUntilActivation + hitbox.duration > 0 // framesUntilActivation is decreased even after active
}

export const hasHitboxEnded = (hitbox: Hitbox): boolean => {
  return hitbox.framesUntilActivation + hitbox.duration <= 0 // framesUntilActivation is decreased even after active
}

export const hasAttackHit = (attack: ActiveAttack): boolean => {
  // findIndex returns -1 if no used hitbox is found
  return -1 !== attack.hitboxes.findIndex((hitbox: Hitbox) => hitbox.hasHit === true)
}

export const hasAttackEnded = (attack: ActiveAttack): boolean => {
  return attack.endWhenHitboxConnects && hasAttackHit(attack)
      || attack.endWhenHitboxesEnded && attack.hitboxes.length === 0
      || attack.endAfterDurationEnded && attack.currentFrame >= attack.duration
}

// Helpers for using attack data easily

export const getAttackString = (player: Player, attack: AttackStrength, direction: AttackDirection): string => {
  return playerCanAct(player) ? `${player.state === 'airborne' ? 'air' : ''}${attack}${direction}` : ''
}

export const isAttackRelativeToPlayer = (attack: Attack): boolean => {
  return attack.movesWithPlayer && !attack.createUsingWorldCoordinates
}

export const isDirectionalInput = (input: PlayerInput): input is DirectionalInput => {
  return input === PlayerInput.Left || input === PlayerInput.Right || input === PlayerInput.Up || input === PlayerInput.Down
}

// Attack generation in character files

export const createHitbox = (startFrame: number, duration: number, strength: number = 6): Hitbox => {
  return {
    damage: strength * 0.75,
    radius: 10 + strength * 4,
    knockbackBase: 13 + 0.7 * strength,
    knockbackGrowth: 1.25, // increase knockback when opponent on low health
    knockbackX: 1,
    knockbackY: 0.6,
    hitstunBase: 25, // frames
    hitstunGrowth: 1.1, // increase hitstun when opponent on low health
    hitLag: 6, // frames
    ignoreOwnerHitlag: false,
    //characterSpecific: 0,
    x: 30,
    y: 0,
    framesUntilActivation: startFrame,
    duration: duration,
    onActivation: (state) => { return state },
    onHit: (state) => { return state },
    onEnd: (state) => { return state }
  }
}

export const createRandomHitbox = (variance: number = 15, baseStrength: number = Math.random() * 15, damage: number = Math.random() * variance): Hitbox => {
  const r = (value) => Math.random() * value
  return {
    damage: damage,
    radius: 5 + 2 * baseStrength + 5 * r(variance),
    knockbackBase: 4 + baseStrength + 2 * r(variance),
    knockbackGrowth: 1 + 0.1 * r(variance), // increase knockback when opponent on low health
    knockbackX: 0.5 + 0.1 * variance,
    knockbackY: 0.1 + 0.08 * variance,
    hitstunBase: 25, // frames
    hitstunGrowth: 1.1, // increase hitstun when opponent on low health
    hitLag: baseStrength + 0.3 * r(variance), // frames
    ignoreOwnerHitlag: false,
    //characterSpecific: 0,
    x: 40 + 8 * r(variance) - 8 * r(variance),
    y: 0 + 8 * r(variance) - 8 * r(variance),
    framesUntilActivation: variance * 1.4,
    duration: baseStrength + variance * 2.5,
    onActivation: (state) => { return state },
    onHit: (state) => { return state },
    onEnd: (state) => { return state }
  }
}

export const generateAttack = (hitboxes: Hitbox[]): Attack => {
  return {
      x: 0,
      y: 0,
      xSpeed: 0,
      ySpeed: 0,

      // Only one or neither of these should be true, setting both to true is undefined behavior.
      createUsingWorldCoordinates: false, // Ignore player position when creating the hitbox
      movesWithPlayer: true, // Attack location is recalculated as the player moves

      hitboxes: hitboxes,
      duration: 35,
      meterCost: 0,
      endWhenHitboxConnects: false,
      endWhenHitboxesEnded: true,
      endAfterDurationEnded: false,
      onStart: (state, attack) => { return state },
      onEnd: (state, attack) => { return state }
  }
}

export const generateProjectile = (hitboxes: Hitbox[]): Attack => {
  return {
    ...generateAttack(hitboxes),
    movesWithPlayer: false,
    endWhenHitboxConnects: true,
    xSpeed: 2.5,
    hitboxes: hitboxes.map(hitbox => ({ ...hitbox, ignoreOwnerHitlag: true })),
  }
}
