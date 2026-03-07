import { Module } from '@nestjs/common';
import { RetroController } from './retro.controller';
import { RetroService } from './retro.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RetroController],
  providers: [RetroService],
})
export class RetroModule {}
