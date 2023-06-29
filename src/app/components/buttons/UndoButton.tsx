import { useAppDispatch } from '../../redux/hooks';
import { useEffect } from 'react';
import { ActionCreators } from 'redux-undo';
import { Button } from '../generic';

type Props = {};

export function UndoButton(props: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
        dispatch(ActionCreators.undo());
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [dispatch]);

  return (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={() => dispatch(ActionCreators.undo())}
    >
      Undo
    </Button>
  );
}