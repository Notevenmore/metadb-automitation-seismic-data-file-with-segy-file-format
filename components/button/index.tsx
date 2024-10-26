import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import {twMerge} from 'tailwind-merge';

interface ButtonProps extends React.ComponentProps<'button'> {
  path?: string;
  title?: string;
  query?: string | ParsedUrlQueryInput;
  button_description?: string;
  additional_styles?: string;
  withPath?: boolean;
}

const Button: React.FunctionComponent<ButtonProps> = ({
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
      } w-fit select-none`}>
      <Link
        href={{
          pathname: buttonProps.disabled ? '' : path,
          query: query,
        }}>
        <button
          title={title ? title : button_description}
          className={twMerge(
            `flex items-center space-x-2 px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all`,
            additional_styles,
          )}
          {...buttonProps}>
          {children}
          {button_description}
        </button>
      </Link>
    </div>
  ) : (
    <div
      className={`${
        buttonProps.disabled ? 'pointer-events-none text-black/[.5]' : ''
      } w-fit select-none`}>
      <button
        title={title ? title : button_description}
        className={twMerge(
          `flex items-center space-x-2 px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all`,
          additional_styles,
        )}
        {...buttonProps}>
        {children}
        {button_description}
      </button>
    </div>
  );
};

export default Button;
