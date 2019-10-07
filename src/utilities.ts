import { NeutralCharacterState, AttackStrength, AttackDirection, Hitbox, Attack } from './types'

export const getAttackString = (state: NeutralCharacterState, attack: AttackStrength, direction: AttackDirection): string => {
  return `${state === 'groundborne' ? '' : 'air'}${attack}${direction}`
}

export const createHitbox = (startFrame: number, endFrame: number, strength: number = 4): Hitbox => {
  return {
      damage: strength * 1.5,
      radius: strength * 3,
      knockbackBase: 8 + 0.3 * strength,
      knockbackGrowth: 1.3, // increase knockback when opponent on low health
      knockbackX: 0.8,
      knockbackY: -0.3,
      hitstunBase: 25, // frames
      hitstunGrowth: 1.1, // increase hitstun when opponent on low health
      hitLag: 5, // frames
      //characterSpecific: 0,
      movesWithCharacter: true,
      x: 30,
      y: 0,
      framesUntilActivation: startFrame,
      framesUntilEnd: endFrame,
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
