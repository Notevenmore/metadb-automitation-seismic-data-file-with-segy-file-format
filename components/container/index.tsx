import Image from 'next/image';
import {useRouter} from 'next/router';
import {twMerge} from 'tailwind-merge';

export default function Container({
  children,
  additional_class = '',
  ...divProps
}) {
  return (
    <div
      className={twMerge('w-full flex flex-col p-10', additional_class)}
      {...divProps}>
      {children}
    </div>
  );
}

Container.Title = ({children, back = false}) => {
  return (
    <div className="flex flex-row items-center text-4xl mb-10 gap-x-5 w-full">
      {back && <BackButton />}
      <div className="font-bold flex-1">{children}</div>
    </div>
  );
};

function BackButton() {
  const router = useRouter();
  return (
    <div
      className="hover:bg-black/[0.15] rounded w-[50px] h-[50px] flex justify-center items-center"
      onClick={() => router.back()}>
      <Image
        src="/icons/chevron-left.svg"
        alt="back icon"
        width={35}
        height={35}
      />
    </div>
  );
}

Container.Subtitle = ({children, additional_class = '', tab = false}) => {
  return (
    <div
      className={`text-xs -mt-10 lg:text-base mb-10 ${additional_class}`}
      style={{marginLeft: tab && '73.5px'}}>
      {children}
    </div>
  );
};
