import { WandShot } from '../eval/types';

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
