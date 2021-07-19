import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectPresets } from '../../redux/presetsSlice';
import { Preset } from '../../types';
import { setSpells, setWand } from '../../redux/wandSlice';
import React, { useCallback, useState } from 'react';
import { WandPresetMenu } from './WandPresetMenu';
import { Modal } from '../generic/modal/Modal';

type Props = {};

export function WandPresetSelector(props: Props) {
  const { presets } = useAppSelector(selectPresets);
  const dispatch = useAppDispatch();

  const [menuVisible, setMenuVisible] = useState(false);

  const handleSelect = useCallback(
    (preset: Preset) => {
      setMenuVisible(false);
      dispatch(setWand(preset.wand));
      dispatch(setSpells(preset.spells));
    },
    [dispatch]
  );

  const handleClose = () => {
    setMenuVisible(false);
  };

  return (
    <div>
      <button onClick={() => setMenuVisible(!menuVisible)}>Presets</button>
      <Modal visible={menuVisible} onClose={handleClose}>
        <WandPresetMenu
          presets={presets}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      </Modal>
    </div>
  );
}
