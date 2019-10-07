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
            damage: 4,
            radius: 20,
            knockbackBase: 1,
            knockbackGrowth: 1,
            knockbackX: 0, // NEEDS TO TAKE FACING INTO ACCOUNT
            knockbackY: -5,
            hitstunBase: 1,
            hitstunGrowth: 1,
            hitLag: 30,
            // characterSpecific: ,
            relativeToCharacter: true,
            x: 5, // NEEDS TO TAKE FACING INTO ACCOUNT
            y: 5,
            framesUntilActivation: 0,
            framesUntilEnd: 40,
            onStart: () => {},
            onActivation: () => {},
            onHit: () => {},
            onEnd: () => {},
          }
        ])
      }
      // TODO: Add remaining attacks
    },
}
