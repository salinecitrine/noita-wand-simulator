import styled from 'styled-components';
import { useAppSelector } from '../../../hooks';
import { selectConfig } from '../../../redux/configSlice';

const RecursionDiv = styled.div<{
  size: number;
}>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #3bb;
  font-size: 10px;
  line-height: ${(props) => props.size / 3 - 2}px;
  text-align: center;
`;

const IterationDiv = styled.div<{
  size: number;
  offset: number;
}>`
  position: absolute;
  top: 0;
  right: ${(props) =>
    (props.size * props.offset) / 4 + (props.offset > 0 ? 1 : 0)}px;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #a5e;
  font-size: 10px;
  line-height: ${(props) => props.size / 3 - 2}px;
  text-align: center;
`;

type Props = {
  size: number;
  recursive: boolean;
  iterative: boolean;
  recursion?: number | string;
  iteration?: number | string;
};

export function RecursionAnnotation(props: Props) {
  const { config } = useAppSelector(selectConfig);
  if (!config.showRecursion) {
    return null;
  }

  const rec =
    props.recursion !== undefined && (props.recursive || props.recursion > 0);
  const itr = props.iteration !== undefined && props.iterative;

  return (
    <>
      {rec && <RecursionDiv size={props.size}>{props.recursion}</RecursionDiv>}
      {itr && (
        <IterationDiv size={props.size} offset={rec ? 1 : 0}>
          {props.iteration}
        </IterationDiv>
      )}
    </>
  );
}
