type TimeFrameKey = 'r1800' | 'r3600' | 'r7200' | 'r86400';
type SortByKey = 'DD' | 'R'
type LinkedInSearchFields = Omit<LinkedInSearch, 'id' | 'url' | 'created_at'>;
type SavedSearch = LinkedInSearch | ManualSearch

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


type EditFields = {
  keywords: string;
  searchRadius?: number;
  time?: TimeFrameKey;
};

type FormInputs = Omit<ManualSearch, 'id'>;

interface Tags {
  id: string;
  company: string;
}

export type {
  SavedSearch,
  LinkedInSearch,
  LinkedInSearchFields,
  ManualSearch,
  TimeFrameKey,
  SortByKey,
  EditFields,
  FormInputs,
  Tags
};