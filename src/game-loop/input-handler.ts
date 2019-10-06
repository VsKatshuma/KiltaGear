import { Player, KeyStatus, InputStatus, InGameState, playerCanMove, playerCanSDI, playerCanAct } from "../types";
import { getAttackString } from "../utilities";

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

  players.forEach((player) => {
    keysPressed.forEach((key: KeyStatus) => {
        const input = Object.entries(player.playerInputs).find(([keyName, _]: [string, PlayerInput]) => keyName === key.keyName)

        if (input) {
          switch (input[1]) {
            case PlayerInput.Up:
              if (player.jumps > 0) {
                player.jumps -= 1
                player.ySpeed -= player.character.jumpStrength // positive y is downwards
              }

            case PlayerInput.Down:
              if (player.state === 'airborne') {
                player.ySpeed += player.character.weight * 3
              }

            case PlayerInput.Left:
            case PlayerInput.Right:
              const direction: number = input[1] === PlayerInput.Left ? -1 : 1
              if (playerCanMove(player.state)) {
                player.xSpeed = 3 * direction
              }

              if (playerCanSDI(player.state)) {
                player.x += 3 * direction
              }
              break

            case PlayerInput.Light:
              if (playerCanAct(player.state)) {
                nextState.activeAttacks.push(
                    player.character.attacks[
                        getAttackString(player.state, 'Light', 'Neutral')
                    ]
                )
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

  return nextState
}

function keyHeld(inputs: InputStatus, key: string) {
  return inputs && inputs[key] && inputs[key].isDown
}

