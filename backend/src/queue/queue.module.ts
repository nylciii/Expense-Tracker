/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bullmq';

import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';

@Module({
  imports: [
  
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
   
    BullModule.registerQueue({
      name: 'exampleQueue',
    }),
  ],
  providers: [QueueService, QueueProcessor],
})
export class QueueModule {}