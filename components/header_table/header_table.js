import {Divider} from '../float_dialog/float_dialog';
import {twMerge} from 'tailwind-merge';

const HeaderTable = ({children}) => {
  return (
    <section
      className="border border-solid 
        border-float_dialog rounded-md lg:pl-4 px-2"
    >
      <section
        className="font-bold py-2 bg-black/[.16]
             lg:pl-4 pl-2 -mr-2 lg:-ml-4 -ml-2 rounded-t"
      >
        Header
      </section>
      <HeaderDivider />
      <>{children}</>
    </section>
  );
};

const HeaderDivider = () => {
  return (
    <Divider
      additional_styles={`-ml-2 w-[calc(100%+16px)]
             lg:-ml-4 lg:w-[calc(100%+25px)]`}
    />
  );
};

const HeaderRow = ({children, ...props}) => {
  return (
    <div
      className="flex justify-center lg:items-center
         lg:flex-row flex-col w-full py-[10px] lg:h-[55px]"
      {...props}
    >
      <>{children}</>
    </div>
  );
};

const HeaderLabel = ({label1, label2}) => {
  return (
    <div
      className={
        'flex flex-wrap space-x-2 lg:min-w-[325px] mb-[7px] lg:my-[5px]'
      }
    >
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

const HeaderStatic = ({label1, label2, content = false}) => {
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
      <p className="inline lg:ml-[8px] w-full">{content}</p>
    </HeaderRow>
  );
};

const HeaderInput = ({label1, label2 = false, children}) => {
  return (
    <HeaderRow>
      <HeaderLabel label1={label1} label2={label2} />
      <>{children}</>
    </HeaderRow>
  );
};

const ButtonsSection = ({children, className = ''}) => {
  return (
    <section
      className={twMerge(
        `flex flex-wrap gap-x-3 mt-10
            max-lg:justify-center items-center gap-y-3 max-lg:mt-5 h-5`,
        className,
      )}
    >
      <>{children}</>
    </section>
  );
};

export default HeaderTable;
export {
  HeaderDivider,
  HeaderRow,
  HeaderLabel,
  HeaderStatic,
  HeaderInput,
  ButtonsSection,
};
