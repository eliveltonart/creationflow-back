import { Module } from '@nestjs/common';
import { EmployersController } from './employers.controller';
import { EmployersService } from './employers.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [EmployersController],
  providers: [EmployersService, PrismaService],
})
export class EmployersModule {}
