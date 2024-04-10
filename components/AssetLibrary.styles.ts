import { css } from '@emotion/react';

export const toolbar = css`
  padding-bottom: var(--spacing-base);
`;

export const pagination = css`
  padding: var(--spacing-sm) 0;
`;

export const confirm = css`
  display: flex;
  background-color: var(--gray-50);
  place-items: center;
`;

export const emptyState = css`
  padding: var(--spacing-md) 0;
`;

export const ResultPerPageWrapper = css`
  align-items: center;
  display: flex;
  gap: var(--spacing-sm);
`;

export const ResultPerPageFilter = css`
  --input-padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) var(--spacing-sm);
  border: 1px solid var(--gray-400);
  border-radius: var(--rounded-sm);
  background-color: var(--white);
  color: var(--brand-secondary-1);
  padding: var(--input-padding);
`;
