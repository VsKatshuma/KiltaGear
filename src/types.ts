export type GameScreen = 'title-screen' | 'character-select' | 'in-game' // Don't rename to GameState, it will confuse gameloop.ts

export type NeutralCharacterState = 'groundborne' | 'airborne'
export type BouncingCharacterState = 'wallbounce' | 'floorbounce'
export type NoActionCharacterState = BouncingCharacterState | 'landing' | 'hitlag' | 'hitstun'

export type CharacterState = NeutralCharacterState | NoActionCharacterState

export type AttackStrength = 'Light' | 'Special' | 'Meter'
export type AttackDirection = 'Neutral' | 'Up' | 'Down' | 'Forward' | 'Back'

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
  attacks: Partial<{
    LightNeutral: Attack,
    LightForward: Attack,
    LightDown: Attack,

    airLightNeutral: Attack,
    airLightUp: Attack,
    airLightDown: Attack,
    airLightForward: Attack,
    airLightBack: Attack,

    SpecialNeutral: Attack,
    SpecialForward: Attack,
    SpecialDown: Attack,

    airSpecialNeutral: Attack,
    airSpecialUp: Attack,
    airSpecialDown: Attack,
    airSpecialForward: Attack,
    airSpecialBack: Attack,

    MeterNeutral: Attack,
    MeterForward: Attack,
    MeterDown: Attack,

    airMeterNeutral: Attack,
    airMeterUp: Attack,
    airMeterDown: Attack,
    airMeterForward: Attack,
    airMeterBack: Attack,
  }>
}

export type PlayerBase = {
  state: CharacterState,
  xSpeed: number,
  ySpeed: number,
  framesUntilNeutral: number,
  meter: number,
}

export type Player = PlayerBase & {
  playerPort: number
  character: Character,
  x: number,
  y: number,
  facing: 'left' | 'right',
}
