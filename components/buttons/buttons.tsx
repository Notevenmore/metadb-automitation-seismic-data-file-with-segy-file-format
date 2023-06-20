import Link from 'next/link';
import {twMerge} from 'tailwind-merge';

interface ButtonProps extends React.ComponentProps<'button'> {
  path: '';
  title: '';
  query: '';
  button_description: '';
  additional_styles: '';
  withPath: '';
}

const Buttons: React.FunctionComponent<ButtonProps> = ({
  path,
  query,
  button_description,
  title,
  withPath,
  children = null,
  additional_styles = '',
  ...buttonProps
}) => {
  return withPath || path ? (
    <div
      className={`${
        buttonProps.disabled ? 'pointer-events-none text-black/[.5]' : ''
      } w-fit select-none`}
    >
      <Link
        href={{
          pathname: buttonProps.disabled ? '' : path,
          query: query,
        }}
      >
        <button
          title={title ? title : button_description}
          className={twMerge(
            `flex items-center space-x-2 px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all`,
            additional_styles,
          )}
          {...buttonProps}
        >
          {children ? <div>{children}</div> : null}
          {button_description ? <p>{button_description}</p> : null}
        </button>
      </Link>
    </div>
  ) : (
    <div
      className={`${
        buttonProps.disabled ? 'pointer-events-none text-black/[.5]' : ''
      } w-fit select-none`}
    >
      <button
        title={title ? title : button_description}
        className={twMerge(
          `flex items-center space-x-2 px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all`,
          additional_styles,
        )}
        {...buttonProps}
      >
        {children ? <div>{children}</div> : null}
        {button_description ? <p>{button_description}</p> : null}
      </button>
    </div>
  );
};

export default Buttons;
