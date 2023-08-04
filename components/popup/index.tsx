import {useContext} from 'react';
import {PopupContext} from '@contexts/PopupContext';
import Button from '@components/button';
import CloseThin from '../../public/icons/close-thin.svg';

const Popup = () => {
  let {closePopup, popupProps} = useContext(PopupContext);
  let {title, message, onConfirm, togglePopup} = popupProps;

  const confirm = () => {
    onConfirm();
    closePopup();
  };
  return (
    <div className={`${togglePopup ? 'opacity-100 visible' : 'opacity-0 invisible'} fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black/[.2] transition-all`} onClick={closePopup}>
      <div className={`${togglePopup ? '' : '-translate-y-5 opacity-0'} relative h-auto min-h-[170px] w-500p bg-white border-gray-300 border-2 rounded-md px-6 py-5 transition-all`} onClick={(e) => e.stopPropagation()}>
        <div className="font-bold text-lg">{title}</div>
        <div className="border-b border-b-gray-300" />
        <div className="mt-3 w-full text-center">{message}</div>
        <div className="flex items-center justify-center gap-x-3 mt-3">
          <Button button_description="Cancel" onClick={closePopup} />
          <Button
            button_description="Confirm"
            onClick={confirm}
            additional_styles="bg-searchbg/[.6] hover:bg-searchbg"
          />
          <Button
              additional_styles="absolute top-2 right-2 px-1 py-1 text-black"
              title="Close"
              onClick={closePopup}>
              <CloseThin className="w-5 h-5" />
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
