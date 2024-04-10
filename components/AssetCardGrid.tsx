import { Skeleton } from '@uniformdev/design-system';
import React, { PropsWithChildren, ReactNode } from 'react';

import * as styles from './AssetGrid.styles';

export interface AssetGridProps {
  /**
   * The number of items to show per row
   * @default 3
   */
  itemsPerRow?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyState?: ReactNode;
}
export const AssetCardGrid = ({
  isLoading,
  itemsPerRow = 3,
  isEmpty,
  emptyState,
  children,
  ...other
}: PropsWithChildren<AssetGridProps & React.HTMLAttributes<HTMLDivElement>>) => {
  return !isLoading && isEmpty ? (
    emptyState
  ) : (
    <div
      css={styles.wrapper}
      style={{ gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))` }}
      {...other}
    >
      {isLoading
        ? Array.from({ length: itemsPerRow * 2 }).map((_, i) => (
            <Skeleton key={i} css={{ aspectRatio: '4/3' }} height="unset" width="unset" />
          ))
        : children}
    </div>
  );
};
