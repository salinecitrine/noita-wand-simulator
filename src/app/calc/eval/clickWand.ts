import { Action, Gun } from '../extra/types';
import { override, subscribe } from '../extra/ext_functions';
import {
  ACTION_TYPE_MATERIAL,
  ACTION_TYPE_OTHER,
  ACTION_TYPE_PROJECTILE,
  ACTION_TYPE_STATIC_PROJECTILE,
  ACTION_TYPE_UTILITY,
} from '../gun_enums';
import {
  _add_card_to_deck,
  _clear_deck,
  _draw_actions_for_shot,
  _set_gun,
  _start_shot,
  dont_draw_actions,
  mana as gunMana,
  state_from_game,
} from '../gun';
import { entityToAction, iterativeActions } from './lookups';
import { ActionCall, Requirements, TreeNode, WandShot } from './types';

export function clickWand(
  wand: Gun,
  spells: Action[],
  mana: number,
  castDelay: number,
  fireUntilReload: boolean,
  endOnRefresh: boolean,
  requirements?: Requirements,
): [WandShot[], number | undefined, boolean] {
  if (spells.filter((s) => s != null).length === 0) {
    return [[], undefined, false];
  }

  let iterations = 0;
  const iterationLimit = 10;
  let reloaded = false;
  let wandShots: WandShot[] = [];
  let currentShot: WandShot;
  let currentShotStack: WandShot[];
  let lastCalledAction: ActionCall | undefined;
  let calledActions: ActionCall[];
  let parentShot;

  // action call tree
  let rootNodes: TreeNode<ActionCall>[] = [];
  let currentNode: TreeNode<ActionCall> | undefined;

  let reloadTime: number | undefined;

  let if_half_state = requirements?.half ? 1 : 0;

  const resetState = () => {
    currentShot = {
      projectiles: [],
      calledActions: [],
      actionTree: [],
    };
    calledActions = [];
    currentShotStack = [];
    rootNodes = [];
    currentNode = undefined;
  };

  let removeOverrides = [];
  if (requirements) {
    removeOverrides.push(
      override('EntityGetInRadiusWithTag', (args) => {
        if (args[3] === 'homing_target') {
          return requirements.enemies ? new Array(15) : [];
        } else if (args[3] === 'projectile') {
          return requirements.projectiles ? new Array(20) : [];
        }
      }),
    );
    removeOverrides.push(
      override('EntityGetFirstComponent', (args) => {
        if (args[1] === 'DamageModelComponent') {
          return 'IF_HP'; // just has to be non-null
        }
      }),
    );
    removeOverrides.push(
      override('ComponentGetValue2', (args) => {
        if (args[0] === 'IF_HP') {
          if (args[1] === 'hp') {
            return requirements.hp ? 25000 / 25 : 100000 / 25;
          } else if (args[1] === 'max_hp') {
            return 100000 / 25;
          }
        }
      }),
    );
    removeOverrides.push(
      override('GlobalsGetValue', (args) => {
        if (args[0] === 'GUN_ACTION_IF_HALF_STATUS') {
          return `${if_half_state}`;
        }
      }),
    );
    removeOverrides.push(
      override('GlobalsSetValue', (args) => {
        if (args[0] === 'GUN_ACTION_IF_HALF_STATUS') {
          if_half_state = Number.parseInt(args[1]);
        }
      }),
    );
  }

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
          if (!entityToAction()[entity]) {
            throw Error(`missing entity: ${entity}`);
          }
          sourceAction = entityToAction()[entity][0];
        }

        if (entity !== sourceAction.related_projectiles?.[0]) {
          if (!entityToAction()[entity]) {
            throw Error(`missing entity: ${entity}`);
          }

          // check for bugged actions (missing the correct related_projectile)
          if (entityToAction()[entity][0].id !== sourceAction.id) {
            // this probably means another action caused this projectile (like ADD_TRIGGER)
            proxy = sourceAction;
            sourceAction = entityToAction()[entity][0];
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
          actionTree: [],
        };
        parentShot.projectiles[parentShot.projectiles.length - 1].trigger =
          currentShot;
        break;
      case 'EndTrigger':
        currentShot = currentShotStack.pop()!;
        break;
      case 'EndProjectile':
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
          recursion: args[1].recursive ? args?.[3] || 0 : args?.[3],
          iteration: iterativeActions().includes(args[1].id)
            ? args?.[4] || 1
            : undefined,
          dont_draw_actions: dont_draw_actions,
        };

        if (!currentNode) {
          currentNode = {
            value: lastCalledAction,
            children: [],
          };
          rootNodes.push(currentNode);
        } else {
          const newNode = {
            value: lastCalledAction,
            children: [],
            parent: currentNode,
          };
          currentNode?.children.push(newNode);
          currentNode = newNode;
        }
        calledActions.push(lastCalledAction);
        break;
      case 'OnActionFinished':
        currentNode = currentNode?.parent;
        break;
      case 'StartReload':
        reloaded = true;
        reloadTime = args[0];
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
    state_from_game.fire_rate_wait = castDelay;
    _start_shot(mana);
    _draw_actions_for_shot(true);
    iterations++;
    currentShot!.calledActions = calledActions!;
    currentShot!.actionTree = rootNodes;
    currentShot!.manaDrain = mana - gunMana;
    wandShots.push(currentShot!);
    mana = gunMana;

    if (
      !fireUntilReload ||
      (endOnRefresh &&
        calledActions!.filter((a) => a.action.id === 'RESET').length > 0) ||
      calledActions!.length === 0
    ) {
      break;
    }

    resetState();
  }

  unsub();
  removeOverrides.forEach((cb) => cb());

  return [wandShots, reloadTime, iterations === iterationLimit];
}
