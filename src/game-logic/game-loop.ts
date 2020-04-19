import * as kiltagear from '../kiltagear'
import { render } from '../render'
import { InputStatus, KeyStatus, GameState, InGameState, Hitbox, Player, GameOverState } from '../types';
import { handleCharacterSelection, handlePlayerInputs } from './input-handler';
import { updateAttacks, nextPhysicsState } from './physics';
import { playMusic, toggleMusicMuted, assertNever } from '../utilities';

// As a developer, I want this file to be indented with 2 spaces. -- Esa

const FRAMES_PER_SECOND = 60

let currentState: GameState = {
  screen: 'title-screen',
  musicPlaying: false
}

export const startGameLoop = () => {
  const interval = window.setInterval(() => {
    currentState = nextState(currentState, kiltagear.keys)
    render(currentState)
  }, 1000 / FRAMES_PER_SECOND)
}

// Functional loop: return next state from current state and inputs
const nextState = (currentState: GameState, inputs: InputStatus): GameState => {
  let state = { ...currentState }

  const keysPressed: KeyStatus[] = kiltagear.keysPressed.map((key: string) => kiltagear.keys[key])
  const keysReleased: KeyStatus[] = kiltagear.keysReleased.map((key: string) => kiltagear.keys[key])
  kiltagear.clearKeyArrays()

  // Global mute/unmute music
  if (keysPressed.find(input => input.keyName === 'm')) {
    toggleMusicMuted()
  }

  switch (state.screen) {
    case 'in-game':
      state = handlePlayerInputs(state, inputs, keysPressed, keysReleased)
      state = updateAttacks(state)
      state = nextPhysicsState(state)

      if (isGameOver(state)) {
        return gameOverState(state.players)
      }

      return state
    case 'character-select':
      state = handleCharacterSelection(state, keysPressed)

      if (state.start) {
        kiltagear.players[0].character = kiltagear.characters[state.characterSelection[0]]
        kiltagear.players[0].health = kiltagear.players[0].character.maxHealth
        kiltagear.players[1].character = kiltagear.characters[state.characterSelection[1]]
        kiltagear.players[1].health = kiltagear.players[1].character.maxHealth

        return {
          screen: 'in-game',
          stage: kiltagear.stages.kiltis6,
          players: kiltagear.players,
          activeAttacks: [],
          musicPlaying: true
        }
      }

      return state
    case 'title-screen':
      // Change to character select when any key is pressed
      if (keysPressed.length > 0) {
        if (state.musicPlaying === false) {
          state.musicPlaying = true
          playMusic()
        }
        return {
          screen: 'character-select',
          musicPlaying: true,
          characterSelection: [0, 1], // Initial cursor positions of player 1 and 2, needs to be expanded to support more players
          playerReady: [false, false],
          start: false
        }
      }

      break
    case 'game-over':
      if (state.framesUntilTitle <= 0) {
        return {
          screen: 'title-screen',
          musicPlaying: true
        }
      }

      return {
        ...state,
        framesUntilTitle: state.framesUntilTitle - 1
      }
    default:
      assertNever(state)
  }

  return state
}

const isGameOver = (state: InGameState): boolean => {
  return state.players.find((player: Player) => player.health <= 0) !== undefined
}

// TODO: Add screen 'game-over'
const gameOverState = (players: Player[]): GameOverState => {
  const winner: Player | undefined = players.find(player => player.health > 0)
  if (winner) {
    const winnerSlot: number = winner.playerSlot
    return {
      screen: 'game-over',
      musicPlaying: true,
      winner: winnerSlot,
      framesUntilTitle: 180
    }
  }
  return {
    screen: 'game-over',
    musicPlaying: true,
    winner: undefined,
    framesUntilTitle: 140
  }
}
