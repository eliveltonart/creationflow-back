import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Headers,
  HttpCode,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GitIntegrationService } from './git-integration.service';
import { ConnectRepoDto } from './dto/connect-repo.dto';
import { UpdateRepoDto, LinkPrToTaskDto } from './dto/update-repo.dto';

@Controller('git')
export class GitIntegrationController {
  constructor(private readonly service: GitIntegrationService) {}

  // ─── Webhook (public — no auth) ──────────────────────────────────────────────

  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Body() body: any,
    @Headers('x-hub-signature-256') signature: string,
    @Headers('x-github-event') event: string,
  ) {
    const repoFullName: string = body?.repository?.full_name;
    if (!repoFullName) return { ignored: true };

    if (event === 'ping') return { pong: true };

    if (event === 'pull_request') {
      return this.service.handleWebhook(body, signature, repoFullName);
    }

    if (event === 'check_run') {
      return this.service.handleCiWebhook(body, repoFullName);
    }

    return { ignored: true, event };
  }

  // ─── Authenticated endpoints ─────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('projects')
  getProjects(@Request() req: any) {
    return this.service.getProjectsWithRepos(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('repos')
  connectRepo(@Body() dto: ConnectRepoDto, @Request() req: any) {
    return this.service.connectRepo(dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('repos/:projectId')
  getRepos(@Param('projectId') projectId: string, @Request() req: any) {
    return this.service.getReposByProject(projectId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('repos/:repoId')
  updateRepo(
    @Param('repoId') repoId: string,
    @Body() dto: UpdateRepoDto,
    @Request() req: any,
  ) {
    return this.service.updateRepo(repoId, dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('repos/:repoId')
  disconnectRepo(@Param('repoId') repoId: string, @Request() req: any) {
    return this.service.disconnectRepo(repoId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('repos/:repoId/sync')
  syncRepo(@Param('repoId') repoId: string, @Request() req: any) {
    return this.service.syncFromGitHub(repoId, req.user.sub);
  }

  // ─── Pull Requests ───────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('prs/:projectId')
  getPullRequests(
    @Param('projectId') projectId: string,
    @Query('state') state: string,
    @Query('taskId') taskId: string,
    @Query('repoId') repoId: string,
    @Request() req: any,
  ) {
    return this.service.getPullRequests(projectId, req.user.sub, { state, taskId, repoId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('prs/:prId/link')
  linkPrToTask(
    @Param('prId') prId: string,
    @Body() dto: LinkPrToTaskDto,
    @Request() req: any,
  ) {
    return this.service.linkPrToTask(prId, dto, req.user.sub);
  }
}
