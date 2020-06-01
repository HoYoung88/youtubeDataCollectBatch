import { Connection, Repository } from 'typeorm';
import { YoutubeCreators } from '../entity/YoutubeCreators';

export class YoutubeCreatersService {
  private connection: Connection;
  private repository!: Repository<YoutubeCreators>;
  constructor(connection: Connection) {
    this.connection = connection;
    this.repository = this.connection.getRepository(YoutubeCreators);
  }

  async asyncAddCreater(creator: YoutubeCreators): Promise<void> {
    await this.repository.save(creator);
  }

  async asyncGetCreaterInfo(id: string): Promise<YoutubeCreators | undefined> {
    return await this.repository.findOne(id);
  }

  async asyncUpdateCollectDate(id: string, collectDate: Date): Promise<void> {
    await this.repository.update(id, { collectDate });
  }
}
