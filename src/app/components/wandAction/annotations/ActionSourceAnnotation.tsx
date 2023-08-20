import styled from 'styled-components';
import { useAppSelector } from '../../../redux/hooks';
import { selectConfig } from '../../../redux/configSlice';
import { ActionSource } from '../../../calc/eval/types';

const SourceDiv = styled.div<{
  size: number;
  colors: [string, string];
}>`
  pointer-events: none;
  position: absolute;
  top: 10%;
  transform: translateY(-50%);
  left: -${(props) => props.size / 4 + 12}px;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  color: ${(props) => props.colors[0]};
  background-color: ${(props) => props.colors[1]};
  font-size: 12px;
  line-height: ${(props) => props.size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

const sourceDisplayMap: Record<ActionSource, [string, [string, string]]> = {
  perk: ['P', ['#ddd', '#995']],
  action: ['A', ['#ddd', '#955']],
  draw: ['D', ['#ddd', '#559']],
  multiple: ['*', ['#ddd', '#747']],
};

type Props = {
  size: number;
  source?: ActionSource;
};

export function ActionSourceAnnotation(props: Props) {
  const { config } = useAppSelector(selectConfig);
  if (props.source === undefined || !config.showSources) {
    return null;
  }

  return (
    <SourceDiv size={props.size} colors={sourceDisplayMap[props.source][1]}>
      {sourceDisplayMap[props.source][0]}
    </SourceDiv>
  );
}
