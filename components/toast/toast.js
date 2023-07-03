import {twMerge} from 'tailwind-merge';
import {useMeasure} from 'react-use';
import Buttons from '../buttons/buttons';

/*
setmessage is a usestate variable passed from parent with properties
as such:
{
    message: string
    color: string
    show: bool
}
you can pass the string to show up in the toast with the usestate
variable above. message.message in the variable above (passed as prop
from parent) will be ignored if children is specified.
*/
const Toast = ({message, setmessage, additional_styles = '', children}) => {
  const colors = {
    blue: 'rgb(59 130 246)',
    red: 'rgb(239 68 68)',
    yellow: 'rgb(234 179 8)',
  };

  const [ref, bounds] = useMeasure();

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

  const hide = async e => {
    if (e) {
      e.preventDefault();
    }
    setmessage({...message, show: false});
    await delay(300);
    setmessage({message: '', color: '', show: false});
  };

  return (
    <div
      ref={ref}
      className={twMerge(
        'flex items-center space-x-2 fixed left-[50%] translate-x-[-50%] text-white px-3 rounded-lg py-2 transition-all duration-[230ms]',
        additional_styles,
      )}
      style={{
        backgroundColor: colors[message.color],
        top: message.show ? '1.25rem' : `-${bounds.height + 100}px`,
      }}>
      <div>{children || message.message}</div>
      <Buttons additional_styles="px-1 py-1 text-black" onClick={hide}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Buttons>
    </div>
  );
};

export default Toast;
