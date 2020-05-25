import { Player, PlayerBase, InputStatus, Character, PlayerInput } from './types'
import { startGameLoop } from './game-logic/game-loop'
import { initialize } from './render'
import { Katshuma } from './characters/katshuma'
import { mmKALLL } from './characters/mmkalll'
import { True_mmKALLL } from './characters/true-mmkalll'

// Playable characters in KiltaGear, in the order they appear on character selection screen, from left to right
export const characters: Character[] = [
    Katshuma,
    mmKALLL,
    True_mmKALLL
]

// Stages in KiltaGear (Background pictures)
// TODO: Add support for stages that are actually of different size game mechanics-wise
export const stages = {
    kiltis6: {
        name: 'Kiltahuone (6)',
        image: 'ingame-6',
        width: 2730,
        height: 1536,
    }
}

const playerBase: PlayerBase = {
    state: 'airborne',
    xSpeed: 0,
    ySpeed: 0,
    canSDI: false,
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
      [PlayerInput.Up]: ['w', 'W'],
      [PlayerInput.Left]: ['a', 'A'],
      [PlayerInput.Down]: ['s', 'S'],
      [PlayerInput.Right]: ['d', 'D'],
      [PlayerInput.Light]: ['c', 'C'],
      [PlayerInput.Special]: ['v', 'V'],
      [PlayerInput.Meter]: ['b', 'B'],
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
      [PlayerInput.Up]: ['ArrowUp'],
      [PlayerInput.Left]: ['ArrowLeft'],
      [PlayerInput.Down]: ['ArrowDown'],
      [PlayerInput.Right]: ['ArrowRight'],
      [PlayerInput.Light]: [','],
      [PlayerInput.Special]: ['.'],
      [PlayerInput.Meter]: ['/', '-'],
    }
}

export const initializePlayers = (selectedCharacters: Character[]) => {
    selectedCharacters.forEach((character, i) => {
        players[i] = {
            ...players[i],
            character: character,
            health: character.maxHealth,
            meter: character.startingMeter,
            jumps: character.maxJumps - 1,
        }
    })
}

// Swap the keys and values of player.playerInputs objects for convenience
export const initializeInputMaps = (): void => {
    inputMaps = players.map(player =>
        Object.entries(player.playerInputs)
        .reduce(
            (mapping: { [key: string]: PlayerInput }, [input, keyNames]: [PlayerInput, string[]]) => {
                keyNames.forEach(key => mapping[key] = input)
                return mapping
            },
            {}
        )
    )
}

export const players: Player[] = [playerOne, playerTwo]
export let inputMaps: { [key: string]: PlayerInput }[] = []
initializeInputMaps()

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

initialize()
startGameLoop()
