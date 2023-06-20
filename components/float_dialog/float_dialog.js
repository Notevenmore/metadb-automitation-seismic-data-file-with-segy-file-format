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

const FloatDialog = ({
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
  // const isNotification = items.type == "notification"
  // const isProfile = items.type == "profile"
  // console.log(float_title)
  return (
    <section className="relative">
      <section onClick={onClick ? onClick : toggleDialog}>{children}</section>
      {show && (
        <section
          className={twMerge(
            `bg-white absolute z-[50]  
            border-[1px] border-solid border-float_dialog rounded-[10px]
            h-fit`,
            className,
          )}
          style={{width: width}}
        >
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
            // if(items.type == "notification"){
            //     return(
            //         <FloatSection section_title={content.section_title}
            //         section_content={content.section_content}/>
            //     )
            // }
            // else if(items.type == "profile"){
            //     return(

            //     )
            // }
          ))}
        </section>
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
          }}
        >
          <h2 className="text-[16px] font-semibold">{content.section_title}</h2>
          <p className="text-[13px] leading-[15px]">
            {content.section_content}
          </p>
        </section>
      </Link>
    </section>
  );
};

const IconSection = ({children}) => {
  return (
    <section className="flex flex-row justify-end w-[340px] cursor-pointer">
      <>{children}</>
    </section>
  );
};

const FloatDialogNotification = () => {
  return (
    <FloatDialog float_title="notification" items={items_notification}>
      <IconSection>
        <NotificationIcon />
      </IconSection>
    </FloatDialog>
  );
};

const FloatDialogProfile = () => {
  return (
    <FloatDialog float_title="Profile" items={items_notification}>
      <IconSection>
        <ProfileIcon />
      </IconSection>
    </FloatDialog>
  );
};

const NotificationIcon = () => {
  return (
    <img
      src="/icons/bell-outline.svg"
      alt="notif"
      className="w-[19px] h-[24px]"
    ></img>
  );
};

const ProfileIcon = () => {
  return (
    <img
      src="/images/unknown.jpg"
      alt="profile"
      className="w-[26px] rounded-full"
    ></img>
  );
};

const FloatDialogProfile2 = () => {
  return (
    <section className="p-[19px] border-2 border-solid border-float_dialog rounded-[10px] w-[263px] h-[201px] text-[16px]">
      <ProfileIcon />
      <section className="flex flex-col justify-between h-[59px] mb-[17px]">
        <h2 className="leading-[15px] font-bold">Profile Name</h2>
        <h2 className="leading-[15px] font-regular">emailaddress@email.com</h2>
        <h2 className="leading-[15px] font-medium">Occupation</h2>
      </section>
      <ProfileDivider></ProfileDivider>
      <h2 className="leading-[15px] font-medium my-[17px]">Account settings</h2>
      <ProfileDivider></ProfileDivider>
      <h2 className="leading-[15px] font-medium my-[17px]">Sign out</h2>
    </section>
  );
};

const Divider = ({additional_styles = null}) => {
  return (
    <hr
      className={twMerge(
        `border-1 border-solid border-float_section_divider`,
        additional_styles,
      )}
    ></hr>
  );
};

const NotificationDivider = () => {
  return <Divider additional_styles={'-ml-[26px] w-[340px]'}></Divider>;
};

const ProfileDivider = () => {
  return <Divider additional_styles={'-ml-[19px] w-[263px]'}></Divider>;
};

export default FloatDialog;
export {
  FloatDialogNotification,
  FloatDialogProfile,
  Divider,
  IconSection,
  NotificationIcon,
  ProfileIcon,
};
