import { useEffect, useState } from 'react';

type SettingsProps = {
  setSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
};

function Settings({ setSearches }: SettingsProps) {
  const handleClear = () => {
    chrome.storage.local.set({ searches: [] });
    setSearches([]);
  };

  return (
    <>
      <h2 className=''>Searches</h2>
      <button type='button' onClick={handleClear} className='button-primary'>
        Delete All Searches
      </button>
    </>
  );
}

export default Settings;
