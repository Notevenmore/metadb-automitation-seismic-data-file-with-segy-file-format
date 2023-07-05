import {twMerge} from 'tailwind-merge';
import {Divider} from '../Divider';

export const HeaderTable = ({children}) => {
  return (
    <section
      className="border border-solid
        border-float_dialog rounded-md lg:pl-4 px-2">
      <section
        className="font-bold py-2 bg-black/[.16]
             lg:pl-4 pl-2 -mr-2 lg:-ml-4 -ml-2 rounded-t">
        Header
      </section>
      <HeaderDivider />
      {children}
    </section>
  );
};

export const HeaderDivider = ({additional_styles = ''}) => {
  return (
    <Divider
      additional_styles={twMerge(
        '-ml-2 w-[calc(100%+16px)] lg:-ml-4 lg:w-[calc(100%+25px)]',
        additional_styles,
      )}
    />
  );
};

const HeaderRow = ({children, ...props}) => {
  return (
    <div
      className="flex justify-center lg:items-center
         lg:flex-row flex-col w-full py-[10px] lg:h-[55px]"
      {...props}>
      {children}
    </div>
  );
};

const HeaderLabel = ({label1, label2}) => {
  return (
    <div
      className={
        'flex flex-wrap space-x-2 lg:min-w-[325px] mb-[7px] lg:my-[5px]'
      }>
      {label2 ? (
        <>
          <label>{label1}</label>
          <label className="text-[#A3A3A3]">{label2}</label>
        </>
      ) : (
        <label className="font-semibold">{label1}</label>
      )}
    </div>
  );
};

export const HeaderStatic = ({label1, label2, content = ''}) => {
  return (
    <HeaderRow>
      {label2 ? (
        <p className="font-semibold lg:min-w-[325px] max-lg:mb-2">
          {label1}
          <span className="font-light text-[#A3A3A3]"> {label2}</span>
        </p>
      ) : (
        <p className="font-semibold min-w-[325px]">{label1}</p>
      )}
      <p className="inline lg:ml-2 w-full">{content}</p>
    </HeaderRow>
  );
};

export const HeaderInput = ({label1, label2 = '', children}) => {
  return (
    <HeaderRow>
      <HeaderLabel label1={label1} label2={label2} />
      {children}
    </HeaderRow>
  );
};

export const ButtonsSection = ({children, className = ''}) => {
  return (
    <section
      className={twMerge(
        `flex flex-wrap gap-x-3 mt-10
            max-lg:justify-center items-center gap-y-3 max-lg:mt-5 h-5`,
        className,
      )}>
      {children}
    </section>
  );
};
