import config from '../../../../config/config.json';
import { google, youtubeAnalytics_v2 } from 'googleapis';
import dimensions from './Dimensions';
import metrics from './Metrics';
import type { ReportsQueryParams, Credentials } from '../type';
import { ChannelStat } from '../../../../entity/analytics/channel/ChannelStat';
import { ChannelTrafficSourceStat } from '../../../../entity/analytics/channel/ChannelTrafficSourceStat';
import { ChannelAgeGroupStat } from '../../../../entity/analytics/channel/ChannelAgeGroupStat';
import { ChannelGenderStat } from '../../../../entity/analytics/channel/ChannelGenderStat';
import { VideoStat } from '../../../../entity/analytics/video/VideoStat';
import { VideoTrafficSourceStat } from '../../../../entity/analytics/video/VideoTrafficSourceStat';
import { VideoAgeGroupStat } from '../../../../entity/analytics/video/VideoAgeGroupStat';
import { VideoGenderStat } from '../../../../entity/analytics/video/VideoGenderStat';
import { YoutubeApisError } from '../error/YoutubeApisError';

const { client_secret, client_id, redirect_uris } = config.google.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const makingReportData = (
  youtubeAnalytics: youtubeAnalytics_v2.Youtubeanalytics,
  query: ReportsQueryParams
): Promise<{ [key: string]: any }[]> =>
  Promise.resolve(youtubeAnalytics.reports.query(query))
    .then(({ data }) => {
      const columnHeaders = data.columnHeaders;
      const rows = data.rows;
      const reportDatas: any[] = [];

      if (columnHeaders && rows) {
        rows.forEach((row) => {
          const rowReportData: { [key: string]: any } = {
            date: query.startDate,
          };

          row.forEach((item, index) => {
            const key = columnHeaders[index].name;
            if (key) rowReportData[key] = item;
          });

          reportDatas.push(rowReportData);
        });
      }

      return Promise.resolve(reportDatas);
    })
    .catch((error) => {
      return Promise.reject(error);
    });

export default class YoutubeAnalyticsApis {
  channelId: string;
  api: youtubeAnalytics_v2.Youtubeanalytics;
  constructor(channelId: string, credentials: Credentials) {
    oAuth2Client.setCredentials(credentials);
    this.channelId = channelId;
    this.api = google.youtubeAnalytics({
      version: 'v2',
      auth: oAuth2Client,
    });
  }

  async asyncChannel(toDate: string): Promise<ChannelStat> {
    try {
      const reports = await makingReportData(this.api, {
        startDate: toDate,
        endDate: toDate,
        ids: `channel==${this.channelId}`,
        dimensions: dimensions.baseChannel.join(','),
        metrics: metrics.base.join(','),
      });
      const entity = new ChannelStat();
      entity.date = toDate;
      entity.channelId = this.channelId;
      reports.forEach((item) => {
        entity.views = item.views;
        entity.comments = item.comments;
        entity.likes = item.likes;
        entity.dislikes = item.dislikes;
        entity.shares = item.shares;
        entity.estimatedMinutesWatched = item.estimatedMinutesWatched;
        entity.averageViewDuration = item.averageViewDuration;
        entity.averageViewPercentage = item.averageViewPercentage;
        entity.subscribersGained = item.subscribersGained;
        entity.subscribersLost = item.subscribersLost;
      });

      return entity;
    } catch (e) {
      throw new YoutubeApisError('YoutubeAnalyticsApis.asyncChannel', e);
    }
  }

  async asyncTrafficSource(
    toDate: string
  ): Promise<ChannelTrafficSourceStat[]> {
    try {
      const reports = await makingReportData(this.api, {
        startDate: toDate,
        endDate: toDate,
        ids: `channel==${this.channelId}`,
        dimensions: dimensions.baseChannelTrafficSourceType.join(','),
        metrics: metrics.baseTrafficSourceType.join(','),
      });

      const entitys: ChannelTrafficSourceStat[] = [];
      reports.forEach((item) => {
        const entity = new ChannelTrafficSourceStat();
        entity.date = item.date;
        entity.channelId = this.channelId;
        // entity.videoId = item.videoId;
        entity.insightTrafficSourceType = item.insightTrafficSourceType;
        entity.views = item.views;
        entity.estimatedMinutesWatched = item.estimatedMinutesWatched;

        entitys.push(entity);
      });
      return entitys;
    } catch (e) {
      throw new YoutubeApisError('asyncTrafficSource', e);
    }
  }

  async asyncAgeGroup(toDate: string): Promise<ChannelAgeGroupStat[]> {
    try {
      const reports = await makingReportData(this.api, {
        startDate: toDate,
        endDate: toDate,
        ids: `channel==${this.channelId}`,
        dimensions: dimensions.baseChannelAgeGroup.join(','),
        metrics: metrics.baseAgeGroup.join(','),
      });

      const entitys: ChannelAgeGroupStat[] = [];
      reports.forEach((item) => {
        const entity = new ChannelAgeGroupStat();
        entity.date = item.date;
        entity.channelId = this.channelId;
        // entity.videoId = item.videoId;
        entity.ageGroup = item.ageGroup;
        entity.viewerPercentage = item.viewerPercentage;
        entitys.push(entity);
      });
      return entitys;
    } catch (e) {
      throw new YoutubeApisError('asyncAgeGroup', e);
    }
  }

