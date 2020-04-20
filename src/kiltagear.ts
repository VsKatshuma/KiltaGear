import { Player, PlayerBase, InputStatus, Character } from './types'
import { startGameLoop } from './game-logic/game-loop'
import { Katshuma } from './characters/katshuma'
import { mmKALLL } from './characters/mmkalll'
import { True_mmKALLL } from './characters/true-mmkalll'
import { PlayerInput } from './game-logic/input-handler'

export const stages = {
    kiltis6: {
        name: 'Kiltahuone (6)',
        image: 'ingame-6',
        width: 2730,
        height: 1536,
    }
}

// Playable characters in KiltaGear, in the order they appear on character selection screen, left to right
export const characters: Character[] = [
    Katshuma,
    mmKALLL,
    True_mmKALLL
]

const playerBase: PlayerBase = {
    state: 'groundborne',
    xSpeed: 0,
    ySpeed: 0,
    hitlagRemaining: 0,
    framesUntilNeutral: 0,
}

const playerOne: Player = {
    ...playerBase,
    playerSlot: 0,
    character: Katshuma,
    health: Katshuma.maxHealth,
    meter: Katshuma.startingMeter,
    jumps: Katshuma.maxJumps - 1,
    x: 500,
    y: 450,
    facing: 'right',
    playerInputs: {
      'w': PlayerInput.Up,
      'a': PlayerInput.Left,
      's': PlayerInput.Down,
      'd': PlayerInput.Right,
      'c': PlayerInput.Light,
      'v': PlayerInput.Special,
      'b': PlayerInput.Meter,
    }
}

const playerTwo: Player = {
    ...playerBase,
    playerSlot: 1,
    character: mmKALLL,
    health: mmKALLL.maxHealth,
    meter: mmKALLL.startingMeter,
    jumps: mmKALLL.maxJumps - 1,
    x: 700,
    y: 450,
    facing: 'left',
    playerInputs: {
      'ArrowUp': PlayerInput.Up,
      'ArrowLeft': PlayerInput.Left,
      'ArrowDown': PlayerInput.Down,
      'ArrowRight': PlayerInput.Right,
      ',': PlayerInput.Light,
      '.': PlayerInput.Special,
      '/': PlayerInput.Meter,
      '-': PlayerInput.Meter,
    }
}

export const players: Player[] = [playerOne, playerTwo]

export const keys: InputStatus = {}
export let keysPressed: string[] = []
export let keysReleased: string[] = []
export const clearKeyArrays: () => void = () => { keysPressed = []; keysReleased = [] }

window.addEventListener('keydown', (event: KeyboardEvent) => {
    keysPressed.push(event.key)
    keys[event.key] = {
        keyName: event.key,
        isDown: true,
        lastPressed: Date.now(),
    }
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
    if (keys[event.key]) {
        keys[event.key].isDown = false
        keysReleased.push(event.key)
    }
})

startGameLoop()
