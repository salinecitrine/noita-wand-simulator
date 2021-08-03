import { lazy, notNullOrUndefined } from '../../util/util';
import { entityToActionId } from '../__generated__/entityProjectileMap';
import { Action } from '../extra/types';
import { actions } from '../__generated__/gun_actions';
import { getActionById } from './util';

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

export const recursiveActions = lazy(() => [
  ...new Set(actions.filter((a) => a.recursive).map((a) => a.id)),
]);

export const iterativeActions = lazy(() => [
  'DIVIDE_2',
  'DIVIDE_3',
  'DIVIDE_4',
  'DIVIDE_10',
]);

export const GREEK_SPELLS = lazy(() => [
  'ALPHA',
  'GAMMA',
  'TAU',
  'OMEGA',
  'MU',
  'PHI',
  'SIGMA',
  'ZETA',
]);
