import { Entity, Column } from 'typeorm';
import { Thumbnails } from 'src/apis/google/youtube/type';

@Entity({ name: 'channel' })
export class ChannelEntity {
  @Column({ primary: true, length: 24 })
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', charset: 'utf8mb4' })
  description!: string;

  @Column({ type: 'json' })
  thumbnails!: Thumbnails;

  @Column()
  viewCount!: number;

  @Column()
  commentCount!: number;

  @Column()
  subscriberCount!: number;

  @Column({ type: 'datetime' })
  publishedAt!: Date;

  @Column()
  banner!: string;

  @Column()
  relatedPlaylistsId!: string;
}
