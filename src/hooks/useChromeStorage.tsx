import { useEffect, useRef, useState } from 'react';

export function useChromeStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const hasLoaded = useRef(false);

  useEffect(() => {
    chrome.storage.sync.get([key], (result) => {
      if (result[key] !== undefined) {
        setValue(result[key] as T);
      }
      hasLoaded.current = true;
    });
  }, [key]);

  useEffect(() => {
    if (!hasLoaded.current) return;

    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        console.warn(
          `Failed to save "${key}" to storage:`,
          chrome.runtime.lastError
        );
      }
    });
  }, [key, value]);

  useEffect(() => {
    const handleChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: 'sync' | 'local' | 'managed' | 'session'
    ) => {
      if (areaName === 'sync' && changes[key]) {
        setValue(changes[key].newValue as T);
      }
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, [key]);

  return [value, setValue] as const;
}
