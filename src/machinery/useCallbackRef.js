import React from "react";

export function useCallbackRef(callback) {
  const ref = React.useRef(null);
  ref.current = callback;
  return ref;
}
