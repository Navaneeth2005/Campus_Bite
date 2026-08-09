import { useEffect, useState } from 'react';

// Returns a value that only updates after `delay` ms of no changes.
// Used to debounce the menu search input so we don't hit the API on every keystroke.
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
