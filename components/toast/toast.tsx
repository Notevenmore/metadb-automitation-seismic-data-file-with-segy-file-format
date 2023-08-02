import {useMeasure} from 'react-use';
import {twMerge} from 'tailwind-merge';
import {useAppDispatch, useAppSelector} from '../../store';
import {displayErrorMessage} from '../../store/generalSlice';
import Button from '../button';

const Toast = ({additional_styles = ''}: {additional_styles?: string}) => {
  const colors = {
    blue: 'rgb(59 130 246)',
    red: 'rgb(239 68 68)',
    yellow: 'rgb(234 179 8)',
  };

  const [ref, bounds] = useMeasure();
  const dispatch = useAppDispatch();
  const errMsg = useAppSelector((state: any) => state.general.error);

  return (
    <div
      ref={ref}
      className={twMerge(
        `flex items-center space-x-2 fixed left-1/2
        -translate-x-1/2 text-white
        px-3 rounded-lg py-2 transition-all duration-230 z-[9999]`,
        additional_styles,
      )}
      style={{
        backgroundColor: colors[errMsg.color],
        top: errMsg.show ? '1.25rem' : `-${bounds.height + 100}px`,
      }}>
      <div>{errMsg.message}</div>
      <Button
        additional_styles="px-1 py-1 text-black"
        onClick={() => {
          dispatch(
            displayErrorMessage({
              message: errMsg.message,
              color: '',
              duration: 0,
            }),
          );
        }}>
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
      </Button>
    </div>
  );
};

export default Toast;
