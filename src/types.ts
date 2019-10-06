import { PlayerInput } from "./game-loop/input-handler";

// Game state handling related typings

export type GameState = (TitleScreenState | CharacterSelectionState | InGameState)

export type TitleScreenState = {
  screen: 'title-screen'
}

export type CharacterSelectionState = {
  screen: 'character-select'
  characterSelection: {
    x: number,
    y: number
  }[]
}

export type InGameState = {
  screen: 'in-game'
  players: Player[],
  activeAttacks: ActiveAttack[],
}

export type InputStatus = { [key: string]: KeyStatus }

export type KeyStatus = {
  keyName: string
  isDown: boolean
  lastPressed: number
}

// Character status related typings

export type NeutralCharacterState = 'groundborne' | 'airborne'
export type SmashDICharacterState = 'wallbouncing' | 'floorbouncing' | 'hitlag'
export type NoActionCharacterState = SmashDICharacterState | 'attacking' | 'landing' | 'hitstun'

export type CharacterState = NeutralCharacterState | NoActionCharacterState

export const playerCanAct = (state: any): state is NeutralCharacterState => {
  return state === 'airborne' || state === 'groundborne'
}

export const playerCanMove = (state: any): state is NeutralCharacterState => {
  return playerCanAct(state)
}

export const playerCanSDI = (state: any): state is SmashDICharacterState => {
  return state === 'wallbouncing' || state === 'floorbouncing' || state === 'hitlag'
}

export type AttackStrength = 'Light' | 'Special' | 'Meter'
export type AttackDirection = 'Neutral' | 'Up' | 'Down' | 'Forward' | 'Back'
export type ActiveAttack = Attack & { player: number }

// Character file related typings

export type Attack = {
  hitboxes: Hitbox[],
  projectile: boolean,
  onStart?: () => void,
  onEnd?: () => void
}


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
  icon: PIXI.Sprite,
  health: number,
  walkSpeed: number,
  airSpeed: number,
  weight: number,
  jumps: number,
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

// In-game player related typings

export type PlayerBase = {
  state: CharacterState,
  xSpeed: number,
  ySpeed: number,
  framesUntilNeutral: number,
  meter: number,
  jumps: number,
}

export type Player = PlayerBase & {
  playerPort: number
  playerInputs: { [key: string]: PlayerInput }
  character: Character,
  x: number,
  y: number,
  facing: 'left' | 'right',
}
