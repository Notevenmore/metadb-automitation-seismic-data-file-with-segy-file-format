import {twMerge} from 'tailwind-merge';

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
