import { ActiveAttack, Player } from "./types";
import { InGameState } from "./gameloop";

export const checkCollisions = (state: InGameState): InGameState => {
  const players: Player[] = state.players
  const activeAttacks: ActiveAttack[] = state.activeAttacks

  return { ...state }
}
