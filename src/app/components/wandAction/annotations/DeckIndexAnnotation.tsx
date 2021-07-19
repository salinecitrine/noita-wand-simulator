import styled from 'styled-components';

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

type Props = {
  size: number;
  deckIndex?: number | string;
};

export function DeckIndexAnnotation(props: Props) {
  if (props.deckIndex === undefined) {
    return null;
  }

  if (typeof props.deckIndex === 'number') {
    return <IndexDiv size={props.size}>{props.deckIndex + 1}</IndexDiv>;
  } else {
    return <IndexDiv size={props.size}>{props.deckIndex}</IndexDiv>;
  }
}
