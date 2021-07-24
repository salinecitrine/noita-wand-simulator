import {
  combineGroups,
  isRawObject,
  mergeProperties,
} from '../../util/combineGroups';
import { ActionCall, GroupedWandShot, Projectile, WandShot } from './types';

function condenseActions(calledActions: ActionCall[]) {
  return combineGroups(
    calledActions,
    (a) => a.action.id,
    (o) => {
      // deck index and source
      if (o.map(isRawObject).every((v) => v)) {
        return mergeProperties(o as ActionCall[], [
          { prop: 'deckIndex', conflictValue: '*' },
          { prop: 'source', conflictValue: 'multiple' },
        ]);
      } else {
        return o[0];
      }
    },
  );
}

function condenseProjectiles(projectiles: Projectile[]) {
  const projectilesWithProcessedTriggers = projectiles.map((proj) => {
    if (proj.trigger) {
      return {
        ...proj,
        trigger: condenseActionsAndProjectiles(proj.trigger as WandShot),
      };
    } else {
      return proj;
    }
  });
  return combineGroups(
    projectilesWithProcessedTriggers,
    (p) => p.entity,
    (o) => {
      // deck index and source
      if (o.map(isRawObject).every((v) => v)) {
        return mergeProperties(o as Projectile[], [
          { prop: 'deckIndex', conflictValue: '*' },
        ]);
      } else {
        return o[0];
      }
    },
  );
}

export function condenseActionsAndProjectiles(
  wandShot: WandShot,
): GroupedWandShot {
  return {
    ...wandShot,
    calledActions: condenseActions(wandShot.calledActions),
    projectiles: condenseProjectiles(wandShot.projectiles),
  };
}
