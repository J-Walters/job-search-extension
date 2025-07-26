import { Download, CircleX } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

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
  const [tagError, setTagError] = useState<boolean>(false);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTags();
    }
  };

  return (
    <div className='max-h-[400px] overflow-y-auto pr-1 hidden-scrollbar overflow-visible'>
      <div>
        <h2 className='text-xs font-semibold text-gray-500 tracking-wide uppercase mb-2'>
          Theme
        </h2>
        <select
          id='theme'
          name='theme'
          className='search-input w-full max-w-full'
          // value={theme}
          // onChange={handleThemeChange}
        >
          <option value=''>Select a Theme</option>
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
          <option value='system'>System</option>
        </select>
      </div>
      <hr className='my-5 border-t border-[#ece9fd]' />
      <div>
        <h2 className='text-xs font-semibold text-gray-500 tracking-wide uppercase mb-1'>
          Company Filters
        </h2>
        <span className='search-subtext'>
          Exclude these companies from you search
        </span>
        <div className='relative max-w-full'>
          <div className='flex flex-nowrap gap-1 overflow-x-auto max-w-full pb-1 hide-scrollbar'>
            {tags.map((tag) => (
              <span
                key={tag.id}
                className='flex items-center h-7 px-3 rounded-full bg-white text-xs border border-[#9d86f5] text-[#9d86f5] whitespace-nowrap transition hover:bg-violet-50'
              >
                <span>{tag.company}</span>
                <button
                  type='button'
                  className='ml-2 text-gray-400 hover:text-red-400 text-xs leading-none shrink-0'
                  aria-label={`Remove ${tag.company}`}
                  onClick={() => handleDelete(tag.id)}
                  style={{ lineHeight: '1', height: '1.2em' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className='flex items-center gap-1 mt-1 max-w-full'>
            <input
              id='tag-input'
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              className='search-input w-full max-w-full'
              placeholder='Add company name…'
            />
            {tagError && (
              <p className='form-error'>Cannot submit an empty string</p>
            )}
            <button
              type='submit'
              onClick={handleAddTags}
              className='edit-save-button shrink-0'
              style={{ minWidth: 52 }}
            >
              Block
            </button>
          </div>
        </div>
      </div>
      <hr className='my-5 border-t border-[#ece9fd]' />
      <div>
        <div className='flex items-center justify-between mt-6 mb-2'>
          <h2 className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
            Notifications
          </h2>
          <label className='relative inline-flex items-center w-8 h-4 cursor-pointer group'>
            <input
              id='reminders-toggle'
              type='checkbox'
              checked={remindersEnabled}
              onChange={(e) => handleToggle(e.target.checked)}
              className='sr-only peer'
              aria-label='Enable job reminder notifications'
            />
            <div className='w-full h-full bg-gray-300 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#9d86f5] rounded-full peer peer-checked:bg-[#9d86f5] transition-colors duration-300' />
            <span className='absolute left-[1px] top-[0.5px] w-[14px] h-[14px] bg-white rounded-full transition-all duration-300 peer-checked:translate-x-[16px] shadow-sm' />
          </label>
        </div>
        <div className='space-y-1'>
          <label htmlFor='reminder-frequency' className='text-xs text-gray-700'>
            Reminder Frequency
          </label>
          <span className='search-subtext'>
            How often should we remind you to apply?
          </span>
          <select
            id='reminder-frequency'
            name='reminder-frequency'
            disabled={!remindersEnabled}
            value={reminderFrequency}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            className={`search-input w-full max-w-full ${
              !remindersEnabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value=''>Select a Frequency</option>
            <option value='5'>Every 5 Minutes</option>
            <option value='30'>Every 30 Minutes</option>
            <option value='60'>Every Hour</option>
          </select>
        </div>
      </div>
      <hr className='my-5 border-t border-[#ece9fd]' />
      <div className='mt-8 space-y-2'>
        <h2 className='text-xs font-semibold text-gray-500 tracking-wide uppercase mb-2'>
          Searches
        </h2>
        <button
          type='button'
          onClick={handleExport}
          disabled={!searches.length}
          className='add-new-btn w-full max-w-full flex items-center gap-2 justify-center'
        >
          <Download size={14} />
          Export Searches
        </button>
        <button
          type='button'
          onClick={handleClear}
          disabled={!searches.length}
          className='delete-btn w-full max-w-full flex items-center gap-2 justify-center'
        >
          <CircleX size={14} />
          Delete Searches
        </button>
      </div>
    </div>
  );
}

export default Settings;
