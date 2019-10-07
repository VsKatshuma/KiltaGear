import { PlayerInput } from "./game-logic/input-handler";

// Game state handling related typings

export type GameState = TitleScreenState | CharacterSelectionState | InGameState | GameOverState

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

export type GameOverState = {
  screen: 'game-over'
  winner: number | undefined
  framesUntilTitle: number
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

export const playerCanAct = (state: CharacterState): state is NeutralCharacterState => {
  return state === 'airborne' || state === 'groundborne'
}

export const playerCanMove = (state: CharacterState): state is NeutralCharacterState => {
  return playerCanAct(state)
}

export const playerCanSDI = (state: CharacterState): state is SmashDICharacterState => {
  return state === 'wallbouncing' || state === 'floorbouncing' || state === 'hitlag'
}

export type AttackStrength = 'Light' | 'Special' | 'Meter'
export type AttackDirection = 'Neutral' | 'Up' | 'Down' | 'Forward' | 'Back'
export type ActiveAttack = Attack & {
  playerSlot: number,
  xDirection: -1 | 1, // 'left', 'right'
}

// Character file related typings

export type Attack = {
  hitboxes: Hitbox[],
  projectile: boolean,
  duration: number, // in frames
  onStart?: () => void,
  onEnd?: () => void,
}


export type Hitbox = {
  hasHit?: boolean,
  x: number,
  y: number,
  movesWithCharacter: boolean, // TODO: assumed to be true, add handling for stationary/projectile hitboxes
  framesUntilActivation: number,
  framesUntilEnd: number,

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
  // onStart?: () => void,
  onActivation?: () => void,
  onHit?: () => void,
  onEnd?: () => void
}

export type Character = {
  name: string,
  id: string,
  maxHealth: number,
  walkSpeed: number,
  airSpeed: number,
  weight: number,
  maxJumps: number,
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
  playerSlot: number
  playerInputs: { [key: string]: PlayerInput }
  character: Character,
  x: number,
  y: number,
  facing: 'left' | 'right',
  health: number,
}
