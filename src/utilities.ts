import { NeutralCharacterState, AttackStrength, AttackDirection, Hitbox, Attack } from './types'

export const getAttackString = (state: NeutralCharacterState, attack: AttackStrength, direction: AttackDirection): string => {
  return `${state === 'groundborne' ? '' : 'air'}${attack}${direction}`
}

export const createHitbox = (startFrame: number, endFrame: number, strength: number = 4): Hitbox => {
  return {
      damage: strength,
      radius: strength * 3,
      knockbackBase: strength * 20,
      knockbackGrowth: 0,
      knockbackX: 0,
      knockbackY: 0,
      hitstunBase: 0,
      hitstunGrowth: 0,
      hitLag: 0,
      //characterSpecific: 0,
      relativeToCharacter: false,
      x: 0,
      y: 0,
      framesUntilActivation: startFrame,
      framesUntilEnd: endFrame,
      onStart: () => {},
      onActivation: () => {},
      onHit: () => {},
      onEnd: () => {}
  }
}

export const generateAttack = (hitboxes: Hitbox[]): Attack => {
  return {
      hitboxes: hitboxes,
      projectile: false,
      onStart: () => {},
      onEnd: () => {}
  }
}
