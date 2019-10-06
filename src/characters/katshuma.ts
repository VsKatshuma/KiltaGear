import { Character } from "../types";
import { generateAttack, createHitbox } from "../utilities";

export const Katshuma: Character = {
    name: 'Katshuma',
    id: 'katshuma',
    health: 100,
    walkSpeed: 5,
    airSpeed: 8,
    weight: 1,
    maxJumps: 2,
    jumpStrength: 1,
    hurtboxRadius: 20,
    attacks: {
      LightNeutral: {
        ...generateAttack([
          { ...createHitbox(4, 12, 5), radius: 123 },
          { ...createHitbox(12, 20, 10) },
          { ...createHitbox(19, 40, 50) }
        ]),
        projectile: true
      },
      LightForward: {
        ...generateAttack([
          {
            damage: ,
            radius: ,
            knockbackBase: ,
            knockbackGrowth: ,
            knockbackX: ,
            knockbackY: ,
            hitstunBase: ,
            hitstunGrowth: ,
            hitLag: ,
            // characterSpecific: ,
            relativeToCharacter: true,
            x: ,
            y: ,
            framesUntilActivation: ,
            framesUntilEnd: ,
            onStart: () => {},
            onActivation: () => {},
            onHit: () => {},
            onEnd: () => {},
          },
          {
            damage: ,
            radius: ,
            knockbackBase: ,
            knockbackGrowth: ,
            knockbackX: ,
            knockbackY: ,
            hitstunBase: ,
            hitstunGrowth: ,
            hitLag: ,
            // characterSpecific: ,
            relativeToCharacter: true,
            x: ,
            y: ,
            framesUntilActivation: ,
            framesUntilEnd: ,
            onStart: () => {},
            onActivation: () => {},
            onHit: () => {},
            onEnd: () => {},
          },
        ])
      }
      // TODO: Add remaining attacks
    },
}
