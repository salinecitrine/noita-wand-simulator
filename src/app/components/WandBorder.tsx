import styled from 'styled-components';

const DEFAULT_WIDTH = '3px';

export const WandBorder = styled.div<{
  inactive?: boolean;
  width?: string;
}>`
  position: relative;
  border: ${({ width = DEFAULT_WIDTH }) => width} solid transparent;

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    margin: -${({ width = DEFAULT_WIDTH }) => width};
    left: 0px;
    top: 0px;
    background-color: transparent;
    border: ${({ width = DEFAULT_WIDTH }) => width} solid transparent;
    ${({ inactive = false }) =>
      inactive
        ? `border-image-source: url(/data/border_inactive.png);`
        : `border-image-source: url(/data/border_active.png);`}
    border-image-outset: 0;
    border-image-repeat: repeat;
    border-image-slice: 2;
    border-image-width: 2;
    image-rendering: pixelated;
  }
`;
