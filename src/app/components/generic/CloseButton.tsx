import styled from 'styled-components';

const StyledButton = styled.button`
  border: 1px solid #111;
  color: black;
  background-color: #a33;

  &:hover {
    background-color: #c55;
  }
`;

type Props = {
  onClick: () => void;
};

export function CloseButton(props: Props) {
  return <StyledButton onClick={props.onClick}>X</StyledButton>;
}
