import { Player, PlayerBase, InputStatus } from './types'
import { startGameLoop } from './game-logic/game-loop'
import { Katshuma } from './characters/katshuma'
import { mmKALLL } from './characters/mmkalll';
import { True_mmKALLL } from './characters/true-mmkalll'
import { PlayerInput } from './game-logic/input-handler';


const playerBase: PlayerBase = {
    state: 'groundborne',
    meter: 0,
    xSpeed: 0,
    ySpeed: 0,
    framesUntilNeutral: 0,
    jumps: 2,
}

const playerOne: Player = {
    ...playerBase,
    playerSlot: 0,
    character: Katshuma,
    health: Katshuma.maxHealth,
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
