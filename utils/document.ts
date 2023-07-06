import { Dispatch, SetStateAction } from 'react';

export const setValueForId = (setState: Dispatch<SetStateAction<any>>, pageNo: number, id: number, value: string) => {
  setState(state => {
    // creating a copy to prevent direct mutation that causes error in redux
    let final = {...state};
    const index = final[pageNo - 1].findIndex(pair => pair.id === id);
    const cpair = final[pageNo - 1].find(pair => pair.id === id);
    const newPair = {...cpair, value};
    final[pageNo - 1] = [
      ...final[pageNo - 1].slice(0, index),
      newPair,
      ...final[pageNo - 1].slice(index + 1),
    ];
    console.log(final);
    return {...final};
  });
};