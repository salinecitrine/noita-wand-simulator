import { Action, Gun } from '../extra/types';
import { subscribe } from '../extra/ext_functions';
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
  mana as gunMana,
} from '../gun';
import { entityToAction, iterativeActions } from './lookups';
import { ActionCall, TreeNode, WandShot } from './types';

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

  // action call tree
  let rootNodes: TreeNode<ActionCall>[] = [];
  let currentNode: TreeNode<ActionCall> | undefined;

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
    currentShot!.actionTree = rootNodes;
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
