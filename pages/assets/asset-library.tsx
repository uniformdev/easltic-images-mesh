import React from 'react';
import { useMeshLocation } from '@uniformdev/mesh-sdk-react';
import { LoadingOverlay } from '@uniformdev/design-system';
import { AssetLibrary } from '../../components/AssetLibrary';
import { SettingsValue } from '../../types/types';

const AssetLibraryPage = () => {
  const { metadata } = useMeshLocation('assetLibrary');

  const metadataSettings = metadata.settings;

  if (!metadataSettings) {
    return <LoadingOverlay isActive />;
  }

  return <AssetLibrary settings={metadataSettings as SettingsValue} onSelectAsset={() => {}} />;
};

export default AssetLibraryPage;
