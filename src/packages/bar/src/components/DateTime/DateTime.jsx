import { useContext } from 'react';
import ZebarContext from '../../data/ZebarContext';
import { MenuItem } from '../';
import { Status } from '../';
import { OutlinedText } from '../';
import { Bar } from '../';

const shortDateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
});
const shortTimeFormat = new Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
});
const longFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'long',
  timeStyle: 'long',
});

const DateTime = () => {
  const zebar = useContext(ZebarContext);
  const date = zebar?.date || { now: Date.now() };
  const label = 'Date and time';

  return (
    <Bar>
      <MenuItem
        className="datetime"
        aria-label={`${label}`}
        disabled
        tooltip={`${label}: ${longFormat.format(date.now)}`}
      >
        <Status className="date" path="ui/top_bar/timer_icon" />
        <OutlinedText>
          {shortDateFormat.format(date.now)} {shortTimeFormat.format(date.now)}
        </OutlinedText>
      </MenuItem>
    </Bar>
  );
};

export default DateTime;
