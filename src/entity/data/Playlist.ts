import { Entity, Column, OneToMany } from 'typeorm';
import { Thumbnails } from '../../apis/google/youtube/type';
import { PlaylistItemsEntity } from './PlaylistItem';

@Entity({ name: 'playlist' })
export class PlaylistEntity {
  @Column({ primary: true, length: 34 })
  playlistId!: string;

  @Column()
  channelId!: string;

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

  @Column({ type: 'json', nullable: true })
  thumbnails!: Thumbnails;

  @Column({ default: 0 })
  itemCount!: number;

  @Column({ type: 'datetime' })
  publishedAt!: Date;

  @OneToMany(
    (type) => PlaylistItemsEntity,
    (playlistItemsEntity: PlaylistItemsEntity) => playlistItemsEntity.playlistId
  )
  playlistItems!: PlaylistItemsEntity[];
}
