import styled from 'styled-components';
import { useAppSelector } from '../../../redux/hooks';
import { selectConfig } from '../../../redux/configSlice';

/*
  height: ${(props) => props.size / 4}px;
  height: 11px;
  line-height: ${(props) => props.size / 3 - 3}px;
  border: 1px solid #999;
  background-color: #ddd;
  border-radius: 8px 0 8px 0;
  padding: 1px 3px 0 2px;
  min-width: 10px;
  min-width: ${(props) => props.size / 4}px;
  text-align: center;
 */

const IndexDiv = styled.div<{
  size: number;
}>`
  pointer-events: none;
  position: absolute;
  bottom: -6px;
  right: -6px;
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-family: var(--font-family-noita-default);
  font-weight: normal;
  --shadow-bg: rgb(0, 0, 0);
  --shadow-w: 0px;
  text-shadow: var(--shadow-bg) 1px 1px var(--shadow-w),
    var(--shadow-bg) 1px -1px var(--shadow-w),
    var(--shadow-bg) -1px 1px var(--shadow-w),
    var(--shadow-bg) -1px -1px var(--shadow-w), var(--shadow-bg) 1px 1px 1px,
    var(--shadow-bg) 1px -1px 1px, var(--shadow-bg) -1px 1px 1px,
    var(--shadow-bg) -1px -1px 1px;
`;

type Props = {
  size: number;
  deckIndex?: number | string;
};

export function DeckIndexAnnotation(props: Props) {
  const { config } = useAppSelector(selectConfig);
  if (props.deckIndex === undefined || !config.showDeckIndexes) {
    return null;
  }

  if (typeof props.deckIndex === 'number') {
    return <IndexDiv size={props.size}>{props.deckIndex + 1}</IndexDiv>;
  } else {
    return <IndexDiv size={props.size}>{props.deckIndex}</IndexDiv>;
  }
}
