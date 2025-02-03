import { Blogger } from './blogger';
import { InstBlogger } from './inst-blogger';
import { TelegramBlogger } from './telegram-blogger';

export function getBloggerFromObject(blogerObject: any) {
  const blogger = blogerObject.metadata ?? {};
  if (!blogerObject) throw new Error('От сервера получен пустой ответ');
  if (blogger.social_media === 'Instagram')
    return new InstBlogger(blogerObject);
  if (blogger.social_media === 'Telegram')
    return new TelegramBlogger(blogerObject);
  return new Blogger(blogerObject);
}
