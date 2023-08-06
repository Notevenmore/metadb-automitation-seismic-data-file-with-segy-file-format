import {ReactNode, createContext, useEffect, useState} from 'react';
import Popup from '@components/popup';
import {useRouter} from 'next/router';

const PopupContext = createContext<any | null>(null);

function PopupProvider({children}: {children: ReactNode}) {
  const [togglePopup, setTogglePopup] = useState(false);

  const [popupProps, setPopupProps] = useState({
    message: '',
    clickOutside: true,
    onConfirm: () => {},
    title: ''
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
      title: title
    });
    setTogglePopup(true);
  };
  const closePopup = () => {
    setTogglePopup(false);
    setPopupProps(prev => {return {
      ...prev, 
      clickOutside: true,
      onConfirm: () => {}
    }});
  };

  const router = useRouter();
  useEffect(() => {
    closePopup();
  }, [router]);

  return (
    <PopupContext.Provider
      value={{
        openPopup,
        closePopup,
        popupProps,
        togglePopup
      }}>
      {children}
      <Popup />
    </PopupContext.Provider>
  );
}

export {PopupContext, PopupProvider};
