import styled from 'styled-components';

const StyledButton = styled.button<{
  imgUrl: string;
}>`
  border: 1px solid var(--color-button-border);
  border-radius: 5px;
  background-image: url(/${({ imgUrl }) => imgUrl});
  background-position: 0.6em 50%;
  background-origin: padding-box;
  background-size: 1em;
  background-repeat: no-repeat;
  background-color: var(--color-button-background);
  image-rendering: pixelated;
  font-family: 'noita', '04b03', sans-serif;
  font-variant: small-caps;
  font-size: 16px;
  color: var(--color-button);
  padding: 0.5em 0.6em 0.3em 2.2em;
  margin: 3px;
  cursor: pointer;

  & {
    transition: var(--transition-hover-out);
    transition-property: border-color, color;
  }

  &:hover {
    color: var(--color-button-hover);
    border-color: var(--color-button-border-hover);
    transition: var(--transition-hover-in);
    transition-property: border-color, color;
  }

  &:active {
    color: var(--color-button-active);
    border-color: var(--color-button-border-active);
    transition: var(--transition-activate);
    transition-property: border-color, color;
  }
`;

type Props = {
  onClick?: () => void;
  imgUrl?: string;
};

export const Button = ({
  onClick = () => {},
  imgUrl = '',
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <StyledButton imgUrl={imgUrl} onClick={onClick}>
      {children}
    </StyledButton>
  );
};
