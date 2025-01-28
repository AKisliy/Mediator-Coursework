'use client';

import ErrorCard from '@/components/error-card';
import ActionsToolBar from '@/components/search-main-block/actions-tool-bar';
import SearchBar from '@/components/search-main-block/search-bar';
import SmallBloggerCard from '@/components/small-blogger-card';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { Blogger } from '@/models/blogger';

export default function BloggerSearch() {
  const { error, bloggers } = useBloggersQuery();

  return (
    <div className={`flex flex-col gap-20 max-w-5xl p-5`}>
      <div className="container mx-auto p-4 max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Кого вы ищете для сотрудничества?
        </h1>
        <p className="text-center mb-8 text-muted-foreground">
          Введите подробный запрос. Mediator будет опираться на него при поиске
          каналов.
        </p>

        <SearchBar />

        {error && <ErrorCard error={error} />}

        {bloggers?.length > 0 && (
          <>
            <ActionsToolBar />
            {bloggers.map(blogger => {
              const bloggerEntity = Blogger.getBloggerFromObject(blogger);
              return (
                <SmallBloggerCard
                  key={bloggerEntity.id}
                  blogger={bloggerEntity}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
