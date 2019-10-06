import { Player, KeyStatus, InputStatus } from "./types";
import { GameState, InGameState } from "./gameloop";

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
  const players: Player[] = currentState.players

  const playerActions: PlayerAction[] =
      keysPressed.map((key: KeyStatus) => {
        const player = players.find((player: Player) => player.playerInputs[key.keyName] in PlayerInput)
        if (player) {
          return player.playerInputs[key.keyName]
        }
        return null
      })

  const nextState: InGameState = playerActions.map((action: PlayerAction) => {
    // TODO
  })

  return nextState
}

function keyHeld(inputs: InputStatus, key: string) {
  return inputs && inputs[key] && inputs[key].isDown
}
