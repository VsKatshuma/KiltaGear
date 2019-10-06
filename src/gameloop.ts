import * as kiltagear from './kiltagear'
import { GameScreen, Player } from './types';

// As a developer, I want this file to be indented with 2 spaces. -- Esa

const FRAMES_PER_SECOND = 60
type GameState = {
  screen: GameScreen,
  players?: Player[],
  frame: number
}

export const startGameLoop = () => {
  let currentState: GameState = {
    screen: 'title-screen',
    players: kiltagear.players,
    frame: 0
  }
  const interval = window.setInterval(() => {
    currentState = nextState(currentState, kiltagear.keys)
  }, 1000 / FRAMES_PER_SECOND)
}

// Functional loop: return next state from current state and inputs
const nextState = (currentState, inputs): GameState => {
  console.log(`advance frame:\n  currentState: ${currentState}\n  inputs: ${inputs}`)

  switch (currentState.screen) {
    case 'in-game':
      // TODO

      return {
        screen: 'title-screen',
        players: currentState.players,
        frame: currentState.frame + 1
      }
      break
    case 'character-select':
      return {
        screen: 'in-game',
        players: currentState.players,
        frame: currentState.frame + 1
      }
      break
    case 'title-screen':
      return {
        screen: 'character-select',
        players: currentState.players,
        frame: currentState.frame + 1
      }
      break
    default:
      throw new Error(`unknown game state when pressing key\n  state: ${currentState}\n  key event: ${event}`)
  }
  return // TODO
}

