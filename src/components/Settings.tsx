import { useState, useEffect } from 'react';

import type { SavedSearch } from '../types';
import updateReminderSettings from '../utils/updateReminderSetting';

type SettingsProps = {
  searches: SavedSearch[];
  setSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
};

function Settings({ searches, setSearches }: SettingsProps) {
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(false);
  const [reminderFrequency, setReminderFrequency] = useState<string>('');

  useEffect(() => {
    chrome.storage.local.get('settings', (result) => {
      const reminder = result.settings?.reminderSettings;
      if (reminder) {
        setRemindersEnabled(reminder.enabled ?? false);
        setReminderFrequency(String(reminder.frequency ?? '60'));
      }
    });
  }, []);

  const handleToggle = (newValue: boolean) => {
    updateReminderSettings({ enabled: newValue, frequency: reminderFrequency });
    setRemindersEnabled(newValue);
  };

  const handleFrequencyChange = (value: string) => {
    updateReminderSettings({ frequency: value, enabled: remindersEnabled });
    setReminderFrequency(value);
  };

  const handleClear = () => {
    chrome.storage.local.set({ searches: [] });
    setSearches([]);
  };

  const convertToCSV = (data: SavedSearch[]): string => {
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
  };

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
      <h2>Notifications</h2>
      <label
        htmlFor='reminders-toggle'
        className='text-sm font-medium text-gray-700'
      >
        Enable Reminders
      </label>
      <br />
      <input
        id='reminders-toggle'
        type='checkbox'
        checked={remindersEnabled}
        onChange={(e) => handleToggle(e.target.checked)}
        className="appearance-none w-10 h-5 bg-gray-300 rounded-full shadow-inner checked:bg-violet-500 transition relative before:content-[''] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-5"
      />
      <br />
      <label htmlFor='notifications'>Reminder Frequency</label>
      <select
        id='notifications'
        name='notifications'
        disabled={!remindersEnabled}
        value={reminderFrequency}
        className={`... ${
          !remindersEnabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          border: '2px solid #C97C4A',
          borderRadius: '12px',
          padding: '0 16px',
          height: '40px',
          fontSize: '14px',
          background: '#efd9b5',
          color: '#5d3520',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onChange={(e) => {
          handleFrequencyChange(e.target.value);
        }}
      >
        <option value=''>Select a Frequency</option>
        <option value='5'>Every 5 Minutes</option>
        {/* <option value='60'>Every Hour</option> */}
        {/* <option value='120'>Every 2 Hours</option>
        <option value='180'>Every 3 Hours</option>
        <option value='360'>Every 6 Hours</option>
        <option value='720'>Every 12 Hours</option>
        <option value='1440'>Daily</option>
        <option value='2880'>Every 2 Days</option> */}
      </select>

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
