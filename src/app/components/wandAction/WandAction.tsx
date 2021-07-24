import styled from 'styled-components';
import { Action } from '../../calc/extra/types';
import { DeckIndexAnnotation } from './annotations/DeckIndexAnnotation';
import { ActionSourceAnnotation } from './annotations/ActionSourceAnnotation';
import { ActionProxyAnnotation } from './annotations/ActionProxyAnnotation';
import { DeleteSpellAnnotation } from './annotations/DeleteSpellAnnotation';
import { useState } from 'react';
import {
  ActionCall,
  ActionSource,
  GroupedProjectile,
} from '../../calc/eval/types';
import { RecursionAnnotation } from './annotations/RecursionAnnotation';

export const DEFAULT_SIZE = 48;

const ImageBackgroundDiv = styled.div<{
  size: number;
  imgUrl: string;
}>`
  position: relative;
  background-color: #111;
  min-width: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-image: url(${(props) => props.imgUrl});
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
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
      <RecursionAnnotation size={size} recursion={props.recursion} />
      <ActionSourceAnnotation size={size} source={props.source} />
      <ActionProxyAnnotation size={size} proxy={props.proxy} />
      <DeleteSpellAnnotation
        size={size}
        visible={mouseOver}
        deleteSpell={props.onDeleteSpell}
      />
    </ImageBackgroundDiv>
  );
}
