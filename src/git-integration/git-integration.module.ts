import { Module } from '@nestjs/common';
import { GitIntegrationService } from './git-integration.service';
import { GitIntegrationController } from './git-integration.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GitIntegrationController],
  providers: [GitIntegrationService],
  exports: [GitIntegrationService],
})
export class GitIntegrationModule {}
