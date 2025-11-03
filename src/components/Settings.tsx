import { Download, CircleX } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';

import { useChromeStorage } from '../hooks/useChromeStorage';
import type { SavedSearch, Tags, ReminderSettings } from '../types';

type SettingsProps = {
  searches: SavedSearch[];
  setSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
};

function Settings({ searches, setSearches }: SettingsProps) {
  const [reminderSettings, setReminderSettings] =
    useChromeStorage<ReminderSettings>('reminderSettings', {
      enabled: false,
      frequency: 0,
    });

  const [companyTags, setCompanyTags] = useChromeStorage<Tags[]>(
    'companyTags',
    []
  );
  const [tagText, setTagText] = useState<string>('');
  const [tagError, setTagError] = useState<boolean>(false);

  console.log('companyTags', companyTags);

  const handleToggle = (enabled: boolean) => {
    setReminderSettings({ ...reminderSettings, enabled });
  };

  const handleFrequencyChange = (value: string) => {
    const frequency = parseInt(value, 10) || 0;
    setReminderSettings({ ...reminderSettings, frequency });
  };

  const handleClear = () => {
    setSearches([]);
  };

  const convertToCSV = (data: SavedSearch[]): string => {
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

    const newTag: Tags = {
      id: nanoid(),
      company: tagText,
    };

    const updatedTags = [newTag, ...companyTags];

    setCompanyTags(updatedTags);
    setTagText('');
    setTagError(false);
  };

  const handleDelete = (id: string) => {
    const updatedTags = companyTags.filter((tag) => tag.id !== id);
    setCompanyTags(updatedTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTags();
    }
  };

  return (
    <div className='flex flex-col h-full min-h-0'>
      <div className='flex-1 min-h-0 overflow-y-auto pr-1 hidden-scrollbar'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <h2 className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
              Company Filters
            </h2>
            {companyTags.length > 0 && (
              <span className='bg-[#9d86f5] text-white text-[11px] px-1.5 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center'>
                {companyTags.length}
              </span>
            )}
          </div>
          <span className='search-subtext'>
            Remove these companies from your search
          </span>
          <div className='relative max-w-full'>
            <div className='flex flex-nowrap gap-1 overflow-x-auto max-w-full pb-1 hide-scrollbar'>
              {companyTags.map((tag) => (
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
                className='edit-save-button shrink-0 h-7.5 rounded-xl'
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
                checked={reminderSettings.enabled}
                onChange={(e) => handleToggle(e.target.checked)}
                className='sr-only peer'
                aria-label='Enable job reminder notifications'
              />
              <div className='w-full h-full bg-gray-300 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#9d86f5] rounded-full peer peer-checked:bg-[#9d86f5] transition-colors duration-300' />
              <span className='absolute left-[1px] top-[0.5px] w-[14px] h-[14px] bg-white rounded-full transition-all duration-300 peer-checked:translate-x-[16px] shadow-sm' />
            </label>
          </div>
          <div className='space-y-1'>
            <label
              htmlFor='reminder-frequency'
              className='text-xs text-gray-700'
            >
              Reminder Frequency
            </label>
            <span className='search-subtext'>
              How often should we remind you to apply?
            </span>
            <select
              id='reminder-frequency'
              name='reminder-frequency'
              disabled={!reminderSettings.enabled}
              value={reminderSettings.frequency.toString()}
              onChange={(e) => handleFrequencyChange(e.target.value)}
              className={`search-input w-full max-w-full ${
                !reminderSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
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
    </div>
  );
}

export default Settings;
