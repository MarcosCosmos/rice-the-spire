import { useContext } from 'react';
import ZebarContext from '../../data/ZebarContext';
import { Workspace } from '../';

const GlazeWorkspace = ({ data, ...attrs }) => {
  const zebar = useContext(ZebarContext);
  const onClick = () => zebar.glazewm.runCommand(`focus --workspace ${data.name}`);

  return <Workspace className="glazewm-workspace" data={data} onClick={onClick} {...attrs} />;
};

export default GlazeWorkspace;
