import { Entity, Column } from 'typeorm';

@Entity()
export class ChannelAgeGroupStat {
  @Column({ primary: true, type: 'date', comment: '기간' })
  date!: string;

  @Column({ primary: true, length: 24, comment: '채널 아이디' })
  channelId!: string;

  @Column({ primary: true })
  ageGroup!: string;

  @Column({ type: 'float' })
  viewerPercentage!: number;
}
