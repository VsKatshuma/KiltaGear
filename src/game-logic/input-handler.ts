import { Player, KeyStatus, InputStatus, InGameState, playerCanMove, playerCanSDI, playerCanAct, ActiveAttack, AttackStrength, AttackDirection, CharacterState, Attack } from "../types";
import { getAttackString, setMusicVolume, getMusicVolume } from "../utilities";
import { handlePlayerMove, handlePlayerJump, handlePlayerFastFall } from "./physics";

export enum PlayerInput {
  Left,
  Right,
  Up,
  Down,
  Neutral,
  Light,
  Special,
  Meter
}

export type PlayerAction = { playerPort: number, action: PlayerInput }

export const handlePlayerInputs = (currentState: InGameState, inputs: InputStatus, keysPressed: KeyStatus[], keysReleased: KeyStatus[]): InGameState => {
  const nextState: InGameState = currentState
  const players: Player[] = nextState.players

  // // mute/unmute music
  // if (keysPressed.find(input => input.keyName === 'm')) {
  //   const newVolume = getMusicVolume() !== 0 ? 0 : 0.3
  //   setMusicVolume(newVolume)
  // }

  // Player 1 horizontal movement
  if (keyHeld(inputs, 'a') && playerCanMove(players[0].state) && !keyHeld(inputs, 'd')) {
    players[0] = handlePlayerMove(players[0], -1)
  }
  if (keyHeld(inputs, 'd') && playerCanMove(players[0].state) && !keyHeld(inputs, 'a')) {
    players[0] = handlePlayerMove(players[0], 1)
  }

  // Player 2 horizontal movement
  if (keyHeld(inputs, 'ArrowLeft') && playerCanMove(players[1].state) && !keyHeld(inputs, 'ArrowRight')) {
    players[1] = handlePlayerMove(players[1], -1)
  }
  if (keyHeld(inputs, 'ArrowRight') && playerCanMove(players[1].state) && !keyHeld(inputs, 'ArrowLeft')) {
    players[1] = handlePlayerMove(players[1], 1)
  }

  players.forEach((player) => {
    keysPressed.forEach((key: KeyStatus) => {
        const input = Object.entries(player.playerInputs).find(([keyName, _]: [string, PlayerInput]) => keyName === key.keyName)

        if (input) {
          switch (input[1]) {
            case PlayerInput.Up:
              players[player.playerSlot] = handlePlayerJump(player)
              break

            case PlayerInput.Down:
              players[player.playerSlot] = handlePlayerFastFall(player)
              break

            case PlayerInput.Light:
              nextState.activeAttacks = handleAttack('Light', player, inputs, nextState.activeAttacks)
              break

            case PlayerInput.Special:
              nextState.activeAttacks = handleAttack('Special', player, inputs, nextState.activeAttacks)
              break

            case PlayerInput.Meter:
              nextState.activeAttacks = handleAttack('Meter', player, inputs, nextState.activeAttacks)
              break

            default:

          }
        }
      })
  })

  return { ...nextState, players: players }
}

function handleAttack(inputName: AttackStrength, player: Player, inputs: InputStatus, activeAttacks: ActiveAttack[]): ActiveAttack[] {
  console.log(`${inputName} pressed by player ${player.playerSlot}`)
  if (playerCanAct(player.state)) {
    const attack: ActiveAttack | undefined = getAttackFromInput(inputName, player, inputs, activeAttacks)
    if (attack) {
      activeAttacks = addActiveAttack(attack, activeAttacks)
      player.state = 'attacking'
      player.framesUntilNeutral = attack.duration
    }
  }
  return activeAttacks
}

function keyHeld(inputs: InputStatus, key: string) {
  return inputs && inputs[key] && inputs[key].isDown
}

function actionToAttackDirection(action: PlayerInput, facing: 'left' | 'right', state: CharacterState): AttackDirection {
  switch (action) {
    case PlayerInput.Left: return state === 'groundborne' ? 'Forward' : /*airborne*/ (facing === 'left' ? 'Forward' : 'Back')
    case PlayerInput.Right: return state === 'groundborne' ? 'Forward' : /*airborne*/ (facing === 'right' ? 'Forward' : 'Back')
    case PlayerInput.Down: return 'Down'
    case PlayerInput.Up: return state === 'airborne' ? 'Up' : 'Neutral'
    case PlayerInput.Neutral: return 'Neutral'
    case undefined: return 'Neutral'
    default:
      return 'Neutral'
  }
}

function getAttackFromInput(attackStrength: AttackStrength, player: Player, inputs: InputStatus, activeAttacks: ActiveAttack[]): ActiveAttack | undefined {
  if (playerCanAct(player.state)) {
    const isHoldingLeft =  (player.playerSlot === 0 && keyHeld(inputs, 'a')) || (player.playerSlot === 1 && keyHeld(inputs, 'ArrowLeft'))
    const isHoldingRight = (player.playerSlot === 0 && keyHeld(inputs, 'd')) || (player.playerSlot === 1 && keyHeld(inputs, 'ArrowRight'))
    const isHoldingDown =  (player.playerSlot === 0 && keyHeld(inputs, 's')) || (player.playerSlot === 1 && keyHeld(inputs, 'ArrowDown'))
    const isHoldingUp =    (player.playerSlot === 0 && keyHeld(inputs, 'w')) || (player.playerSlot === 1 && keyHeld(inputs, 'ArrowUp'))
    const playerDirection = isHoldingLeft ? PlayerInput.Left :
                            (isHoldingRight ? PlayerInput.Right :
                            (isHoldingDown ? PlayerInput.Down :
                            (isHoldingUp ? PlayerInput.Up :
                            PlayerInput.Neutral)))
    const attackDirection = actionToAttackDirection(playerDirection, player.facing, player.state)

    console.log('player can act, ATTACK!!\n  ', getAttackString(player.state, attackStrength, attackDirection))

    const attack: Attack | undefined = player.character.attacks[
      getAttackString(player.state, attackStrength, attackDirection)
    ]

    if (attack) {
      return {
        ...attack,
        playerSlot: player.playerSlot,
        xDirection: player.facing === 'left' ? -1 : 1
      }
    }
  }

  return undefined
}

function addActiveAttack(attack: ActiveAttack, activeAttacks: ActiveAttack[]): ActiveAttack[] {
  return activeAttacks.concat(attack)
}
