import React from 'react';
import { AssetParamValueItem, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import { LoadingOverlay } from '@uniformdev/design-system';
import { AssetLibrary } from '../../components/AssetLibrary';
import { Asset, SettingsValue } from '../../types/types';
import { v4 } from 'uuid';

const AssetLibraryParameter = () => {
  const { setValue, metadata } = useMeshLocation('assetParameter');

  const metadataSettings = metadata.settings;

  if (!metadataSettings) {
    return <LoadingOverlay isActive />;
  }

  const mapToUniformAsset = (asset: Asset, sourceId: string): AssetParamValueItem => {
    return {
      // for now assets only support images
      type: 'image',
      _id: v4(),
      _source: sourceId,
      fields: {
        url: {
          type: 'text',
          value: asset.baseURL,
        },
        id: {
          type: 'text',
          value: asset.assetId,
        },
        title: {
          type: 'text',
          value: asset.filename,
        },
        description: asset.title
          ? {
              type: 'text',
              value: asset.title,
            }
          : undefined,
        width: {
          type: 'number',
          value: asset.imageWidth,
        },
        height: {
          type: 'number',
          value: asset.imageLength,
        },
        size: {
          type: 'number',
          value: asset.fileSize,
        },
      },
    };
  };

  return (
    <AssetLibrary
      settings={metadataSettings as SettingsValue}
      onSelectAsset={(asset: Asset) => {
        const uniformAsset = mapToUniformAsset(asset, metadata.sourceId);
        setValue(() => ({ newValue: [uniformAsset] }));
      }}
    />
  );
};

export default AssetLibraryParameter;
