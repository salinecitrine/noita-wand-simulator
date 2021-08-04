import { getActionById } from '../../eval/util';
import { clickWand } from '../../eval/clickWand';
import { defaultGun, wandShotToProjectiles } from '../clickWand.test';

describe('requirement spells', () => {
  it('simple IF_ENEMY pass', () => {
    const spells = ['IF_ENEMY', 'LIGHT_BULLET', 'RESET'].map(getActionById);
    const expected = [
      [{ entity: 'data/entities/projectiles/deck/light_bullet.xml' }],
    ];

    const [shots, reloadTime, iterationLimit] = clickWand(
      defaultGun,
      spells,
      1000,
      0,
      false,
      true,
      {
        enemies: true,
        half: false,
        projectiles: false,
        hp: false,
      },
    );
    const processed = shots.map(wandShotToProjectiles);
    expect(processed).toEqual(expected);
  });

  it('simple IF_ENEMY', () => {
    const spells = ['IF_ENEMY', 'LIGHT_BULLET', 'RESET'].map(getActionById);
    const expected = [[]];

    const [shots, reloadTime, iterationLimit] = clickWand(
      defaultGun,
      spells,
      1000,
      0,
      false,
      true,
      {
        enemies: false,
        half: false,
        projectiles: false,
        hp: false,
      },
    );
    const processed = shots.map(wandShotToProjectiles);
    expect(processed).toEqual(expected);
  });
});
