import styled from 'styled-components';

const DeleteDiv = styled.div<{
  size: number;
}>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #a33;
  font-size: 10px;
  line-height: ${(props) => props.size / 3 - 2}px;
  text-align: center;
`;

type Props = {
  size: number;
  visible: boolean;
  deleteSpell?: () => void;
};

export function DeleteSpellAnnotation(props: Props) {
  if (!props.visible || !props.deleteSpell) {
    return null;
  }

  return (
    <DeleteDiv size={props.size} onClick={props.deleteSpell}>
      X
    </DeleteDiv>
  );
}
