import Item from './navigation_item/Item';
import List from '../../router/List';
import {useState} from 'react';
import SearchWidget from '../widget/Search';

export default function SideBar({half}) {
  const [iconCollapse, setIconCollapse] = useState(false);
  return (
    <div
      // className={`float-left ${half ? "h-full" : "h-screen"} ${iconCollapse ? "w-auto" : ""} flex flex-col pt-2 pb-10 w-[314px] bg-side_bar overflow-y-auto relative`}
      className={`float-left justify-between full-height ${
        iconCollapse ? 'w-[57px]' : 'w-[314px]'
      } flex flex-col bg-side_bar overflow-y-auto overflow-x-hidden relative transition-all`}
      // style={{ width: iconCollapse ? "auto" : "" }}>
    >
      <div className="overflow-y-auto pb-10 overflow-x-hidden">
        {iconCollapse ? (
          <div>
            <Item icon="/icons/magnify.svg" collapse={iconCollapse} />
            <div className="border-b border-b-[#dddddd]"></div>
          </div>
        ) : (
          <div>
            <SearchWidget />
          </div>
        )}
        <div onClick={() => setIconCollapse(prev => !prev)}>
          <Item
            name="Collapse"
            icon={
              iconCollapse
                ? '/icons/chevron-double-right.svg'
                : '/icons/chevron-double-left.svg'
            }
            collapse={iconCollapse}></Item>
        </div>
        {List.map(router => (
          <Item
            name={router.name}
            icon={router.icon}
            child={router.child}
            link={router.link}
            collapse={iconCollapse}
            setCollapse={setIconCollapse}
            key={router.name}></Item>
        ))}
      </div>
      <div
        className={`min-h-[35px] ${
          iconCollapse ? 'hidden' : 'w-[314px]'
        } flex items-center justify-center text-[12px] text-[#a3a3a3] bg-side_bar`}>
        <div>&copy; PT Geodwipa Teknika Nusantara</div>
      </div>
    </div>
  );
}
