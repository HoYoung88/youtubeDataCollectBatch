import { google } from 'googleapis';
import getProp from '../../../utils/getProp';
import moment from 'moment';
import part from './part';
import StandardParameters from './StandardParameters';
import {
  ChannelListResponse,
  Playlist,
  Thumbnails,
  PlaylistItem,
  Video,
} from './type';
import { ChannelEntity } from '../../../entity/data/Channel';
import { PlaylistEntity } from '../../../entity/data/Playlist';
import { PlaylistItemsEntity } from '../../../entity/data/PlaylistItem';
import { VideoEntity } from '../../../entity/data/Video';

const youtubeapis = google.youtube({
  version: 'v3',
  auth: 'AIzaSyChgn2k-8fbaBMd4jChNbXxUbrw894k2oI',
});

function AsyncYoutubeData<T = any>(
  name: string,
  params: StandardParameters
): Promise<T> {
  return Promise.resolve(getProp(youtubeapis, name).call(youtubeapis, params))
    .then((response) => {
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function AsyncLoopYoutubeData<T = any>(
  name: string,
  params: StandardParameters
): Promise<T[]> {
  let nextPageToken: string | undefined = '';
  const loopData: T[] = [];

  while (nextPageToken !== undefined) {
    const response: any = await AsyncYoutubeData(
      name,
      Object.assign(params, { pageToken: nextPageToken })
    ).catch((error: typeof Error) => {
      nextPageToken = undefined;
      return Promise.reject(error);
    });
    if (response) {
      if (response && response.items)
        response.items.forEach((item: T) => loopData.push(item));

      if (response.nextPageToken) {
        nextPageToken = response.nextPageToken;
      } else {
        nextPageToken = undefined;
      }
    }
  }

  return Promise.resolve(loopData);
}

export default class YoutubeDataApis {
  channelId: string;
  constructor(channelId: string) {
    this.channelId = channelId;
  }

  async asyncChannel(): Promise<ChannelEntity> {
    const channelEntity = new ChannelEntity();
    try {
      const { items } = await AsyncYoutubeData<ChannelListResponse>(
        'channels.list',
        {
          id: this.channelId,
          part: part.channel.join(','),
        }
      );

      if (items) {
        items.forEach(
          ({ id, snippet, statistics, contentDetails, brandingSettings }) => {
            channelEntity.id = id as string;
            if (snippet) {
              const { title, description, thumbnails, publishedAt } = snippet;
              channelEntity.title = title as string;
              channelEntity.description = description as string;
              channelEntity.thumbnails = thumbnails as any;
              channelEntity.publishedAt = moment(
                publishedAt as string
              ).toDate();
            }
            if (statistics) {
              const { viewCount, commentCount, subscriberCount } = statistics;
              channelEntity.viewCount = viewCount ? parseInt(viewCount) : 0;
              channelEntity.commentCount = commentCount
                ? parseInt(commentCount)
                : 0;
              channelEntity.subscriberCount = subscriberCount
                ? parseInt(subscriberCount)
                : 0;
            }
            if (contentDetails) {
              const { relatedPlaylists } = contentDetails;
              if (relatedPlaylists) {
                channelEntity.relatedPlaylistsId = relatedPlaylists.uploads as string;
              }
            }
            if (brandingSettings) {
              const { image } = brandingSettings;
              if (image && image.bannerImageUrl)
                channelEntity.banner = image.bannerImageUrl;
            }
          }
        );

        return channelEntity;
      } else {
        throw new Error('no item');
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async asyncPlaylists(): Promise<PlaylistEntity[]> {
    try {
      const playlists = await AsyncLoopYoutubeData<Playlist>('playlists.list', {
        channelId: this.channelId,
        part: part.playlist.join(','),
        maxResults: 50,
      });
      const entitys: PlaylistEntity[] = [];
      for await (const item of playlists) {
        const entity = new PlaylistEntity();
        const { id, snippet, contentDetails } = item as Playlist;
        entity.channelId = this.channelId;
        entity.playlistId = id as string;

        if (snippet) {
          const { title, description, thumbnails, publishedAt } = snippet;
          entity.title = title as string;
          entity.description = description as string;
          entity.thumbnails = thumbnails as Thumbnails;
          entity.publishedAt = moment(publishedAt as string).toDate();
        }

        if (contentDetails) {
          const { itemCount } = contentDetails;
          entity.itemCount = itemCount as number;
        }

        const playlistItem = await this.asyncPlaylistItem(entity.playlistId);
        entity.playlistItems = [...playlistItem];

        entitys.push(entity);
      }

      return entitys;
    } catch (e) {
      throw new Error(e);
    }
  }

  async asyncPlaylistItem(playlistId: string): Promise<PlaylistItemsEntity[]> {
    try {
      const playlistItems = await AsyncLoopYoutubeData<PlaylistItem>(
        'playlistItems.list',
        {
          playlistId,
          part: part.playlistItems.join(','),
          maxResults: 50,
        }
      );
      const entitys: PlaylistItemsEntity[] = [];
      playlistItems.forEach((item) => {
        const entity = new PlaylistItemsEntity();
        const { id, snippet } = item;

        entity.id = id as string;

        if (snippet) {
          const { thumbnails, position, publishedAt, resourceId } = snippet;
          entity.playlistId = playlistId as string;
          entity.thumbnails = thumbnails as Thumbnails;
          entity.position = position as number;
          entity.publishedAt = moment(publishedAt as string).toDate();
          if (resourceId) {
            entity.videoId = resourceId.videoId as string;
          }
          entitys.push(entity);
        }
      });
      return entitys;
    } catch (e) {
      console.log('========= playlistItem');
      throw new Error(e);
    }
  }

  async asyncVideos(videoIds: string | string[]): Promise<VideoEntity[]> {
    let id: string;
    if (typeof videoIds === 'string') {
      id = videoIds;
    } else {
      id = (videoIds as string[]).join(',');
    }

    try {
      const entitys: VideoEntity[] = [];
      const videos = await AsyncLoopYoutubeData<Video>('videos.list', {
        part: part.video.join(','),
        maxResults: 50,
        id: id,
      });

      videos.forEach((item) => {
        const entity = new VideoEntity();
        const { id, snippet, statistics, contentDetails } = item;
        entity.videoId = id as string;
        entity.channelId = this.channelId;
        if (snippet) {
          const { title, description, thumbnails, publishedAt } = snippet;
          entity.title = title as string;
          entity.description = description as string;
          entity.thumbnails = thumbnails as Thumbnails;
          entity.publishedAt = moment(publishedAt as string).toDate();
        }

        if (contentDetails) {
          const { duration } = contentDetails;
          entity.duration = duration as string;
        }

        if (statistics) {
          const {
            viewCount,
            likeCount,
            dislikeCount,
            favoriteCount,
            commentCount,
          } = statistics;
          entity.viewCount = parseInt(viewCount as string);
          entity.likeCount = parseInt(likeCount as string);
          entity.dislikeCount = parseInt(dislikeCount as string);
          entity.favoriteCount = parseInt(favoriteCount as string);
          entity.commentCount = parseInt(commentCount as string);
        }

        entitys.push(entity);
      });
      return entitys;
    } catch (e) {
      throw new Error(e);
    }
  }
}
