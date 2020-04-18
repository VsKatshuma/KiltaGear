import { NeutralCharacterState, AttackStrength, AttackDirection, Hitbox, Attack } from './types'

const damageslashUrl = require('./assets/audio/damageslash.wav')
const sounds = [new Audio(damageslashUrl)]
sounds.forEach(snd => snd.volume = 0.2)

const midnightCarnivalUrl = require('./assets/audio/gametal-midnight-carnival.mp3')
const track = new Audio(midnightCarnivalUrl)

export const playMusic = (): void => {
  track.volume = 0.3
  track.loop = true
  track.play()
}

export const getMusicVolume = (): number => {
  return track.volume
}

export const setMusicVolume = (volume: number): void => {
  track.volume = volume
}

export const playHitSound = (): void => {
  sounds[0].play()
}

export const getAttackString = (state: NeutralCharacterState, attack: AttackStrength, direction: AttackDirection): string => {
  return `${state === 'groundborne' ? '' : 'air'}${attack}${direction}`
}

export const isHitboxActive = (hitbox: Hitbox): boolean => {
  return hitbox.framesUntilActivation <= 0 &&
    hitbox.framesUntilActivation + hitbox.duration > 0 // framesUntilActivation is decreased even after active
}

export const hasHitboxEnded = (hitbox: Hitbox): boolean => {
  return hitbox.hasHit || hitbox.framesUntilActivation + hitbox.duration <= 0 // framesUntilActivation is decreased even after active
}

export const createHitbox = (startFrame: number, duration: number, strength: number = 4): Hitbox => {
  return {
    damage: strength * 0.75,
    radius: 10 + strength * 4,
    knockbackBase: 13 + 0.7 * strength,
    knockbackGrowth: 1.2, // increase knockback when opponent on low health
    knockbackX: 1,
    knockbackY: 0.5,
    hitstunBase: 25, // frames
    hitstunGrowth: 1.1, // increase hitstun when opponent on low health
    hitLag: 5, // frames
    //characterSpecific: 0,
    movesWithCharacter: true,
    x: 30,
    y: 0,
    framesUntilActivation: startFrame,
    duration: duration,
    // onStart: () => {},
    onActivation: () => {},
    onHit: () => {},
    onEnd: () => {}
  }
}

export const createRandomHitbox = (variance: number = 15, baseStrength: number = Math.random() * 15, damage: number = Math.random() * variance): Hitbox => {
  const r = (value) => Math.random() * value
  return {
    damage: damage,
    radius: 5 + 2 * baseStrength + 5 * r(variance),
    knockbackBase: 4 + baseStrength + 2 * r(variance),
    knockbackGrowth: 1 + 0.1 * r(variance), // increase knockback when opponent on low health
    knockbackX: 0.77,
    knockbackY: -0.77,
    hitstunBase: 25, // frames
    hitstunGrowth: 1.1, // increase hitstun when opponent on low health
    hitLag: baseStrength + 0.3 * r(variance), // frames
    //characterSpecific: 0,
    movesWithCharacter: true,
    x: 40 + 8 * r(variance) - 8 * r(variance),
    y: 0 + 8 * r(variance) - 8 * r(variance),
    framesUntilActivation: variance * 1.4,
    duration: variance * 2.5,
    // onStart: () => {},
    onActivation: () => {},
    onHit: () => {},
    onEnd: () => {}
  }
}

export const generateAttack = (hitboxes: Hitbox[], duration: number = 20): Attack => {
  return {
      hitboxes: hitboxes,
      projectile: false,
      duration: duration,
      onStart: () => {},
      onEnd: () => {}
  }
}
