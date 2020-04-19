import { PlayerInput } from "./game-logic/input-handler";

// Game state handling related typings

export type GameState = (TitleScreenState | CharacterSelectionState | InGameState | GameOverState)

export type TitleScreenState = {
  screen: 'title-screen'
  musicPlaying: boolean
}

export type CharacterSelectionState = {
  screen: 'character-select'
  musicPlaying: boolean
  characterSelection: {
    x: number,
    y: number
  }[]
}

export type InGameState = {
  screen: 'in-game'
  musicPlaying: boolean
  players: Player[],
  activeAttacks: ActiveAttack[],
}

export type GameOverState = {
  screen: 'game-over'
  musicPlaying: boolean
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
export type NoActionCharacterState = 'attacking' | 'landing' | 'hitstun'

export type CharacterState = NeutralCharacterState | NoActionCharacterState

export type AttackStrength = 'Light' | 'Special' | 'Meter'
export type AttackDirection = 'Neutral' | 'Up' | 'Down' | 'Forward' | 'Back'
export type ActiveAttack = Attack & {
  playerSlot: number,
  xDirection: -1 | 1, // 'left', 'right'
  xMultiplierOnHit: -1 | 1, // used to reverse knockback when airBack move hits
  currentFrame: number,
}

// Character file related typings

export type Attack = {
  hitboxes: Hitbox[],
  projectile: boolean, // TODO: Implement projectiles
  duration: number, // How long to prevent player from moving, in frames
  endWhenHitboxConnects: boolean,
  endWhenHitboxesEnded: boolean,
  endAfterDurationEnded: boolean,
  onStart?: (state: InGameState, attack: ActiveAttack) => InGameState,
  onEnd?: (state: InGameState, attack: ActiveAttack) => InGameState,
}

export type Hitbox = {
  hasHit?: boolean,
  x: number,
  y: number,
  movesWithCharacter: boolean, // TODO: assumed to be true, add handling for stationary/projectile hitboxes
  framesUntilActivation: number,
  duration: number,
  damage: number,
  radius: number,
  knockbackBase: number,
  knockbackGrowth: number,
  knockbackX: number,
  knockbackY: number,
  hitstunBase: number,
  hitstunGrowth: number,
  hitLag: number,
  // characterSpecific: any,
  onActivation?: (state: InGameState, attack: ActiveAttack) => InGameState,
  onHit?: (state: InGameState, attack: ActiveAttack) => InGameState,
  onEnd?: (state: InGameState, attack: ActiveAttack) => InGameState
}

export type Character = {
  name: string,
  id: string,
  maxHealth: number,
  maxMeter: number,
  startingMeter: number,
  meterThresholds: number[], // Used to render "segments" on the meter
  walkSpeed: number,
  airSpeed: number,
  weight: number,
  maxJumps: number,
  jumpStrength: number,
  hurtboxRadius: number,
  onMove?: (player: Player, previousState: InGameState) => Player,
  onJump?: (player: Player, previousState: InGameState) => Player,
  onAttackHit?: (player: Player, previousState: InGameState) => Player, // Called when own attack hits an opponent
  onGetHit?: (player: Player, previousState: InGameState) => Player, // Called when hit by an opponent's attack
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
  hitlagRemaining: number,
  framesUntilNeutral: number,
}

export type Player = PlayerBase & {
  playerSlot: number
  playerInputs: { [key: string]: PlayerInput }
  character: Character,
  x: number,
  y: number,
  facing: 'left' | 'right',
  health: number,
  meter: number,
  jumps: number,
}
