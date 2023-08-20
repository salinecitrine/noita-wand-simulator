import { useAppDispatch } from '../../redux/hooks';
import { useEffect } from 'react';
import { Button } from '../generic';

type Props = {};

export function ExportButton(props: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === 'e'
      ) {
        console.log('todo:exportAction');
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [dispatch]);

  return (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={() => console.log('todo:exportAction')}
    >
      Export
    </Button>
  );
}
