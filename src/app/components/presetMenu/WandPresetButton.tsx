import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectPresets } from '../../redux/presetsSlice';
import { Preset } from '../../types';
import { setSpells, setWand } from '../../redux/wandSlice';
import React, { useCallback, useState } from 'react';
import { WandPresetMenu } from './WandPresetMenu';
import { Modal } from '../generic/modal/Modal';

type Props = {};

export function WandPresetButton(props: Props) {
  const { presets } = useAppSelector(selectPresets);
  const dispatch = useAppDispatch();

  const [menuVisible, setMenuVisible] = useState(false);

  const handleSelect = useCallback(
    (preset: Preset) => {
      setMenuVisible(false);
      dispatch(setWand({ wand: preset.wand, spells: preset.spells }));
    },
    [dispatch]
  );

  const handleClose = () => {
    setMenuVisible(false);
  };

  return (
    <div>
      <button onClick={() => setMenuVisible(!menuVisible)}>Presets</button>
      <Modal visible={menuVisible} onClose={handleClose} title="Presets">
        <WandPresetMenu presets={presets} onSelect={handleSelect} />
      </Modal>
    </div>
  );
}
