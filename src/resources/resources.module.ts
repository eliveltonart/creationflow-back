import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { EncryptionService } from './encryption.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ResourcesController],
  providers: [ResourcesService, EncryptionService],
})
export class ResourcesModule {}
