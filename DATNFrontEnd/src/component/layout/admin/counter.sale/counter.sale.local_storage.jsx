import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const storedValue = localStorage.getItem(key);
  const [value, setValue] = useState(
    storedValue ? JSON.parse(storedValue) : initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
