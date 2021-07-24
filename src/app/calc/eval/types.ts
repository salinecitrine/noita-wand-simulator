import { Action, GunActionState } from '../extra/types';
import { GroupedObject } from '../../util/combineGroups';

export type WandShot = {
  projectiles: Projectile[];
  calledActions: ActionCall[];
  actionTree: TreeNode<ActionCall>[];
  castState?: GunActionState;
  manaDrain?: number;
};
export type GroupedWandShot = {
  projectiles: GroupedObject<GroupedProjectile>[];
  calledActions: GroupedObject<ActionCall>[];
  actionTree: TreeNode<ActionCall>[];
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
  recursion?: number;
  iteration?: number;
};
export type TreeNode<T> = {
  value: T;
  parent?: TreeNode<T>;
  children: TreeNode<T>[];
};
