import {ReactNode, createContext, useState} from 'react';
import Popup from '@components/popup';

const PopupContext = createContext<any | null>(null);

function PopupProvider({children}: {children: ReactNode}) {
  const [togglePopup, setTogglePopup] = useState(false);

  const [popupProps, setPopupProps] = useState({
    message: '',
    clickOutside: true,
    onConfirm: () => {},
    title: '',
  });

  const openPopup = ({
    message = '',
    clickOutside = true,
    onConfirm = () => {},
    title = 'Confirm',
  }) => {
    setPopupProps({
      message: message,
      clickOutside: clickOutside,
      onConfirm: onConfirm,
      title: title,
    });
    setTogglePopup(true);
  };
  const closePopup = () => {
	setTogglePopup(false)
    setPopupProps({
      message: '',
      clickOutside: true,
      onConfirm: () => {},
      title: '',
    });
  };

  return (
    <PopupContext.Provider
      value={{
        openPopup,
        closePopup,
        popupProps,
      }}>
      {children}
      {togglePopup && <Popup />}
    </PopupContext.Provider>
  );
}

export {PopupContext, PopupProvider};
