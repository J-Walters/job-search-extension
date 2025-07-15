import { useState } from 'react';

import type { SavedSearch } from '../types';

type SettingsProps = {
  searches: SavedSearch[];
  setSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
};

function Settings({ searches, setSearches }: SettingsProps) {
  const handleClear = () => {
    chrome.storage.local.set({ searches: [] });
    setSearches([]);
  };

  function convertToCSV(data: SavedSearch[]): string {
    console.log('data', data);
    if (!data.length) return '';

    const keys = Object.keys(data[0]) as (keyof SavedSearch)[];
    const header = keys.join(',');

    const rows = data.map((row) =>
      keys
        .map((key) => {
          const cell = row[key] ?? '';
          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    );

    return [header, ...rows].join('\n');
  }

  const handleExport = () => {
    const csvData = convertToCSV(searches);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'Job_Search_Data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <h2 className=''>Searches</h2>
      <button
        type='button'
        onClick={handleClear}
        disabled={!searches.length}
        className='button-primary disabled:opacity-50'
      >
        Delete All Searches
      </button>
      <br />
      <br />
      <button
        type='button'
        onClick={handleExport}
        disabled={!searches.length}
        className='button-primary disabled:opacity-50'
      >
        Export All Searches
      </button>
    </>
  );
}

export default Settings;
