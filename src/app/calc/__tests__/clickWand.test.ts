import { getActionById } from '../eval/util';
import { clickWand } from '../eval/clickWand';
import { WandShot } from '../eval/types';
import { Gun } from '../extra/types';

type SimpleProjectile = {
  entity: string;
  trigger?: SimpleProjectile[];
};

export function wandShotToProjectiles(ws: WandShot) {
  return ws.projectiles.reduce((acc, cur) => {
    let p: SimpleProjectile = {
      entity: cur.entity,
    };
    if (cur.trigger) {
      p.trigger = wandShotToProjectiles(cur.trigger);
    }
    acc.push(p);
    return acc;
  }, [] as SimpleProjectile[]);
}

export const defaultGun: Gun = {
  actions_per_round: 1,
  shuffle_deck_when_empty: false,
  reload_time: 0,
  deck_capacity: 10,
};
describe('clickWand', () => {
  it('simple trigger', () => {
    const spells = ['DAMAGE', 'LIGHT_BULLET_TRIGGER', 'BOMB'].map(
      getActionById,
    );
    const expected = [
      [
        {
          entity: 'data/entities/projectiles/deck/light_bullet.xml',
          trigger: [
            {
              entity: 'data/entities/projectiles/bomb.xml',
            },
          ],
        },
      ],
    ];

    const [shots, reloadTime, iterationLimit] = clickWand(
      defaultGun,
      spells,
      1000,
      0,
      true,
      true,
    );
    const processed = shots.map(wandShotToProjectiles);
    expect(processed).toEqual(expected);
  });

  it('two shots', () => {
    const spells = [
      'DAMAGE',
      'LIGHT_BULLET_TRIGGER',
      'BOMB',
      'LIGHT_BULLET',
    ].map(getActionById);
    const expected = [
      [
        {
          entity: 'data/entities/projectiles/deck/light_bullet.xml',
          trigger: [
            {
              entity: 'data/entities/projectiles/bomb.xml',
            },
          ],
        },
      ],
      [
        {
          entity: 'data/entities/projectiles/deck/light_bullet.xml',
        },
      ],
    ];

    const [shots, reloadTime, iterationLimit] = clickWand(
      defaultGun,
      spells,
      1000,
      0,
      true,
      true,
    );
    const processed = shots.map(wandShotToProjectiles);
    expect(processed).toEqual(expected);
  });
});
