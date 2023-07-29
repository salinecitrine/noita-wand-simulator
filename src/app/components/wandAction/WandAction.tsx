import styled from 'styled-components';
import { useState } from 'react';
import {
  ActionProxyAnnotation,
  ActionSourceAnnotation,
  DeckIndexAnnotation,
  DeleteSpellAnnotation,
  DontDrawAnnotation,
  FriendlyFireAnnotation,
  NoManaAnnotation,
  RecursionAnnotation,
} from './annotations/';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';
import { iterativeActions, recursiveActions } from '../../calc/eval/lookups';
import {
  ActionType,
  ActionTypeId,
  actionTypeToIdMap,
  actionTypeInfoMap,
} from '../../util/util';

export const DEFAULT_SIZE = 48;

const ImageBackgroundDiv = styled.div<{
  size: number;
  actionImgUrl: string;
  typeImgUrl?: string;
  mouseOver: boolean;
}>`
  position: relative;
  min-width: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-image: url(/${({ actionImgUrl }) => actionImgUrl})
    ${({ typeImgUrl }) => (typeImgUrl ? `, url(/${typeImgUrl})` : ``)};
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;

  &:hover {
    transform-origin: center;
    transform: scale(109%);
    transition: transform var(--anim-basic-in);
    cursor: move;
  }
`;

type Props = {
  size?: number;
  onDeleteSpell?: () => void;
} & Partial<ActionCall> &
  Partial<GroupedProjectile>;

export function WandAction(props: Props) {
  const [mouseOver, setMouseOver] = useState(false);

  const size = props.size || DEFAULT_SIZE;

  if (!props.action) {
    return (
      <ImageBackgroundDiv
        size={size}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        actionImgUrl=""
        mouseOver={mouseOver}
      />
    );
  }

  return (
    <ImageBackgroundDiv
      size={size}
      actionImgUrl={props.action.sprite}
      typeImgUrl={
        // TODO - set action types when generating gun actions from lua to avoid mapping this
        actionTypeInfoMap[
          actionTypeToIdMap.get(props.action.type as ActionTypeId) as ActionType
        ]?.src
      }
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      mouseOver={mouseOver}
    >
      <DeckIndexAnnotation size={size} deckIndex={props.deckIndex} />
      <RecursionAnnotation
        size={size}
        recursive={recursiveActions().includes(props.action?.id)}
        iterative={iterativeActions().includes(props.action?.id)}
        recursion={props.recursion}
        iteration={props.iteration}
      />
      <ActionSourceAnnotation size={size} source={props.source} />
      <ActionProxyAnnotation size={size} proxy={props.proxy} />
      <DeleteSpellAnnotation
        size={size}
        visible={mouseOver}
        deleteSpell={props.onDeleteSpell}
      />
      <NoManaAnnotation size={size} />
      <FriendlyFireAnnotation size={size} />
      <DontDrawAnnotation
        size={size}
        dontDrawActions={props.dont_draw_actions}
      />
    </ImageBackgroundDiv>
  );
}
