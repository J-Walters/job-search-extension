import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';

import type { SavedSearch, Tags } from '../types';
import { updateReminderSettings } from '../utils';

type SettingsProps = {
  searches: SavedSearch[];
  setSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
};

function Settings({ searches, setSearches }: SettingsProps) {
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(false);
  const [reminderFrequency, setReminderFrequency] = useState<string>('');
  const [tags, setTags] = useState<Tags[]>([]);
  const [tagText, setTagText] = useState<string>('');
  const [tagError, setTagError] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('settings', (result) => {
      const reminder = result.settings?.reminderSettings;
      if (reminder) {
        setRemindersEnabled(reminder.enabled ?? false);
        setReminderFrequency(String(reminder.frequency ?? '60'));
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['companyTags'], (result) => {
      const existingTags = result.companyTags ? result.companyTags : [];
      setTags([...existingTags]);
    });
  }, []);

  chrome.storage.local.get(console.log);

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

  const handleAddTags = () => {
    if (tagText.trim() === '') {
      setTagError(true);
      return;
    }

    chrome.storage.local.get('companyTags', (result) => {
      const existingTags = result.companyTags ? result.companyTags : [];

      const newTag: Tags = {
        id: nanoid(),
        company: tagText,
      };

      const updatedTags = [newTag, ...existingTags];

      chrome.storage.local.set({ companyTags: updatedTags });
      setTags(updatedTags);
      setTagText('');
      setTagError(false);
    });
  };

  const handleDelete = (id: string) => {
    const updatedTags = tags.filter((tag) => tag.id !== id);
    setTags(updatedTags);
    chrome.storage.local.set({ companyTags: updatedTags });
  };

  return (
    <>
      <div className='space-y-2'>
        <h2 className='text-sm font-medium text-gray-700'>
          Filter Searches by Company
        </h2>
        <div className='flex flex-wrap gap-2 mt-2'>
          {tags.length > 0 &&
            tags.map((tag) => (
              <span
                key={tag.id}
                className='flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 text-amber-800 shadow-sm border border-amber-200'
              >
                {tag.company}
                <button
                  type='button'
                  className='cursor-pointer text-amber-500 hover:text-red-500 transition-colors font-bold'
                  aria-label={`Remove ${tag.company}`}
                  onClick={() => handleDelete(tag.id)}
                >
                  &times;
                </button>
              </span>
            ))}
        </div>
        <div className='mt-2'>
          <label htmlFor='tag-input' className='sr-only'>
            Add a company filter
          </label>
          <input
            id='tag-input'
            value={tagText}
            onChange={(e) => setTagText(e.target.value)}
            className='w-full px-3 py-1.5 text-sm border border-amber-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300'
            placeholder='Add company name...'
          />
          {tagError && (
            <p className='text-xs text-red-400 mt-1'>
              Cannot submit an empty string.
            </p>
          )}
        </div>
        <div>
          <button
            type='submit'
            onClick={handleAddTags}
            className='py-1.5 text-sm rounded-xl font-semibold text-white transition bg-gradient-to-b from-gray-300 to-gray-400 shadow-[4px_4px_8px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] active:shadow-inner mt-1 w-full'
          >
            Add Filter
          </button>
        </div>
      </div>

      <div className='space-y-3 mt-6'>
        <h2 className='text-sm font-medium text-gray-700'>Notifications</h2>

        <div className='flex items-center justify-between'>
          <label
            htmlFor='reminders-toggle'
            className='text-sm font-medium text-gray-700'
          >
            Enable Reminders
          </label>
          <input
            id='reminders-toggle'
            type='checkbox'
            checked={remindersEnabled}
            onChange={(e) => handleToggle(e.target.checked)}
            className="appearance-none w-10 h-5 bg-gradient-to-b from-gray-200 to-gray-100 rounded-full shadow-inner checked:bg-gradient-to-b checked:from-violet-400 checked:to-violet-500 transition relative before:content-[''] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-5"
          />
        </div>

        <div className='space-y-1'>
          <label
            htmlFor='notifications'
            className='text-sm font-medium text-gray-700'
          >
            Reminder Frequency
          </label>
          <select
            id='notifications'
            name='notifications'
            disabled={!remindersEnabled}
            value={reminderFrequency}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            className={`w-full mt-1 rounded-xl px-4 h-10 text-sm text-violet-800 bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-400 transition duration-200 ${
              !remindersEnabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value=''>Select a Frequency</option>
            <option value='5'>Every 5 Minutes</option>
          </select>
        </div>
      </div>

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
