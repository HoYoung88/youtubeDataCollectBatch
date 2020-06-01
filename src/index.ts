import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import moment from 'moment';
import { YoutubeCreatersService } from './service/YoutubeCreaters';
import { YoutubeDataService } from './service/YoutubeData';
import { YoutubeAnalyticsService } from './service/YoutubeAnalytics';
import arrayDivision from './utils/arrayDivision';
import log from './logger';

(async (): Promise<void> => {
  try {
    const createrId = '6d130dba-3544-4309-b654-cbecfa1587f8';

    const connection = await createConnection();
    const ytCreatersService = new YoutubeCreatersService(connection);
    const createrInfo = await ytCreatersService.asyncGetCreaterInfo(createrId);

    if (createrInfo) {
      log.info(
        '%s(%s) youtube date install start',
        createrInfo.channelName,
        createrInfo.channelId
      );
      const ytDateService = new YoutubeDataService(connection, createrInfo);
      const ytAnalyticsService = new YoutubeAnalyticsService(
        connection,
        createrInfo
      );

      await ytDateService.asyncAddChannelData();

      log.info(
        '%s(%s) youtube date install success',
        createrInfo.channelName,
        createrInfo.channelId
      );

      log.info(
        '%s(%s) youtube analytics install start',
        createrInfo.channelName,
        createrInfo.channelId
      );
      let sCollectDate = moment(createrInfo.collectDate);
      const eCollectDate = moment(moment()).add(-3, 'days');

      while (moment.duration(eCollectDate.diff(sCollectDate)).asDays() >= 0) {
        log.info(
          '%s(%s) add analytics install Date:: %s',
          createrInfo.channelName,
          createrInfo.channelId,
          sCollectDate.format('YYYY-MM-DD')
        );
        await ytAnalyticsService.asyncAddChannelAnalyitcs(sCollectDate);

        const videoData = await ytDateService.asyncGetVideos(sCollectDate);
        const videos = arrayDivision(
          videoData.map(({ videoId }) => videoId),
          100
        );

        for await (const video of videos) {
          await ytAnalyticsService.asyncAddVideoAnalitcs(sCollectDate, video);
        }

        sCollectDate = moment(sCollectDate).add(1, 'days');
      }

      await ytCreatersService.asyncUpdateCollectDate(
        createrId,
        sCollectDate.toDate()
      );
      log.info(
        '%s(%s) youtube analytics install success',
        createrInfo.channelName,
        createrInfo.channelId
      );
    } else {
      log.error('not find createrId: %s', createrId);
    }
  } catch (e) {
    log.error(e);
  } finally {
    await getConnection().close();
    log.info('==== Process exit ====');
  }
})();
