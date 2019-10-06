import { ActiveAttack, Player, InGameState } from "../types";

export const checkCollisions = (state: InGameState): InGameState => {
  const players: Player[] = state.players
  const activeAttacks: ActiveAttack[] = state.activeAttacks

  // activeAttacks

  // TODO: Check for wall/floorbounce

  return { ...state }
}
