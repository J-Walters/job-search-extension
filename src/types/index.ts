type TimeFrameKey = 'r1800' | 'r3600' | 'r7200' | 'r86400';
type SortByKey = 'DD' | 'R'
type LinkedInSearchFields = Omit<LinkedInSearch, 'id' | 'url' | 'created_at'>;
type SavedSearch = LinkedInSearch | ManualSearch
type SortOption = 'newest' | 'oldest' | 'az' | 'za';
type FormInputs = Omit<ManualSearch, 'id'>;

interface LinkedInSearch {
  id: string;
  url: string;
  keywords: string;
  created_at: string;
  searchRadius: number;
  time: TimeFrameKey;
  sortBy: SortByKey;
}

interface ManualSearch {
  id: string;
  url: string;
  keywords: string;
  created_at: string;
}


interface EditFields {
  keywords: string;
  searchRadius?: number;
  time?: TimeFrameKey;
};

interface Tags {
  id: string;
  company: string;
}

interface ReminderSettings {
  enabled: boolean;
  frequency: number;
};



export type {
  SavedSearch,
  LinkedInSearch,
  LinkedInSearchFields,
  ManualSearch,
  TimeFrameKey,
  SortByKey,
  EditFields,
  FormInputs,
  Tags,
  SortOption,
  ReminderSettings
};