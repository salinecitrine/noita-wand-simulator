import { Action } from '../extra/types';
import { actions } from '../__generated__/gun_actions';
import {
  combineGroups,
  isRawObject,
  mergeProperties,
} from '../../util/combineGroups';
import { entityToActionId } from '../__generated__/entityProjectileMap';
import { notNullOrUndefined } from '../../util/util';
import { ActionCall, GroupedWandShot, Projectile, WandShot } from './clickWand';

export function getActionById(actionId: string): Readonly<Action> {
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];
    if (action.id === actionId) {
      return action;
    }
  }

  throw Error(`Action not found: ${actionId}`);
}

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

export const lazy = <T>(callback: () => T) => {
  let val: T | undefined = undefined;
  return () => {
    if (val === undefined) {
      val = callback();
    }
    return val;
  };
};

export const entityToAction = lazy(() =>
  Object.entries(entityToActionId).reduce((acc, [entityId, actionIds]) => {
    acc[entityId] = actionIds.map((actionId) => getActionById(actionId));
    return acc;
  }, {} as { [key: string]: Action[] }),
);

export const unlockFlags = lazy(() => [
  ...new Set(
    actions.map((a) => a.spawn_requires_flag).filter(notNullOrUndefined),
  ),
]);
