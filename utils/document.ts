import { Dispatch, SetStateAction } from 'react';

export const setValueForId = (setState: Dispatch<SetStateAction<any>>, pageNo: number, id: number, value: string) => {
  setState(state => {
    const index = state.findIndex(pair => pair.id === id);
    const cpair = state.find(pair => pair.id === id);
    const newPair = {...cpair, value};
    return [...state.slice(0, index), newPair, ...state.slice(index + 1)];
  });
};