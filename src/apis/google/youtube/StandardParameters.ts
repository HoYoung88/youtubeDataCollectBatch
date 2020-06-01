import type {
  ChannelListParams,
  PlaylistListParams,
  PlaylistItemListParams,
  VideoListParams,
} from './type';

export default interface StandardParameters
  extends ChannelListParams,
    PlaylistListParams,
    PlaylistItemListParams,
    VideoListParams {}
