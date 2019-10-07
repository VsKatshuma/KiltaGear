import * as kiltagear from '../kiltagear'
import { render } from '../render'
import { ActiveAttack, InputStatus, KeyStatus, GameState, InGameState, Hitbox } from '../types';
import { handlePlayerInputs } from './input-handler';
import { checkCollisions } from './physics';

// As a developer, I want this file to be indented with 2 spaces. -- Esa

const FRAMES_PER_SECOND = 60

let currentState: GameState = {
  screen: 'title-screen',
}

export const startGameLoop = () => {
  const interval = window.setInterval(() => {
    currentState = nextState(currentState, kiltagear.keys)
    render(currentState)
  }, 1000 / FRAMES_PER_SECOND)
}

// Functional loop: return next state from current state and inputs
const nextState = (currentState: GameState, inputs: InputStatus): GameState => {
  // console.log('advance frame:\n  currentState:', currentState, '\n  inputs: ', inputs)

  const keysPressed: KeyStatus[] = kiltagear.keysPressed.map((key: string) => kiltagear.keys[key])
  const keysReleased: KeyStatus[] = kiltagear.keysReleased.map((key: string) => kiltagear.keys[key])
  kiltagear.clearKeyArrays()

  switch (currentState.screen) {
    case 'in-game':
      let state = currentState
      state = handlePlayerInputs(state, inputs, keysPressed, keysReleased)
      state = updateAttacks(state)
      state = checkCollisions(state)
      console.log(state.activeAttacks)

      return state
      break
    case 'character-select':
      // Change to in-game when any key is pressed
      if (keysPressed.length > 0) {
        return {
          screen: 'in-game',
          players: kiltagear.players,
          activeAttacks: []
        }
      }
      break
    case 'title-screen':
      // Change to character select
      if (keysPressed.length > 0) {
        return {
          screen: 'character-select',
          characterSelection: [
            { x: 1, y: 1 },
            { x: 1, y: 1}
          ]
        }
      }
      break
    default:
      throw new Error(`unknown game state when pressing key\n  state: ${currentState}\n  key event: ${event}`)
  }
  return currentState
}

const updateAttacks = (state: InGameState): InGameState => {
  const newAttacks = {
    ...state,
    activeAttacks: state.activeAttacks.map(
      (attack: ActiveAttack) => ({
        ...attack,
        hitboxes: attack.hitboxes.map((hitbox: Hitbox) => ({
          ...hitbox,
          framesUntilActivation: hitbox.framesUntilActivation - 1,
          framesUntilEnd: hitbox.framesUntilEnd - 1,
        })).filter((hitbox: Hitbox) => hitbox.framesUntilEnd > 0)
      })
    )
    .filter((attack) => attack.hitboxes.length >= 0)
  }

  newAttacks.activeAttacks.forEach(handleHitBoxFunctions)

  return newAttacks
}

const handleHitBoxFunctions = (attack: ActiveAttack): void => {
  attack.hitboxes.forEach((hitbox: Hitbox) => {
    if (hitbox.framesUntilActivation === 0 && hitbox.onActivation) {
      hitbox.onActivation()
    }
    if (hitbox.framesUntilEnd === 1 && hitbox.onEnd) {
      hitbox.onEnd()
    }
  })
}
