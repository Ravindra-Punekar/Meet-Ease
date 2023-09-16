import { useCallback, useEffect, useRef, useState } from "react";

export const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // mutable ref to store current callback

  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb; // store passed callback to ref

    // if cbRef.current is not null then call the function with the current state
    setState((prevState) =>
      // pass previous state to callback function
      typeof newState === "function" ? newState(prevState) : newState
    );
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, updateState];
};
