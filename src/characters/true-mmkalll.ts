import { Character } from "../types";
import { generateAttack, createHitbox } from "../utilities";


export const True_mmKALLL: Character = {
    name: '真・mmKALLL',
    id: 'true-mmkalll',
    maxHealth: 100,
    walkSpeed: 5,
    airSpeed: 8,
    weight: 1,
    maxJumps: 2,
    jumpStrength: 1,
    hurtboxRadius: 30,
    attacks: {
        LightNeutral: {
            ...generateAttack([
                { ...createHitbox(4, 12, 5), radius: 123 },
                { ...createHitbox(12, 20, 10) },
                { ...createHitbox(19, 40, 50) }
            ]),
            projectile: true,
        }
    }
}
