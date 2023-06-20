import {Buttons_Sidebar} from '../components/buttons/buttons';
import Well_sample_core from '../public/icons/well_sample_core.svg';
import Info from '../public/icons/info.svg';
import Arrow from '../public/icons/arrow_notrail.svg';

const Sidebar = () => {
  return (
    <div className="flex flex-col bg-side_bar min-w-[300px] max-w-[300px] justify-between">
      <div className="overflow-y-auto px-3 py-2.5">
        <Buttons_Sidebar path="/" button_description="Home">
          <Info className="w-4" />
        </Buttons_Sidebar>
        <Buttons_Sidebar path="/button" button_description="Buttons component">
          <Well_sample_core className="w-4" />
        </Buttons_Sidebar>
        <Buttons_Sidebar path="/table" button_description="Table component">
          <Well_sample_core className="w-4" />
        </Buttons_Sidebar>
        <Buttons_Sidebar path="/input" button_description="Input component">
          <Well_sample_core className="w-4" />
        </Buttons_Sidebar>
      </div>
      <div className="">
        <button className="flex items-center space-x-2 hover:bg-gray-200 w-full px-6 py-3">
          <div className="flex -space-x-1.5">
            <Arrow className="w-3 rotate-180" />
            <Arrow className="w-3 rotate-180" />
          </div>
          <label>Collapse sidebar</label>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
