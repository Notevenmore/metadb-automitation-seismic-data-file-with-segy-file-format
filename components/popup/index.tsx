import {useContext} from 'react';
import {PopupContext} from '@contexts/PopupContext';
import Button from '@components/button';

const Popup = () => {
  let {closePopup, popupProps} = useContext(PopupContext);
  let {title, message, onConfirm} = popupProps;

  const confirm = () => {
    onConfirm();
    closePopup();
  };
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black/[.2]" onClick={closePopup}>
      <div className="h-auto min-h-[170px] w-500p bg-white border-gray-300 border-2 rounded-md px-6 py-5" onClick={(e) => e.stopPropagation()}>
        <div className="font-bold text-lg">{title}</div>
        <div className="border-b border-b-gray-300" />
        <div className="mt-3 w-full text-center">{message}</div>
        <div className="flex items-center justify-center gap-x-3 mt-3">
          <Button button_description="Cancel" onClick={closePopup} />
          <Button
            button_description="Confirm"
            onClick={confirm}
            additional_styles="bg-primary/[.8] hover:bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Popup;
