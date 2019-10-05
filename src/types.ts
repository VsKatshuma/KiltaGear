export type Attack = {
  hitboxes: Hitbox[],
  projectile: boolean,
  onStart?: () => void,
  onEnd?: () => void
}

export type ActiveAttack = Attack & { player: number }

export type Hitbox = {
  damage: number,
  radius: number,
  knockbackBase: number,
  knockbackGrowth: number,
  knockbackX: number,
  knockbackY: number,
  hitstunBase: number,
  hitstunGrowth: number,
  hitLag: number,
  // characterSpecific: number,
  relativeToCharacter: boolean,
  x: number,
  y: number,
  framesUntilActivation: number,
  framesUntilEnd: number,
  onStart?: () => void,
  onActivation?: () => void,
  onHit?: () => void,
  onEnd?: () => void
}
