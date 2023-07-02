import {useEffect, useRef, useState} from 'react';

export const useRandomId = () => {
  return useRef(Math.floor(Math.random() * 100_000 + 1));
};

export const useScrollOffset = () => {
  const [scrollOffset, setScrollOffset] = useState([0, 0]);

  function onScroll(_: Event) {
    const parent = document.getElementById('layout-icon');

    setScrollOffset(_ => [parent.scrollLeft, parent.scrollTop]);
  }

  useEffect(() => {
    const parent = document.getElementById('layout-icon');

    parent.addEventListener('scroll', onScroll);
    setScrollOffset(_ => [parent.scrollLeft, parent.scrollTop]);

    return () => {
      parent.removeEventListener('scroll', onScroll);
    };
  }, []);

  return scrollOffset;
};
