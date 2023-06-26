import {twMerge} from 'tailwind-merge';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

const items_notification = {
  type: 'notification',
  contents: [
    {section_title: 'hello', section_content: 'hello there'},
    {section_title: 'abc', section_content: 'def'},
    {section_title: 'fgh', section_content: 'ijk'},
    {section_title: 'trololol', section_content: 'trollge'},
  ],
};

export const FloatDialog = ({
  children,
  float_title,
  items = null,
  onClick = null,
  width = '340px',
  className,
}) => {
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
          } bg-white absolute z-[50]
            border-[1px] border-solid border-float_dialog rounded-[10px]
            h-fit transition-all shadow-lg drop-shadow`,
          className,
        )}
        style={{width: width}}>
        {float_title && (
          <>
            <h2 className="text-[16px] font-bold my-[20px] px-[12px]">
              {float_title ? float_title : ''}
            </h2>
            <Divider />
          </>
        )}
        {items.contents.map((content, index) => (
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
          onClick={_ => setShow(!show)}
        />
      )}
    </section>
  );
};

const FloatSection = ({content, index, toggleDialog}) => {
  const router = useRouter();
  return (
    <section>
      {index !== 0 && <Divider></Divider>}
      <Link href={`${content.link ? content.link : router.asPath}`}>
        <section
          className="my-[12px] px-[12px]"
          onClick={e => {
            if (content.handleClick) content.handleClick(e);
            toggleDialog();
          }}>
          <h2 className="text-[16px] font-semibold">{content.section_title}</h2>
          <p className="text-[13px] leading-[15px]">
            {content.section_content}
          </p>
        </section>
      </Link>
    </section>
  );
};

export const IconSection = ({children}) => {
  return (
    <section className="flex flex-row justify-end w-[340px] cursor-pointer">
      <>{children}</>
    </section>
  );
};

export const FloatDialogNotification = () => {
  return (
    <FloatDialog float_title="notification" items={items_notification}>
      <IconSection>
        <NotificationIcon />
      </IconSection>
    </FloatDialog>
  );
};

export const FloatDialogProfile = () => {
  return (
    <FloatDialog float_title="Profile" items={items_notification}>
      <IconSection>
        <ProfileIcon />
      </IconSection>
    </FloatDialog>
  );
};

export const NotificationIcon = () => {
  return (
    <img
      src="/icons/bell-outline.svg"
      alt="notif"
      className="w-[19px] h-[24px]"
    />
  );
};

export const ProfileIcon = () => {
  return (
    <img
      src="/images/unknown.jpg"
      alt="profile"
      className="w-[26px] rounded-full"
    />
  );
};

export const Divider = ({additional_styles = null}) => {
  return (
    <hr
      className={twMerge(
        `border-1 border-solid border-float_section_divider`,
        additional_styles,
      )}
    />
  );
};
