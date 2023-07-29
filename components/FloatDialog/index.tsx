import Link from 'next/link';
import {useRouter} from 'next/router';
import {Key, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {Divider} from '../Divider';

interface ItemsContents {
  section_title: string;
  section_content: string;
  handleClick?: () => void;
  link?: string;
}

interface ItemsNotification {
  type: string;
  contents: ItemsContents[];
}

interface FloatDialogProps {
  children: JSX.Element;
  float_title?: string;
  items: ItemsNotification;
  onClick?: () => void;
  width?: string;
  className?: string;
}

export const FloatDialog = ({
  children,
  float_title,
  items = null,
  onClick = null,
  width = '340px',
  className,
}: FloatDialogProps) => {
  const [show, setShow] = useState(false);
  function toggleDialog() {
    setShow(prev => !prev);
  }

  return (
    <section className="relative">
      <section onClick={onClick ? onClick : toggleDialog}>{children}</section>
      <section
        className={twMerge(
          `${
            show ? 'opacity-100 visible' : '-translate-y-1 opacity-0 invisible'
          } bg-white absolute z-50
            border border-solid border-float_dialog rounded-10p
            h-fit transition-all shadow-lg drop-shadow`,
          className,
        )}
        style={{width: width}}>
        {float_title && (
          <>
            <h2 className="text-base font-bold my-20p px-3">{float_title}</h2>
            <Divider />
          </>
        )}
        {items.contents.map((content: any, index: Key) => (
          <FloatSection
            key={index}
            content={content}
            index={index}
            toggleDialog={toggleDialog}
          />
        ))}
      </section>
      {show && (
        <div
          className="fixed bg-transparent top-0 bottom-0 left-0 right-0 z-[49]"
          onClick={() => setShow(!show)}
        />
      )}
    </section>
  );
};

const FloatSection = ({content, index, toggleDialog}) => {
  const router = useRouter();
  return (
    <section>
      {index !== 0 && <Divider />}
      <Link href={`${content.link ? content.link : router.asPath}`}>
        <section
          className="my-3 px-3"
          onClick={e => {
            if (content.handleClick) content.handleClick(e);
            toggleDialog();
          }}>
          <h2 className="text-base font-semibold">{content.section_title}</h2>
          <p className="text-[13px] leading-[15px]">
            {content.section_content}
          </p>
        </section>
      </Link>
    </section>
  );
};
