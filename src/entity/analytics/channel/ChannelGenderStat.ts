import { Entity, Column } from 'typeorm';

@Entity()
export class ChannelGenderStat {
  @Column({ primary: true, type: 'date', comment: '기간' })
  date!: string;

  @Column({ primary: true, length: 24, comment: '채널 아이디' })
  channelId!: string;

  @Column({ primary: true, comment: 'gender 구분' })
  gender!: string;

  @Column({ type: 'float' })
  viewerPercentage!: number;
}
