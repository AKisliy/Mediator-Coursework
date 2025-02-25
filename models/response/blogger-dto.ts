export type BloggerResponseDTO = {
  id?: string;
  metadata: {
    image_link?: string;
    pic_url?: string;
    channel_picture?: string;
    followers_count?: number;
    description?: string;
    channel_description?: string;
    account_description?: string;
    username?: string;
    category?: string;
    social_media?: string;
  };
};
