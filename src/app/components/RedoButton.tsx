import { useAppDispatch } from '../redux/hooks';
import { useEffect } from 'react';
import { ActionCreators } from 'redux-undo';

type Props = {};

export function RedoButton(props: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
        dispatch(ActionCreators.redo());
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [dispatch]);

  return (
    <div>
      <button onClick={() => dispatch(ActionCreators.redo())}>Redo</button>
    </div>
  );
}
