import { Entity, Column } from 'typeorm';

@Entity()
export class VideoStat {
  @Column({ primary: true, type: 'date', comment: '기간' })
  date!: string;

  @Column({ primary: true, length: 24, comment: '비디오 아이디' })
  videoId!: string;

  @Column({ comment: '조회수', default: 0 })
  views!: number;

  @Column({ comment: '시청 시간 (분)', default: 0 })
  estimatedMinutesWatched!: number;

  @Column({ comment: '좋아요', default: 0 })
  likes!: number;

  @Column({ comment: '싫어요', default: 0 })
  dislikes!: number;

  @Column({ comment: '구독자 증가수', default: 0 })
  subscribersGained!: number;

  @Column({ comment: '구독자 감소수', default: 0 })
  subscribersLost!: number;

  @Column({ comment: '공유', default: 0 })
  shares!: number;

  @Column({ comment: '댓글', default: 0 })
  comments!: number;

  @Column({ comment: '평균 시청 지속 시간', default: 0 })
  averageViewDuration!: number;

  @Column({
    type: 'float',
    comment: '평균 조회율(조회당 평균 시청률)',
    default: 0.0,
  })
  averageViewPercentage!: number;
}
