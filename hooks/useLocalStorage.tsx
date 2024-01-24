import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useLocalStorage(
  key: string,
  initialValue: string,
): [string, Dispatch<SetStateAction<string>>] {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  useEffect(() => {
    const fromLocal = () => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        const item = window.localStorage.getItem(key);
        return item ? item : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    };

    setStoredValue(fromLocal);
    setFirstLoadDone(true);
  }, [initialValue, key]);

  useEffect(() => {
    if (!firstLoadDone) {
      return;
    }

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, storedValue as string);
      }
    } catch (error) {
      console.log(error);
    }
  }, [storedValue, firstLoadDone, key]);

  return [storedValue, setStoredValue];
}
