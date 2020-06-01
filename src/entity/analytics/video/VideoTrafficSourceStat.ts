import { Entity, Column } from 'typeorm';

@Entity()
export class VideoTrafficSourceStat {
  @Column({ primary: true, type: 'date', comment: '기간' })
  date!: string;

  @Column({ primary: true, length: 24, comment: '비디오 아이디' })
  videoId!: string;

  @Column({ primary: true, comment: '트래픽 소스 타입' })
  insightTrafficSourceType!: string;

  @Column({ comment: '조회수', default: 0 })
  views!: number;

  @Column({ comment: '시청 시간 (분)', default: 0 })
  estimatedMinutesWatched!: number;
}