  async asyncGender(toDate: string): Promise<ChannelGenderStat[]> {
    try {
      const reports = await makingReportData(this.api, {
        startDate: toDate,
        endDate: toDate,
        ids: `channel==${this.channelId}`,
        dimensions: dimensions.baseChannelGender.join(','),
        metrics: metrics.baseGender.join(','),
      });

      const entitys: ChannelGenderStat[] = [];
      reports.forEach((item) => {
        const entity = new ChannelGenderStat();
        entity.date = item.date;
        entity.channelId = this.channelId;
        // entity.videoId = item.videoId;
        entity.gender = item.gender;
        entity.viewerPercentage = item.viewerPercentage;
        entitys.push(entity);
      });
      return entitys;
    } catch (e) {
      throw new YoutubeApisError('asyncGender', e);
    }
  }

  async asyncVideo(toDate: string, videoIds: string[]): Promise<VideoStat[]> {
    try {
      const reports = await makingReportData(this.api, {
        startDate: toDate,
        endDate: toDate,
        ids: `channel==${this.channelId}`,
        filters: `video==${videoIds.join(',')}`,
        dimensions: dimensions.baseVideo.join(','),
        metrics: metrics.baseVideo.join(','),
      });

      const entitys: VideoStat[] = [];
      reports.forEach((item) => {
        const entity = new VideoStat();
        entity.date = toDate;
        entity.videoId = item.video;
        entity.views = item.views;
        entity.comments = item.comments;
        entity.likes = item.likes;
        entity.dislikes = item.dislikes;
        entity.shares = item.shares;
        entity.estimatedMinutesWatched = item.estimatedMinutesWatched;
        entity.averageViewDuration = item.averageViewDuration;
        entity.averageViewPercentage = item.averageViewPercentage;
        entity.subscribersGained = item.subscribersGained;
        entity.subscribersLost = item.subscribersLost;
        entitys.push(entity);
      });

      return entitys;
    } catch (e) {
      throw new YoutubeApisError('YoutubeAnalyticsApis.asyncVideo', e);
    }
  }

  async asyncVideoTrafficSource(
    toDate: string,
    videoIds: string[]
  ): Promise<VideoTrafficSourceStat[]> {
    try {
      const reports = await makingReportData(this.api, {
        startDate: toDate,
        endDate: toDate,
        ids: `channel==${this.channelId}`,
        filters: `video==${videoIds.join(',')}`,
        dimensions: dimensions.baseVideoTrafficSourceType.join(','),
        metrics: metrics.baseVideoTrafficSourceType.join(','),
      });

      const entitys: VideoTrafficSourceStat[] = [];
      reports.forEach((item) => {
        const entity = new VideoTrafficSourceStat();
        entity.date = item.date;
        entity.videoId = item.video;
        entity.insightTrafficSourceType = item.insightTrafficSourceType;
        entity.views = item.views;
        entity.estimatedMinutesWatched = item.estimatedMinutesWatched;

        entitys.push(entity);
      });
      return entitys;
    } catch (e) {
      throw new YoutubeApisError('asyncVideoTrafficSource', e);
    }
  }
  async asyncVideoAgeGroup(
    toDate: string,
    videoIds: string[]
  ): Promise<VideoAgeGroupStat[]> {
    try {
      const reports = await makingReportData(this.api, {
        startDate: toDate,
        endDate: toDate,
        ids: `channel==${this.channelId}`,
        filters: `video==${videoIds.join(',')}`,
        dimensions: dimensions.baseVideoAgeGroup.join(','),
        metrics: metrics.baseVideoAgeGroup.join(','),
      });

      const entitys: VideoAgeGroupStat[] = [];
      reports.forEach((item) => {
        const entity = new VideoAgeGroupStat();
        entity.date = item.date;
        entity.videoId = item.video;
        entity.ageGroup = item.ageGroup;
        entity.viewerPercentage = item.viewerPercentage;
        entitys.push(entity);
      });
      return entitys;
    } catch (e) {
      throw new YoutubeApisError('asyncVideoAgeGroup', e);
    }
  }
  async asyncVideoGender(
    toDate: string,
    videoIds: string[]
  ): Promise<VideoGenderStat[]> {
    try {
      const reports = await makingReportData(this.api, {
        startDate: toDate,
        endDate: toDate,
        ids: `channel==${this.channelId}`,
        filters: `video==${videoIds.join(',')}`,
        dimensions: dimensions.baseVideoGender.join(','),
        metrics: metrics.baseVideoGender.join(','),
      });

      const entitys: VideoGenderStat[] = [];
      reports.forEach((item) => {
        const entity = new VideoGenderStat();
        entity.date = item.date;
        entity.videoId = item.video;
        entity.gender = item.gender;
        entity.viewerPercentage = item.viewerPercentage;
        entitys.push(entity);
      });
      return entitys;
    } catch (e) {
      throw new YoutubeApisError('asyncVideoGender', e);
    }
  }
}
