import { actions as actionsRelease } from './__generated__/gun_actions';
import { actions as actionsBeta } from './__generated__/gun_actions.beta';

// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells

export const actions = actionsBeta;

