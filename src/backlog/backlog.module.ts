import { Module } from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { BacklogController, EpicsController } from './backlog.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BacklogController, EpicsController],
  providers: [BacklogService],
  exports: [BacklogService],
})
export class BacklogModule {}
