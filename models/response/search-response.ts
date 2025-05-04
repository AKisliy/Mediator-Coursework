import { Blogger } from '@/types/blogger';
import { BloggerResponseDTO } from './blogger-dto';

export type SearchResponseDTO = {
  recommendations: BloggerResponseDTO[];
  uuid: string;
};

export type SearchResponse = {
  recommendations: Blogger[];
  uuid: string;
};
