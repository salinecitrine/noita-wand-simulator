import { entityToActionId as entityToActionIdRelease } from './__generated__/entityProjectileMap';
import { entityToActionId as entityToActionIdBeta } from './__generated__/entityProjectileMap.beta';

// It would be ideal to be able to switch between the beta and release versions of actions at runtime, but that seems like excessive complexity given the current changes mostly add entirely new spells

export const entityToActionId = entityToActionIdBeta;

