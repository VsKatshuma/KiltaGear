import { Player, KeyStatus, InputStatus, InGameState, playerCanMove, playerCanSDI, playerCanAct } from "../types";
import { getAttackString } from "../utilities";
import { handlePlayerMove, handlePlayerJump } from "./physics";

export enum PlayerInput {
  Left,
  Right,
  Up,
  Down,
  Light,
  Special,
  Meter
}

export type PlayerAction = { playerPort: number, action: PlayerInput }

export const handlePlayerInputs = (currentState: InGameState, inputs: InputStatus, keysPressed: KeyStatus[], keysReleased: KeyStatus[]): InGameState => {
  const nextState: InGameState = currentState
  const players: Player[] = nextState.players
  // console.log(keyHeld(inputs, 'ArrowLeft'), playerCanMove(players[1].state))

  if (keyHeld(inputs, 'a') && playerCanMove(players[0].state)) {
    players[0] = handlePlayerMove(players[0], -1)
  }
  if (keyHeld(inputs, 'd') && playerCanMove(players[0].state)) {
    players[0] = handlePlayerMove(players[0], 1)
  }

  if (keyHeld(inputs, 'ArrowLeft') && playerCanMove(players[1].state)) {
    players[1] = handlePlayerMove(players[1], -1)
  }
  if (keyHeld(inputs, 'ArrowRight') && playerCanMove(players[1].state)) {
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
                player.ySpeed += player.character.weight * 3
              }
              break
            case PlayerInput.Light:
              console.log('light pressed by player', player.playerSlot)
              if (playerCanAct(player.state)) {
                console.log('player can act')
                if (keyHeld(inputs, 'ArrowLeft') || keyHeld(inputs, 'ArrowRight')) {
                  nextState.activeAttacks.push(
                    player.character.attacks[
                        getAttackString(player.state, 'Light', 'Forward')
                    ]
                  )
                } else {
                  console.log('Neutral attack!')
                  nextState.activeAttacks.push(
                    {
                      ...player.character.attacks[
                          getAttackString(player.state, 'Light', 'Neutral')
                      ],
                      player: player.playerSlot
                    }
                  )
                }
              }
              break

            case PlayerInput.Special:
              if (playerCanAct(player.state)) {
                nextState.activeAttacks.push(
                    player.character.attacks[
                        getAttackString(player.state, 'Special', 'Neutral')
                    ]
                )
              }
              break

            case PlayerInput.Meter:
              if (playerCanAct(player.state)) {
                nextState.activeAttacks.push(
                    player.character.attacks[
                        getAttackString(player.state, 'Meter', 'Neutral')
                    ]
                )
              }
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

