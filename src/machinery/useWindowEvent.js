import React from "react";
import { useCallbackRef } from "./useCallbackRef";

// Stores the handler in a callback, so it doesn't trigger effect re-installs
export function useWindowEvent(event, handler) {
  const callbackRef = useCallbackRef(handler);

  React.useEffect(() => {
    window.addEventListener(event, handler);
    return () => {
      window.removeEventListener(event, handler);
    };

    function handler(e) {
      callbackRef.current(e);
    }
  }, [event, callbackRef]);
}
