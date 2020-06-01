import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Thumbnails } from 'src/apis/google/youtube/type';
import { PlaylistEntity } from './Playlist';

@Entity({ name: 'playlistItems' })
export class PlaylistItemsEntity {
  @Column({ primary: true, length: 68 })
  id!: string;

  @ManyToOne(
    (type) => PlaylistEntity,
    (playlistEntity) => playlistEntity.playlistItems
  )
  @JoinColumn({ name: 'playlistId' })
  playlistId!: string;

  @Column({ length: 11 })
  videoId!: string;

  @Column({ type: 'json' })
  thumbnails!: Thumbnails;

  @Column({ default: 0 })
  position!: number;

  @Column({ type: 'datetime' })
  publishedAt!: Date;
}
