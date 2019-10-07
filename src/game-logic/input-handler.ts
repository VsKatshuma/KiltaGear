import { Player, KeyStatus, InputStatus, InGameState, playerCanMove, playerCanSDI, playerCanAct, ActiveAttack, AttackStrength, AttackDirection, CharacterState } from "../types";
import { getAttackString } from "../utilities";
import { handlePlayerMove, handlePlayerJump } from "./physics";

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
  // console.log(keyHeld(inputs, 'ArrowLeft'), playerCanMove(players[1].state))

  if (keyHeld(inputs, 'a') && playerCanMove(players[0].state) && !keyHeld(inputs, 'd')) {
    players[0] = handlePlayerMove(players[0], -1)
  }
  if (keyHeld(inputs, 'd') && playerCanMove(players[0].state) && !keyHeld(inputs, 'a')) {
    players[0] = handlePlayerMove(players[0], 1)
  }

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
              console.log('JUMP!!!')
              players[player.playerSlot] = handlePlayerJump(player)
              break
            case PlayerInput.Down:
              if (player.state === 'airborne') {
                player.ySpeed += player.character.weight * 10
              }
              break
            case PlayerInput.Light:
              console.log('Light pressed by player', player.playerSlot)
              nextState.activeAttacks = addActiveAttack('Light', player, inputs, nextState.activeAttacks)
              break

            case PlayerInput.Special:
              console.log('Special pressed by player', player.playerSlot)
              nextState.activeAttacks = addActiveAttack('Special', player, inputs, nextState.activeAttacks)
              break

            case PlayerInput.Meter:
              console.log('Meter pressed by player', player.playerSlot)
              nextState.activeAttacks = addActiveAttack('Meter', player, inputs, nextState.activeAttacks)
              break
            default:

          }
        }
      })
  })

  return { ...nextState, players: players }
}

function keyHeld(inputs: InputStatus, key: string) {
  return inputs && inputs[key] && inputs[key].isDown
}

function actionToAttackDirection(action: PlayerInput, facing: 'left' | 'right', state: CharacterState): AttackDirection {
  switch (action) {
    case PlayerInput.Left: return state === 'groundborne' ? 'Forward' : (facing === 'left' ? 'Forward' : 'Back')
    case PlayerInput.Right: return state === 'groundborne' ? 'Forward' : (facing === 'right' ? 'Forward' : 'Back')
    case PlayerInput.Down: return 'Down'
    case PlayerInput.Up: return state === 'airborne' ? 'Up' : 'Neutral'
    case PlayerInput.Neutral: return 'Neutral'
    case undefined: return 'Neutral'
    default:
      return 'Neutral'
  }
}

function addActiveAttack(attackStrength: AttackStrength, player: Player, inputs: InputStatus, activeAttacks: ActiveAttack[]): ActiveAttack[] {
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

    return activeAttacks.concat(
      {
        ...player.character.attacks[
            getAttackString(player.state, attackStrength, attackDirection)
        ],
        playerSlot: player.playerSlot,
        xDirection: player.facing === 'left' ? -1 : 1
      }
    )
  }
  return activeAttacks
}
