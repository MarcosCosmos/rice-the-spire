import { useContext } from 'react';
import ZebarContext from '../../data/ZebarContext';
import MenuItem from '../MenuItem/MenuItem';
import Status from '../Status/Status';

const Memory = () => {
  const zebar = useContext(ZebarContext);
  const memory = zebar?.memory;
  const usage = Math.round(memory?.usage || 0);
  const tooltip = memory && `Memory usage: ${(memory.usedMemory * 1e-9).toFixed(2)}GB/${(memory.totalMemory * 1e-9).toFixed(2)}GB (${(memory.freeMemory * 1e-9).toFixed(2)}GB free)`;

  return (
    <MenuItem className="memory" aria-label="Memory" tooltip={tooltip} disabled>
      <Status path="relics/emotion_chip">{usage}%</Status>
    </MenuItem>
  );
};

export default Memory;
