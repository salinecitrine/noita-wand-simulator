import { useAppDispatch } from '../hooks';
import { setSpells, setWand } from '../redux/wandSlice';
import { defaultWand } from '../redux/presets';

type Props = {};

export function ResetButton(props: Props) {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setWand(defaultWand));
    dispatch(setSpells([]));
  };
  return (
    <div>
      <button onClick={handleClick}>Reset</button>
    </div>
  );
}
