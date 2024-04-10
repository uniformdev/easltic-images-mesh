import { SelectHTMLAttributes } from 'react';

export type SettingsValue = {
  endpoint: string;
  apiKey: string;
  imgBaseUrl: string;
};

export type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  showLabel?: boolean;
  defaultOption?: string;
  options: Array<number>;
};

export type AssetListOptions = {
  take: number;
  skip: number;
  searchTerm?: string;
  orderBy: 'asc' | 'desc';
};

export type Asset = {
  assetId: string;
  filename: string;
  baseURL: string;
  title: string;
  imageWidth: string;
  imageLength: string;
  fileSize: string;
};

export type AssetResponse = {
  assets: Asset[];
  isLoading: boolean;
  totalCount: number;
};
