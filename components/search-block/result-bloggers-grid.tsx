'use client';

import React from 'react';

import { useBloggersQuery } from '@/context/bloggers-query-provider';

import BloggersGrid from '../bloggers-grid/bloggers-grid';
import ActionsToolBar from './toolbar/actions-tool-bar';

export default function ResultBloggerGrid() {
  const { bloggers } = useBloggersQuery();
  return (
    <>
      {bloggers?.length > 0 && (
        <BloggersGrid
          bloggers={bloggers}
          upperChild={<ActionsToolBar includeFeedback />}
        />
      )}
    </>
  );
}
