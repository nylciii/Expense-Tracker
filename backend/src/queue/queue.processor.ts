/* eslint-disable prettier/prettier */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('exampleQueue')
export class QueueProcessor extends WorkerHost {
  async process(job: Job): Promise<void> {
    console.log('Processing job:', job.name, job.data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async work
  }
}