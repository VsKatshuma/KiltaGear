import { Character } from "../types";
import { generateAttack, createHitbox } from "../utilities";


export const mmKALLL: Character = {
  name: 'mmKALLL',
  id: 'mmkalll',
  health: 100,
  walkSpeed: 5,
  airSpeed: 8,
  weight: 1,
  jumpStrength: 1,
  hurtboxRadius: 20,
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
