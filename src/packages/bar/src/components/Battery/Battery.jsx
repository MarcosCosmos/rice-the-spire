import { useContext } from 'react';
import ZebarContext from '../../data/ZebarContext';
import { MenuItem } from '../';
import { Status } from '../';

const Battery = () => {
  const zebar = useContext(ZebarContext);
  const data = zebar?.battery || {
    state: 'unknown',
    chargePercent: 0,
  };

  if (data.state !== 'unknown') {
    const value = Math.round(data.chargePercent);
    return (
      <MenuItem
        className={`battery battery--${data.state}`}
        disabled
        aria-label="Battery"
        tooltip={`Battery: ${value}% (${data.state})`}
      >
        <Status path="relics/power_cell">{value}%</Status>
      </MenuItem>
    );
  }

  return null;
};

export default Battery;
