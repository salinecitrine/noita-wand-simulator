import { Action } from '../extra/types';
import { actions } from '../__generated__/gun_actions';

export function getActionById(actionId: string): Readonly<Action> {
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];
    if (action.id === actionId) {
      return action;
    }
  }

  throw Error(`Action not found: ${actionId}`);
}
