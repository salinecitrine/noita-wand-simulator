import styled from 'styled-components';

const StyledSpan = styled.span`
  font-weight: bold;
  color: red;
  background-color: #555;
  padding: 2px;
`;

type Props = {
  hitIterationLimit: boolean;
};

export function IterationLimitWarning(props: Props) {
  if (!props.hitIterationLimit) {
    return null;
  }

  return <StyledSpan>Iteration limit reached</StyledSpan>;
}
