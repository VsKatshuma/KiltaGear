export type CharacterState = 'groundborne' | 'airborne' | 'landing'

export type Attack = {
  hitboxes: Hitbox[],
  projectile: boolean,
  onStart?: () => void,
  onEnd?: () => void
}

export type ActiveAttack = Attack & { player: number }

export type Hitbox = {
  damage: number,
  radius: number,
  knockbackBase: number,
  knockbackGrowth: number,
  knockbackX: number,
  knockbackY: number,
  hitstunBase: number,
  hitstunGrowth: number,
  hitLag: number,
  // characterSpecific: number,
  relativeToCharacter: boolean,
  x: number,
  y: number,
  framesUntilActivation: number,
  framesUntilEnd: number,
  onStart?: () => void,
  onActivation?: () => void,
  onHit?: () => void,
  onEnd?: () => void
}

export type Character = {
  health: number,
  walkSpeed: number,
  airSpeed: number,
  weight: number,
  jumpStrength: number,
  hurtboxRadius: number,

  // Attacks
  lightNeutral: Attack,
  lightSide: Attack,
  lightDown: Attack,

  airLightNeutral: Attack,
  airLightUp: Attack,
  airLightDown: Attack,
  airLightForward: Attack,
  airLightBack: Attack,

  specialNeutral: Attack,
  specialSide: Attack,
  specialDown: Attack,

  airSpecialNeutral: Attack,
  airSpecialUp: Attack,
  airSpecialDown: Attack,
  airSpecialForward: Attack,
  airSpecialBack: Attack,

  meterNeutral: Attack,
  meterSide: Attack,
  meterDown: Attack,

  airMeterNeutral: Attack,
  airMeterUp: Attack,
  airMeterDown: Attack,
  airMeterForward: Attack,
  airMeterBack: Attack,

}

export const attackName(state: CharacterState, attack: string, direction: string) => {
  return `${ state === 'airborne' ? 'air' : '' }${ attack === 'light' ? 'Light' : 'Special' }${direction}`
}

playerOne[attackName(playerOne.state, )]
