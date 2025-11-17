import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('exampleQueue') private readonly exampleQueue: Queue) {}

  async addJob(data: any) {
    await this.exampleQueue.add('exampleJob', data);
  }
}