import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Dispatch, SetStateAction, useState} from 'react';
import styles from '../../../styles/NavItem.module.css';

interface NavigationItemProps {
  icon: string;
  name?: string;
  child?: {
    name: string;
    link: string;
    icon: string;
  }[];
  link?: string;
  collapse: boolean;
  setCollapse?: Dispatch<SetStateAction<boolean>>;
}

export const NavigationItem = ({
  icon,
  name,
  child,
  link,
  collapse,
  setCollapse,
}: NavigationItemProps) => {
  const [toggleOpen, setToggleOpen] = useState(false);

  function toggle() {
    if (collapse) {
      setToggleOpen(true);
    } else {
      setToggleOpen(prevToggle => !prevToggle);
    }
  }

  return (
    <div className="text-[14.5px]">
      <div
        onClick={() => {
          toggle();
          try {
            setCollapse(false);
          } catch (error) {}
        }}>
        <Child icon={icon} name={name} link={link} collapse={collapse} />
      </div>
      {!collapse && child && toggleOpen && (
        <div className="ml-4">
          {child.map((item, index) => (
            <div key={item.name + index}>
              <Child
                icon={item.icon}
                name={item.name}
                link={item.link}
                collapse={collapse}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Child = ({icon, name, link = '', collapse}) => {
  const router = useRouter();
  return (
    <Link href={link || router.asPath} className={styles.navItem}>
      <div
        className={`flex justify-between items-center px-5 py-2 gap-x-4 hover:bg-gray-200 ${
          router.asPath.split('/').some(path => {
            return path === name?.toLowerCase().replace(/\s/g, '_');
          }) && 'bg-[#dae0e5]'
        } relative transition-all`}>
        <div className="flex gap-x-4">
          <Image src={icon} width={14.4} height={22} alt="icon" />
          {!collapse && <div className="w-[200px]">{name}</div>}
        </div>
        {!collapse && (
          <div className="absolute right-5">
            <Image
              src="/icons/chevron-right.svg"
              width={25}
              height={15}
              className={styles.navItemChevron}
              alt="icon"
            />
          </div>
        )}
      </div>
    </Link>
  );
};
