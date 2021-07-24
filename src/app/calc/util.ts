import { Action, Gun, GunActionState } from './extra/types';
import { actions } from './__generated__/gun_actions';
import { subscribe } from './extra/ext_functions';
import {
  _add_card_to_deck,
  _clear_deck,
  _draw_actions_for_shot,
  _set_gun,
  _start_shot,
  mana as gunMana,
} from './gun';
import {
  ACTION_TYPE_MATERIAL,
  ACTION_TYPE_OTHER,
  ACTION_TYPE_PROJECTILE,
  ACTION_TYPE_STATIC_PROJECTILE,
  ACTION_TYPE_UTILITY,
} from './gun_enums';
import {
  combineGroups,
  GroupedObject,
  isRawObject,
  mergeProperties,
} from '../util/combineGroups';
import { entityToActionId } from './__generated__/entityProjectileMap';
import { notNullOrUndefined } from '../util/util';

export function getActionById(actionId: string): Readonly<Action> {
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];
    if (action.id === actionId) {
      return action;
    }
  }

  throw Error(`Action not found: ${actionId}`);
}

export type WandShot = {
  projectiles: Projectile[];
  calledActions: ActionCall[];
  castState?: GunActionState;
  manaDrain?: number;
};

export type GroupedWandShot = {
  projectiles: GroupedObject<GroupedProjectile>[];
  calledActions: GroupedObject<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
};

export type Projectile = {
  entity: string;
  action?: Action;
  proxy?: Action;
  trigger?: WandShot;
  deckIndex?: string | number;
};

export type GroupedProjectile = {
  entity: string;
  action?: Action;
  proxy?: Action;
  trigger?: GroupedWandShot;
  deckIndex?: string | number;
};

export enum ActionSource {
  DRAW = 'draw',
  ACTION = 'action',
  PERK = 'perk',
  MULTIPLE = 'multiple',
}

export type ActionCall = {
  action: Action;
  source: ActionSource;
  currentMana: number;
  deckIndex?: string | number;
};

export function clickWand(
  wand: Gun,
  spells: Action[],
  mana: number,
  fireUntilReload: boolean,
  endOnRefresh: boolean = true,
) {
  if (spells.filter((s) => s != null).length === 0) {
    return [];
  }

  let iterations = 0;
  const iterationLimit = 26;
  let reloaded = false;
  let wandShots: WandShot[] = [];
  let currentShot: WandShot;
  let currentShotStack: WandShot[];
  let lastCalledAction: ActionCall | undefined;
  let calledActions: ActionCall[];
  let parentShot;

  const resetState = () => {
    currentShot = {
      projectiles: [],
      calledActions: [],
    };
    calledActions = [];
    currentShotStack = [];
  };

  const unsub = subscribe((eventType, ...args) => {
    switch (eventType) {
      case 'BeginProjectile':
        const validSourceActionCalls = calledActions.filter((a) => {
          return [
            ACTION_TYPE_PROJECTILE,
            ACTION_TYPE_STATIC_PROJECTILE,
            ACTION_TYPE_MATERIAL,
            ACTION_TYPE_OTHER,
            ACTION_TYPE_UTILITY,
          ].includes(a.action.type);
        });

        const entity: string = args[0];

        let sourceAction =
          validSourceActionCalls[validSourceActionCalls.length - 1]?.action;
        let proxy: Action | undefined = undefined;

        if (!sourceAction) {
          // fallback to most likely entity source if no action
          if (!entityToAction[entity]) {
            throw Error(`missing entity: ${entity}`);
          }
          sourceAction = entityToAction[entity][0];
        }

        if (entity !== sourceAction.related_projectiles?.[0]) {
          if (!entityToAction[entity]) {
            throw Error(`missing entity: ${entity}`);
          }

          // check for bugged actions (missing the correct related_projectile)
          if (entityToAction[entity][0].id !== sourceAction.id) {
            // this probably means another action caused this projectile (like ADD_TRIGGER)
            proxy = sourceAction;
            sourceAction = entityToAction[entity][0];
          }
        }

        currentShot.projectiles.push({
          entity: args[0],
          action: sourceAction,
          proxy: proxy,
          deckIndex: proxy?.deck_index || sourceAction?.deck_index,
        });
        break;
      case 'BeginTriggerHitWorld':
      case 'BeginTriggerTimer':
      case 'BeginTriggerDeath':
        parentShot = currentShot;
        currentShotStack.push(currentShot);
        currentShot = {
          projectiles: [],
          calledActions: [],
        };
        parentShot.projectiles[parentShot.projectiles.length - 1].trigger =
          currentShot;
        break;
      case 'EndTrigger':
        currentShot = currentShotStack.pop()!;
        break;
      case 'EndProjectile':
        //
        break;
      case 'RegisterGunAction':
        currentShot.castState = Object.assign({}, args[0]);
        break;
      case 'OnActionCalled':
        lastCalledAction = {
          action: args[1],
          source: args[0],
          currentMana: gunMana,
          deckIndex: args[1].deck_index,
        };
        calledActions.push(lastCalledAction);
        break;
      case 'StartReload':
        reloaded = true;
        break;
      default:
    }
  });

  resetState();

  _set_gun(wand);
  _clear_deck(false);

  spells.forEach((spell, index) => {
    if (!spell) {
      return;
    }
    _add_card_to_deck(spell.id, index, spell.uses_remaining, true);
  });

  while (!reloaded && iterations < iterationLimit) {
    _start_shot(mana);
    _draw_actions_for_shot(true);
    iterations++;
    currentShot!.calledActions = calledActions!;
    currentShot!.manaDrain = mana - gunMana;
    wandShots.push(currentShot!);
    mana = gunMana;

    if (
      !fireUntilReload ||
      (endOnRefresh && lastCalledAction?.action.id === 'RESET') ||
      calledActions!.length === 0
    ) {
      break;
    }

    resetState();
  }

  unsub();

  return wandShots;
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

export const entityToAction = Object.entries(entityToActionId).reduce(
  (acc, [entityId, actionIds]) => {
    acc[entityId] = actionIds.map((actionId) => getActionById(actionId));
    return acc;
  },
  {} as { [key: string]: Action[] },
);

export const unlockFlags: string[] = [
  ...new Set(
    actions.map((a) => a.spawn_requires_flag).filter(notNullOrUndefined),
  ),
];
