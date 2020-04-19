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
  currentFrame: number,
}

// Character file related typings

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

type CoordinateSettings = StaticCoordinates | WorldCoordinates | RelativeToPlayer

type StaticCoordinates = {
  // Only one or neither of these should be true, both at same time is undefined behavior
  createUsingWorldCoordinates: false, // Ignore player position when creating the hitbox
  movesWithPlayer: false,             // Attack location is recalculated as the player moves
}
type WorldCoordinates = {
  createUsingWorldCoordinates: true,
  movesWithPlayer: false,
}
type RelativeToPlayer = {
  createUsingWorldCoordinates: false,
  movesWithPlayer: true,
}

export type Attack = CoordinateSettings & {
  x: number, // Check if it's relative to player or in world coordinates using utilities.isAttackRelativeToPlayer
  y: number,
  xSpeed: number,
  ySpeed: number,
  duration: number, // How long to prevent player from moving, in frames
  meterCost: number,
  hitboxes: Hitbox[],
  endWhenHitboxConnects: boolean,
  endWhenHitboxesEnded: boolean,
  endAfterDurationEnded: boolean,
  customImage?: PIXI.Sprite,
  onStart?: (state: InGameState, attack: ActiveAttack) => InGameState,
  onEnd?: (state: InGameState, attack: ActiveAttack) => InGameState,
}

// Attack related typings

export type Hitbox = {
  hasHit?: boolean,
  x: number, // Relative to the parent attack
  y: number, // Relative to the parent attack
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
  ignoreOwnerHitlag: boolean,
  // characterSpecific: any,
  customParticles?: PIXI.Sprite[], // Additional particles shown during the lifetime of the hitbox
  customHitEffect?: PIXI.Sprite[], // Additional particles on hit, overrides the default particles
  onActivation?: (state: InGameState, attack: ActiveAttack) => InGameState,
  onHit?: (state: InGameState, attack: ActiveAttack) => InGameState,
  onEnd?: (state: InGameState, attack: ActiveAttack) => InGameState
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
