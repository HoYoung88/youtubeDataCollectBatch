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
      const channel = await this.analyticsApis.asyncChannel(pDate);
      const channelTrafficSource = await this.analyticsApis.asyncTrafficSource(
        pDate
      );
      const channelAgeGroup = await this.analyticsApis.asyncAgeGroup(pDate);
      const channelGender = await this.analyticsApis.asyncGender(pDate);

      await this.repositorys.channel.save(channel);
      await this.repositorys.channelTrafficSource.save(channelTrafficSource);
      await this.repositorys.channelAgeGroup.save(channelAgeGroup);
      await this.repositorys.channelGender.save(channelGender);

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async asyncAddVideoAnalitcs(date: Moment, videoIds: string[]): Promise<void> {
    try {
      const pDate = date.format('YYYY-MM-DD');
      const video = await this.analyticsApis.asyncVideo(pDate, videoIds);
      const videoTrafficSource = await this.analyticsApis.asyncVideoTrafficSource(
        pDate,
        videoIds
      );
      const videoAgeGroup = await this.analyticsApis.asyncVideoAgeGroup(
        pDate,
        videoIds
      );
      const videoGender = await this.analyticsApis.asyncVideoGender(
        pDate,
        videoIds
      );

      await this.repositorys.video.save(video);
      await this.repositorys.videoTrafficSource.save(videoTrafficSource);
      await this.repositorys.videoAgeGroup.save(videoAgeGroup);
      await this.repositorys.videoGender.save(videoGender);

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
