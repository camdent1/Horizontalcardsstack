import React from "react";

// Merge multiple refs together
export function useMergedRefs(...refs) {
  // We have to memoize the function we return, because React calls a the old
  // function ref with null when you pass a new one.
  return React.useCallback((value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null) {
        ref.current = value;
      }
    });
  }, refs);
}
