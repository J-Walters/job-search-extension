export interface FormFields {
  keywords: string;
  searchRadius: number;
  time: string;
  sortBy: string;
}

export interface SavedSearch extends FormFields {
  id: string;
}