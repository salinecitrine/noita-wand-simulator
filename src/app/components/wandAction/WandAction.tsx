import styled from 'styled-components';
import { DeckIndexAnnotation } from './annotations/DeckIndexAnnotation';
import { ActionSourceAnnotation } from './annotations/ActionSourceAnnotation';
import { ActionProxyAnnotation } from './annotations/ActionProxyAnnotation';
import { DeleteSpellAnnotation } from './annotations/DeleteSpellAnnotation';
import { useState } from 'react';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';
import { RecursionAnnotation } from './annotations/RecursionAnnotation';
import { iterativeActions, recursiveActions } from '../../calc/eval/lookups';
import { DontDrawAnnotation } from './annotations/DontDrawAnnotation';

export const DEFAULT_SIZE = 48;

const ImageBackgroundDiv = styled.div<{
  size: number;
  imgUrl: string;
}>`
  position: relative;
  background-color: #111;
  min-width: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-image: url(/${({ imgUrl }) => imgUrl});
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
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
    return <ImageBackgroundDiv size={size} imgUrl="" />;
  }

  return (
    <ImageBackgroundDiv
      size={size}
      imgUrl={props.action.sprite}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
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
      <DontDrawAnnotation
        size={size}
        dontDrawActions={props.dont_draw_actions}
      />
    </ImageBackgroundDiv>
  );
}
