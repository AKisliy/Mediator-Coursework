import saveAs from 'file-saver';
import Papa from 'papaparse';

import { CsvFieldsSchemaValues } from '@/schemas';
import { BLOGGER_FIELDS, Blogger } from '@/types/blogger';

export function exportBloggersToCSV(
  bloggers: Blogger[],
  downloadFields: CsvFieldsSchemaValues
) {
  if (!bloggers.length) return;

  const filteredBloggers = bloggers.filter(b =>
    downloadFields.social_media.includes(b.social_media)
  );

  const bloggersWithSelectedFields = filteredBloggers.map(blogger => {
    const result = {
      'Имя пользователя': blogger.username,
      Ссылка: blogger.profile_link
    };
    Object.entries(blogger).forEach(([key, value]) => {
      if (
        typeof (downloadFields as any)[key] === 'boolean' &&
        (downloadFields as any)[key]
      )
        (result as any)[(BLOGGER_FIELDS as any)[key]] = value;
    });
    return result;
  });

  const csv = Papa.unparse(bloggersWithSelectedFields);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'bloggers.csv');
}
