import { Connection, Repository } from 'typeorm';
import arrayDivision from '../utils/arrayDivision';
import YoutubeDataApis from '../apis/google/youtube/YoutubeDataApis';
import { YoutubeCreators } from '../entity/YoutubeCreators';
import { ChannelEntity } from '../entity/data/Channel';
import { PlaylistEntity } from '../entity/data/Playlist';
import { PlaylistItemsEntity } from '../entity/data/PlaylistItem';
import { VideoEntity } from '../entity/data/Video';
import { Moment } from 'moment';

export class YoutubeDataService {
  private connection: Connection;
  private dataApis: YoutubeDataApis;
  private repositorys!: {
    channel: Repository<ChannelEntity>;
    playlist: Repository<PlaylistEntity>;
    playlistItem: Repository<PlaylistItemsEntity>;
    video: Repository<VideoEntity>;
  };

  constructor(connection: Connection, creator: YoutubeCreators) {
    this.connection = connection;
    this.setRepository();
    this.dataApis = new YoutubeDataApis(creator.channelId);
  }

  private setRepository(): void {
    this.repositorys = {
      channel: this.connection.getRepository(ChannelEntity),
      playlist: this.connection.getRepository(PlaylistEntity),
      playlistItem: this.connection.getRepository(PlaylistItemsEntity),
      video: this.connection.getRepository(VideoEntity),
    };
  }

  async asyncAddChannelData(): Promise<void> {
    try {
      const channelData = await this.dataApis.asyncChannel();
      await this.repositorys.channel.save(channelData);

      const playlistData = await this.dataApis.asyncPlaylists();
      await this.repositorys.playlist.save(playlistData);

      for await (const playlist of playlistData) {
        await this.repositorys.playlistItem.save(playlist.playlistItems);
      }

      const relatedPlaylists = await this.dataApis.asyncPlaylistItem(
        channelData.relatedPlaylistsId
      );

      const videoIds = arrayDivision(
        relatedPlaylists.map((item) => item.videoId),
        50
      );
      for (const videoId of videoIds) {
        const videos = await this.dataApis.asyncVideos(videoId);
        await this.repositorys.video.save(videos);
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async asyncGetVideos(date: Moment): Promise<VideoEntity[]> {
    return await this.connection
      .getRepository(VideoEntity)
      .createQueryBuilder('v')
      .select('videoId', 'videoId')
      .where(
        "v.publishedAt <= date_format(:publishedAt, '%Y-%m-%d 23:59:59')",
        { publishedAt: date.format('YYYY-MM-DD') }
      )
      .getRawMany();
  }
}
