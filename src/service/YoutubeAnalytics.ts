import { Connection, Repository } from 'typeorm';
import { Moment } from 'moment';
import YoutubeAnalyticsApis from '../apis/google/youtube/analytics/YoutubeAnalyticsApis';
import { YoutubeCreators } from '../entity/YoutubeCreators';
import { ChannelStat } from '../entity/analytics/channel/ChannelStat';
import { ChannelTrafficSourceStat } from '../entity/analytics/channel/ChannelTrafficSourceStat';
import { ChannelAgeGroupStat } from '../entity/analytics/channel/ChannelAgeGroupStat';
import { ChannelGenderStat } from '../entity/analytics/channel/ChannelGenderStat';
import { VideoStat } from '../entity/analytics/video/VideoStat';
import { VideoTrafficSourceStat } from '../entity/analytics/video/VideoTrafficSourceStat';
import { VideoAgeGroupStat } from '../entity/analytics/video/VideoAgeGroupStat';
import { VideoGenderStat } from '../entity/analytics/video/VideoGenderStat';

export class YoutubeAnalyticsService {
  private connection: Connection;
  private analyticsApis: YoutubeAnalyticsApis;
  private repositorys!: {
    channel: Repository<ChannelStat>;
    channelTrafficSource: Repository<ChannelTrafficSourceStat>;
    channelAgeGroup: Repository<ChannelAgeGroupStat>;
    channelGender: Repository<ChannelGenderStat>;
    video: Repository<VideoStat>;
    videoTrafficSource: Repository<VideoTrafficSourceStat>;
    videoAgeGroup: Repository<VideoAgeGroupStat>;
    videoGender: Repository<VideoGenderStat>;
  };

  constructor(connection: Connection, creator: YoutubeCreators) {
    this.connection = connection;
    this.setRepository();

    this.analyticsApis = new YoutubeAnalyticsApis(creator.channelId, {
      access_token: creator.accessToken,
      refresh_token: creator.refreshToken,
      expiry_date: parseInt(creator.expiryDate),
      token_type: creator.tokenType,
    });
  }

  private setRepository(): void {
    this.repositorys = {
      channel: this.connection.getRepository(ChannelStat),
      channelTrafficSource: this.connection.getRepository(
        ChannelTrafficSourceStat
      ),
      channelAgeGroup: this.connection.getRepository(ChannelAgeGroupStat),
      channelGender: this.connection.getRepository(ChannelGenderStat),
      video: this.connection.getRepository(VideoStat),
      videoTrafficSource: this.connection.getRepository(VideoTrafficSourceStat),
      videoAgeGroup: this.connection.getRepository(VideoAgeGroupStat),
      videoGender: this.connection.getRepository(VideoGenderStat),
    };
  }

  async asyncAddChannelAnalyitcs(date: Moment): Promise<void> {
    try {
      const pDate = date.format('YYYY-MM-DD');
      this.repositorys.channel.save(
        await this.analyticsApis.asyncChannel(pDate)
      );

      this.repositorys.channelTrafficSource.save(
        await this.analyticsApis.asyncTrafficSource(pDate)
      );

      this.repositorys.channelAgeGroup.save(
        await this.analyticsApis.asyncAgeGroup(pDate)
      );

      this.repositorys.channelGender.save(
        await this.analyticsApis.asyncGender(pDate)
      );
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async asyncAddVideoAnalitcs(date: Moment, videoIds: string[]): Promise<void> {
    try {
      const pDate = date.format('YYYY-MM-DD');
      this.repositorys.video.save(
        await this.analyticsApis.asyncVideo(pDate, videoIds)
      );

      this.repositorys.videoTrafficSource.save(
        await this.analyticsApis.asyncVideoTrafficSource(pDate, videoIds)
      );

      this.repositorys.videoAgeGroup.save(
        await this.analyticsApis.asyncVideoAgeGroup(pDate, videoIds)
      );

      this.repositorys.videoGender.save(
        await this.analyticsApis.asyncVideoGender(pDate, videoIds)
      );
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
