import {useState, useEffect} from 'react';
import ROUTING_LIST from '../../router/List';
import SearchWidget from '../widget/Search';
import {NavigationItem} from './Item';
import {useAppSelector} from '@store/index';

export const SideBar = () => {
  const [iconCollapse, setIconCollapse] = useState(false);

  const {search, value} = useAppSelector(state => state.search);
  const [list, setList] = useState(ROUTING_LIST);

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
          <NavigationItem
            name="Collapse"
            icon={
              iconCollapse
                ? '/icons/chevron-double-right.svg'
                : '/icons/chevron-double-left.svg'
            }
            collapse={iconCollapse}
          />
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
