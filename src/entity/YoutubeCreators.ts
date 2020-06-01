import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class YoutubeCreators {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: number;

  @Column({ length: 24, nullable: false })
  channelId!: string;

  @Column()
  channelName!: string;

  @Column({ nullable: false })
  accessToken!: string;

  @Column({ nullable: false })
  refreshToken!: string;

  @Column({ type: 'char', length: 13, nullable: false })
  expiryDate!: string;

  @Column({ type: 'char', length: 6, default: 'Bearer', insert: false })
  tokenType!: string;

  @Column({ type: 'datetime', nullable: false })
  collectDate!: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  joinDate!: string;
}
