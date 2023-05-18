import { useRef } from "react";

export const useRandomId = () => {
    return useRef(Math.floor((Math.random() * 100_000) + 1));
};
