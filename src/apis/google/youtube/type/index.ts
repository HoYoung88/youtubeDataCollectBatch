import {
  youtube_v3 as youtubeV3,
  youtubeAnalytics_v2 as youtubeAnalyticsV2,
  google,
} from 'googleapis';

export type ChannelListResponse = youtubeV3.Schema$ChannelListResponse;
export type PlaylistListResponse = youtubeV3.Schema$PlaylistListResponse;
export type PlaylistItemListResponse = youtubeV3.Schema$PlaylistItemListResponse;
export type VideoListResponse = youtubeV3.Schema$VideoListResponse;

export type ChannelListParams = youtubeV3.Params$Resource$Channels$List;
export type PlaylistListParams = youtubeV3.Params$Resource$Playlists$List;
export type PlaylistItemListParams = youtubeV3.Params$Resource$Playlistitems$List;
export type VideoListParams = youtubeV3.Params$Resource$Videos$List;

export type Channel = youtubeV3.Schema$Channel;
export type Playlist = youtubeV3.Schema$Playlist;
export type PlaylistItem = youtubeV3.Schema$PlaylistItem;
export type Video = youtubeV3.Schema$Video;
export type CommentThread = youtubeV3.Schema$CommentThread;
export type Comment = youtubeV3.Schema$Comment;

export type Thumbnails = {
  [key in 'default' | 'medium' | 'high' | 'standard' | 'maxres']: {
    url: string;
    width: number;
    height: number;
  };
};

export type ReportsQueryParams = youtubeAnalyticsV2.Params$Resource$Reports$Query;
export type QueryResponse = youtubeAnalyticsV2.Schema$QueryResponse;
export interface Credentials {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
}

type AnalyticsParams = { toDate: string; videoId?: string };
