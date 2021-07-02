import styled from 'styled-components';
import { Action } from '../../calc/extra/types';
import { ActionSource } from '../../calc/util';

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

const IndexDiv = styled.div<{
  size: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #ddd;
  font-size: 10px;
  line-height: ${(props) => props.size / 3}px;
  text-align: center;
`;

const SourceDiv = styled.div<{
  size: number;
  colors: [string, string];
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  color: ${(props) => props.colors[0]};
  background-color: ${(props) => props.colors[1]};
  font-size: 12px;
  line-height: ${(props) => props.size / 3}px;
  text-align: center;
`;

const ProxyDiv = styled.div<{
  size: number;
  imgUrl: string;
}>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => props.size / 3}px;
  height: ${(props) => props.size / 3}px;
  border: 1px solid #999;
  background-image: url(${(props) => props.imgUrl});
  background-size: cover;
`;

const sourceDisplayMap: Record<ActionSource, [string, [string, string]]> = {
  perk: ['P', ['#ddd', '#995']],
  action: ['A', ['#ddd', '#955']],
  draw: ['D', ['#ddd', '#559']],
  multiple: ['*', ['#ddd', '#747']],
};

type Props = {
  size?: number;
  action?: Action;
  count?: number;
  source?: ActionSource;
  proxy?: Action;
  deckIndex?: number | string;
  ref?: any;
};

export function WandAction(props: Props) {
  const size = props.size || DEFAULT_SIZE;

  if (!props.action) {
    return (
      <ImageBackgroundDiv
        size={size}
        imgUrl=""
      />
    );
  }

  const renderSource = (source: ActionSource) => (
    <SourceDiv size={size} colors={sourceDisplayMap[source][1]}>
      {sourceDisplayMap[source][0]}
    </SourceDiv>
  );

  const renderDeckIndex = (deckIndex: number | string) => {
    if (typeof deckIndex === 'number') {
      return <IndexDiv size={size}>{deckIndex + 1}</IndexDiv>;
    } else {
      return <IndexDiv size={size}>{deckIndex}</IndexDiv>;
    }
  };

  return (
    <ImageBackgroundDiv
      size={size}
      imgUrl={props.action.sprite}
    >
      {props.deckIndex !== undefined && renderDeckIndex(props.deckIndex)}
      {props.source && renderSource(props.source)}
      {props.proxy && <ProxyDiv size={size} imgUrl={props.proxy.sprite} />}
    </ImageBackgroundDiv>
  );
}
