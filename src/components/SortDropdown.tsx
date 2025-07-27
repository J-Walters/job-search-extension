import {
  ListFilter,
  Sparkles,
  ArrowDownAZ,
  ArrowUpAZ,
  Clock,
} from 'lucide-react';
import { useState, useRef, useEffect, type JSX } from 'react';

import type { SortOption } from '../types';

type SortDropdownProps = {
  sortOption: SortOption;
  onChange: (value: SortOption) => void;
};

const getSortIcon = (option: SortOption) => {
  switch (option) {
    case 'newest':
      return <Sparkles size={16} />;
    case 'az':
      return <ArrowDownAZ size={16} />;
    case 'za':
      return <ArrowUpAZ size={16} />;
    case 'oldest':
      return <Clock size={16} />;
    default:
      return <ListFilter size={16} />;
  }
};

export default function SortDropdown({
  sortOption,
  onChange,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { value: SortOption; label: string; icon: JSX.Element }[] = [
    { value: 'newest', label: 'Newest', icon: <Sparkles size={14} /> },
    { value: 'az', label: 'A–Z', icon: <ArrowDownAZ size={14} /> },
    { value: 'za', label: 'Z–A', icon: <ArrowUpAZ size={14} /> },
    { value: 'oldest', label: 'Oldest', icon: <Clock size={14} /> },
  ];

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        title='Filter Searches'
        onClick={() => setOpen((prev) => !prev)}
        className='h-9 w-9 flex items-center justify-center text-[#9d86f5] border border-gray-300 bg-white rounded-xl hover:ring-1 hover:ring-[#9d86f5] transition'
      >
        {getSortIcon(sortOption)}
      </button>
      {open && (
        <ul className='absolute right-0 z-10 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow text-xs'>
          {options.map(({ value, label, icon }) => (
            <li
              key={value}
              onClick={() => {
                onChange(value);
                setOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                sortOption === value ? 'font-medium text-[#9d86f5]' : ''
              }`}
            >
              {icon}
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
