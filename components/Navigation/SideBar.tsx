import {useState, useEffect} from 'react';
import ROUTING_LIST from '../../router/List';
import SearchWidget from '../widget/Search';
import {NavigationItem} from './Item';
import {useAppSelector} from '@store/index';
import Image from 'next/image';

function deepFilter(nodes, cb) {
  return nodes
    .map(node => {
      if (cb(node)) return node;
      let children = deepFilter(node.child || [], cb);
      console.log(node)
      return children.length && {...node, child: children};
    })
    .filter(Boolean);
}

export const SideBar = () => {
  const [iconCollapse, setIconCollapse] = useState(false);

  const {search, value} = useAppSelector(state => state.search);
  const [list, setList] = useState(ROUTING_LIST);

  useEffect(() => {
    if (search) {
      const result = deepFilter(ROUTING_LIST, node =>
        node.name.toLowerCase().includes(value.searchAll.toLowerCase()),
      );
      setList(result)
      return
    }

    setList(ROUTING_LIST)
  }, [search, value.searchAll]);

  return (
    <div
      className={`float-left justify-between full-height ${
        iconCollapse ? 'w-[57px]' : 'w-[314px]'
      } flex flex-col bg-side_bar overflow-y-auto overflow-x-hidden relative transition-all`}>
      <div className="overflow-y-auto pb-10 overflow-x-hidden">
        {iconCollapse ? (
          <div>
            <NavigationItem icon="/icons/magnify.svg" collapse={iconCollapse} />
            <div className="border-b border-b-[#dddddd]" />
          </div>
        ) : (
          <div>
            <SearchWidget />
          </div>
        )}
        <div onClick={() => setIconCollapse(prev => !prev)}>
          <div className="flex items-center px-5 py-2 gap-x-4 hover:bg-gray-200 relative transition-all cursor-pointer">
            <Image
              src={
                iconCollapse
                ? '/icons/chevron-double-right.svg'
                : '/icons/chevron-double-left.svg'
              }
              width={14.4}
              height={22}
              alt="icon" />
            {
              !iconCollapse && <p className="text-[14.5px] w-[200px]">Collapse</p>
            }
          </div>
        </div>
        {list.map(router => (
          <NavigationItem
            name={router.name}
            icon={router.icon}
            child={router.child}
            link={router.link}
            collapse={iconCollapse}
            setCollapse={setIconCollapse}
            key={router.name}
          />
        ))}
      </div>
      <div
        className={`min-h-[35px] ${
          iconCollapse ? 'hidden' : 'w-[314px]'
        } flex items-center justify-center text-xs text-[#a3a3a3] bg-side_bar`}>
        <div>&copy; PT Geodwipa Teknika Nusantara</div>
      </div>
    </div>
  );
};
