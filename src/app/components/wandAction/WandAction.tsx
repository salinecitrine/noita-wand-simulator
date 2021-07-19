import styled from 'styled-components';
import { Action } from '../../calc/extra/types';
import { ActionSource } from '../../calc/util';
import { DeckIndexAnnotation } from './annotations/DeckIndexAnnotation';
import { ActionSourceAnnotation } from './annotations/ActionSourceAnnotation';
import { ActionProxyAnnotation } from './annotations/ActionProxyAnnotation';
import { DeleteSpellAnnotation } from './annotations/DeleteSpellAnnotation';
import { useAppDispatch } from '../../hooks';
import { useState } from 'react';

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
  action?: Action;
  count?: number;
  source?: ActionSource;
  proxy?: Action;
  deckIndex?: number | string;
  ref?: any;
  onDeleteSpell?: () => void;
};

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
