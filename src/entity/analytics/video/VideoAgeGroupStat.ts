import { Entity, Column } from 'typeorm';

@Entity()
export class VideoAgeGroupStat {
  @Column({ primary: true, type: 'date', comment: '기간' })
  date!: string;

  @Column({ primary: true, length: 24, comment: '비디오 아이디' })
  videoId!: string;

  @Column({ primary: true })
  ageGroup!: string;

  @Column({ type: 'float' })
  viewerPercentage!: number;
}
