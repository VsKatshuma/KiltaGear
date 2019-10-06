import * as kiltagear from './kiltagear'
import { GameScreen, Player, ActiveAttack, InputStatus } from './types';

// As a developer, I want this file to be indented with 2 spaces. -- Esa

const FRAMES_PER_SECOND = 60
type GameState = {
  screen: GameScreen,
  players?: Player[],
  activeAttacks: ActiveAttack[],
  frame: number
}

export const startGameLoop = () => {
  let currentState: GameState = {
    screen: 'title-screen',
    players: kiltagear.players,
    activeAttacks: [],
    frame: 0
  }
  const interval = window.setInterval(() => {
    currentState = nextState(currentState, kiltagear.keys)
  }, 1000 / FRAMES_PER_SECOND)
}

// Functional loop: return next state from current state and inputs
const nextState = (currentState, inputs: InputStatus): GameState => {
  // console.log('advance frame:\n  currentState:', currentState, '\n  inputs: ', inputs)

  switch (currentState.screen) {
    case 'in-game':
      // TODO
      if (inputs[' '] && inputs[' '].isDown) {
        return {
          ...currentState,
          screen: 'title-screen',
          frame: currentState.frame + 1
        }
      }
      break
    case 'character-select':
      if (inputs[' '] && inputs[' '].isDown) {
        return {
          ...currentState,
          screen: 'in-game',
          frame: currentState.frame + 1
        }
      }
      break
    case 'title-screen':
      if (inputs[' '] && inputs[' '].isDown) {
        return {
          ...currentState,
          screen: 'character-select',
          frame: currentState.frame + 1
        }
      }
      break
    default:
      throw new Error(`unknown game state when pressing key\n  state: ${currentState}\n  key event: ${event}`)
  }
  return currentState
}

