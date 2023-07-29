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
  color: black;
  font-size: 14px;
  font-family: var(--font-family-noita-default);
  font-weight: normal;
  text-shadow: rgb(26, 26, 26) 1px 0px 0px,
    rgb(41, 41, 41) 0.540302px 0.841471px 0px,
    rgb(0, 0, 0) -0.416147px 0.909297px 0px,
    rgb(255, 255, 255) -0.989993px 0.14112px 0px,
    rgb(255, 255, 255) -0.653644px -0.756803px 0px,
    rgb(255, 255, 255) 0.283662px -0.958924px 0px,
    rgb(255, 255, 255) 0.96017px -0.279416px 0px, rgb(255, 255, 255) 2px 0px 0px,
    rgba(238, 238, 238, 0.92) 1.75517px 0.958851px 0px,
    rgb(238, 238, 238) 1.0806px 1.68294px 0px,
    rgba(239, 239, 239, 0.9) 0.141474px 1.99499px 0px,
    rgba(238, 238, 238, 0.87) -0.832294px 1.81859px 0px,
    rgba(238, 238, 238, 0.77) -1.60229px 1.19694px 0px,
    rgba(238, 238, 238, 0.11) -1.97999px 0.28224px 0px,
    rgba(238, 238, 238, 0.33) -1.87291px -0.701566px 0px,
    rgba(238, 238, 238, 0.2) -1.30729px -1.51361px 0px,
    rgba(238, 238, 238, 0.31) -0.421592px -1.95506px 0px,
    rgba(255, 255, 255, 0.25) 0.567324px -1.91785px 0px,
    rgba(238, 238, 238, 0.63) 1.41734px -1.41108px 0px,
    rgb(255, 255, 255) 1.92034px -0.558831px 0px;
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
