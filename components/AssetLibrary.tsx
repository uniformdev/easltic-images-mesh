import { css } from '@emotion/react';
import {
  Button,
  DashedBox,
  HorizontalRhythm,
  InputKeywordSearch,
  Pagination,
  Paragraph,
  VerticalRhythm,
  MediaCard,
  ImageBroken,
  Image,
} from '@uniformdev/design-system';
import { useState } from 'react';
import * as styles from './AssetLibrary.styles';
import { AssetCardGrid } from './AssetCardGrid';
import { Asset, AssetListOptions, FilterSelectProps, SettingsValue } from '../types/types';
import { useAsync } from 'react-use';

const DEFAULT_PAGE_LIMIT = 24;
const CountOptions: Array<number> = [12, 20, 50, 100];

export function AssetLibrary({
  settings,
  onSelectAsset,
}: {
  settings: SettingsValue;
  onSelectAsset?(asset: Asset): void;
}) {
  const [query, setQuery] = useState<AssetListOptions>({
    searchTerm: '',
    orderBy: 'desc',
    skip: 0,
    take: DEFAULT_PAGE_LIMIT,
  });

  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState<number>(0);

  const updateData = async ({ query }: { query: AssetListOptions }) => {
    const body = {
      url: settings.endpoint,
      token: settings.apiKey,
      method: 'POST',
      data: {
        from: query.skip,
        size: query.take,
        query: {
          bool: {
            must: [
              {
                exists: {
                  field: 'baseURL',
                },
              },
            ],
            filter: [
              {
                bool: {
                  should: [
                    {
                      term: {
                        mimeType: 'image/jpeg',
                      },
                    },
                    {
                      term: {
                        mimeType: 'image/bmp',
                      },
                    },
                    {
                      term: {
                        mimeType: 'image/x-png',
                      },
                    },
                    {
                      term: {
                        mimeType: 'image/png',
                      },
                    },
                    {
                      term: {
                        mimeType: 'image/gif',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        _source: [
          'assetId',
          'filename',
          'mimeType',
          'title',
          'baseURL',
          'imageWidth',
          'imageLength',
          'fileSize',
        ],
        sort: {
          created: query.orderBy,
        },
      } as any,
    };
    if (query.searchTerm) {
      body.data.query.bool.must.push({
        match_bool_prefix: {
          title: {
            query: query.searchTerm,
          },
        },
      });
    }
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    const total = Number(data.hits.total.value);
    const formatted = data.hits.hits.map((item: any) => {
      return {
        assetId: item._source.assetId,
        filename: item._source.filename,
        baseURL: settings.imgBaseUrl + item._source.baseURL,
        title: item._source.title,
        imageWidth: item._source.imageWidth,
        imageLength: item._source.imageLength,
        fileSize: item._source.fileSize,
      } as Asset;
    });

    setTotal(total);
    setAssets(formatted);
  };

  const { loading: isLoading } = useAsync(async () => {
    await updateData({ query });
  }, [query]);

  const handleSetSearchTerm = (value: string) => {
    setQuery((prev) => {
      return {
        ...prev,
        searchTerm: value,
      };
    });
  };

  const onChangeFilter = (options: Pick<AssetListOptions, 'take' | 'skip'>) => {
    setQuery((prev) => {
      return {
        ...prev,
        skip: options.skip,
        take: options.take,
      };
    });
  };

  return (
    <VerticalRhythm css={styles.pagination}>
      <div>
        <InputKeywordSearch
          placeholder="Search..."
          onSearchTextChanged={(e) => handleSetSearchTerm(e)}
          value={query.searchTerm}
          compact
          rounded
        />
      </div>

      <div>
        {!assets.length && !isLoading ? (
          <DashedBox
            boxHeight="auto"
            css={css`
              margin-top: var(--spacing-base);
            `}
          >
            <Paragraph>
              No Assets matched your search
              {query.searchTerm ? (
                <>
                  {' '}
                  or filter criteria.{' '}
                  <Button buttonType="ghost" size="zero">
                    Reset view
                  </Button>
                </>
              ) : (
                '.'
              )}
            </Paragraph>
          </DashedBox>
        ) : (
          <div css={{ position: 'relative' }}>
            <AssetCardGrid itemsPerRow={4} isLoading={isLoading}>
              {assets.map((asset) => {
                return <AssetItem key={asset.assetId} asset={asset} onSelectAsset={onSelectAsset} />;
              })}
            </AssetCardGrid>
          </div>
        )}

        <HorizontalRhythm css={styles.pagination} justify="space-between">
          <ResultPerPageFilter
            label="Results per page"
            options={CountOptions}
            onChange={(e) => {
              onChangeFilter({ take: Number(e.currentTarget.value), skip: 0 });
            }}
            value={query?.take}
            data-testid="dropdown-result-per-page"
          />
          <Pagination
            limit={query.take}
            offset={query.skip}
            total={total ?? 0}
            onPageChange={(take, skip) => {
              onChangeFilter({ take, skip });
            }}
          />
        </HorizontalRhythm>
      </div>
    </VerticalRhythm>
  );
}

export const ResultPerPageFilter = ({
  label,
  showLabel = true,
  defaultOption,
  options,
  ...props
}: FilterSelectProps) => {
  return (
    <label css={styles.ResultPerPageWrapper}>
      {showLabel ? <span>{label}</span> : null}
      <select aria-label={!showLabel ? label : undefined} css={styles.ResultPerPageFilter} {...props}>
        {defaultOption ? <option value="">{defaultOption}</option> : null}
        {options.map((number, i) => (
          <option value={number.toString()} key={i}>
            {number.toString()}
          </option>
        ))}
      </select>
    </label>
  );
};

function AssetItem({ asset, onSelectAsset }: { asset: Asset; onSelectAsset?(asset: Asset): void }) {
  return (
    <MediaCard
      key={asset.assetId}
      title={asset.filename}
      cover={
        asset.baseURL ? (
          <Image
            variant="fill-container"
            alt={asset.filename}
            src={asset.baseURL}
            width={600}
            height={400}
            css={css`
              object-fit: scale-down;
            `}
          />
        ) : (
          <ImageBroken />
        )
      }
      onClick={() => {
        onSelectAsset?.(asset);
      }}
    />
  );
}
