import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { InvitesModule } from './invites/invites.module';
import { ProjectsModule } from './projects/projects.module';
import { SprintsModule } from './sprints/sprints.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GitIntegrationModule } from './git-integration/git-integration.module';
import { ResourcesModule } from './resources/resources.module';
import { HandoffModule } from './handoff/handoff.module';
import { RetroModule } from './retro/retro.module';
import { EmployersModule } from './employers/employers.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    InvitesModule,
    ProjectsModule,
    SprintsModule,
    TasksModule,
    DashboardModule,
    GitIntegrationModule,
    ResourcesModule,
    HandoffModule,
    RetroModule,
    EmployersModule,
    AdminModule,
  ],
})
export class AppModule {}

