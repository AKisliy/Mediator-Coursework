import { Blogger } from '@/types/blogger';
import { isInstBlogger, isTelegramBlogger } from '@/types/type-guards';
import { Blogger as PrismaBlogger } from '@prisma/client';
import { BloggerResponseDTO } from '../response/blogger-dto';

export const FIELD_MAPPINGS = {
  blogger: {
    image_link: 'image_link',
    pic_url: 'image_link',
    channel_picture: 'image_link',
    followers_count: 'followers_count',
    description: 'description',
    channel_description: 'description',
    account_description: 'description',
    id: 'id',
    username: 'username',
    category: 'category',
    social_media: 'social_media'
  }
} as const;

export type FieldMappings = typeof FIELD_MAPPINGS;
export type EntityType = keyof FieldMappings;

type MappedType<T extends EntityType> = T extends 'blogger' ? Blogger : never;

export function transformResponse<T extends EntityType>(
  data: unknown,
  entityType: T
): MappedType<T>[] {
  if (!Array.isArray(data)) throw new Error('Expected data to be array');

  const mappings = FIELD_MAPPINGS[entityType];

  return data.map(item => transformObject(item, mappings)) as MappedType<T>[];
}

export function transformRecommendations(
  recommendationsFromServer: BloggerResponseDTO[]
): Blogger[] {
  const bloggers = transformResponse(recommendationsFromServer, 'blogger');
  bloggers.forEach(blogger => {
    if (isTelegramBlogger(blogger))
      blogger.profile_link = `https://t.me/${blogger.username}`;
    else if (isInstBlogger(blogger))
      blogger.profile_link = `https://instagram.com/${blogger.username}`;
  });
  return bloggers;
}

export function transformBloggersFromDb(bloggersFromDb: PrismaBlogger[]) {
  const bloggers = transformResponse(bloggersFromDb, 'blogger');
  bloggers.forEach(blogger => {
    if (isTelegramBlogger(blogger))
      blogger.profile_link = `https://t.me/${blogger.username}`;
    else if (isInstBlogger(blogger))
      blogger.profile_link = `https://instagram.com/${blogger.username}`;
  });
  return bloggers;
}

function transformObject<T extends object>(
  obj: T,
  mappings: Record<string, string>
): object {
  const transformed: Record<string, unknown> = {};

  // Обрабатываем верхний уровень
  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'metadata' && value && typeof value === 'object') {
      // Если это metadata, "поднимаем" его поля на верхний уровень
      Object.entries(value).forEach(([metaKey, metaValue]) => {
        const newKey = mappings[metaKey] || metaKey;
        transformed[newKey] = transformValue(metaValue, mappings);
      });
    } else {
      const newKey = mappings[key] || key;
      transformed[newKey] = transformValue(value, mappings);
    }
  });

  return transformed;
}

function transformValue(
  value: unknown,
  mappings: Record<string, string>
): unknown {
  if (Array.isArray(value)) {
    return value.map(item => transformValue(item, mappings));
  }

  if (value && typeof value === 'object') {
    return transformObject(value as object, mappings);
  }

  return value;
}
