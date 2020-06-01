import { Entity, Column } from 'typeorm';
import { Thumbnails } from 'src/apis/google/youtube/type';

@Entity({ name: 'video' })
export class VideoEntity {
  @Column({ primary: true, length: 11 })
  videoId!: string;

  @Column({
    type: 'text',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  title!: string;

  @Column({
    type: 'text',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  description!: string;

  @Column({ type: 'json' })
  thumbnails!: Thumbnails;

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ default: 0 })
  likeCount!: number;

  @Column({ default: 0 })
  dislikeCount!: number;

  @Column({ default: 0 })
  commentCount!: number;

  @Column({ default: 0 })
  favoriteCount!: number;

  @Column({ length: 15 })
  duration!: string;

  @Column({ type: 'datetime' })
  publishedAt!: Date;

  @Column({ length: 24 })
  channelId!: string;
}
