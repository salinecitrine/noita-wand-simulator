import styled from 'styled-components';

const WandActionBorder = styled.div<{
  size: number;
}>`
  margin: ${(props) => props.size / 48}px;
  border: ${(props) => props.size / 48}px solid '#666';
  min-width: ${(props) => props.size}px;
  min-height: ${(props) => props.size}px;

  background-color: #111;
`;

export default WandActionBorder;
