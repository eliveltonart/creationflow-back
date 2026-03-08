import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RetroService } from './retro.service';
import {
  CreateRetroDto,
  UpdateRetroDto,
  CreateCardDto,
  UpdateCardDto,
  VoteCardDto,
  CreateActionDto,
  JoinRetroDto,
} from './dto/retro.dto';

@Controller('retros')
export class RetroController {
  constructor(private readonly retroService: RetroService) {}

  // ── Public share access ───────────────────────────────────────────────────
  @Get('share/:token')
  getByShareToken(@Param('token') token: string) {
    return this.retroService.findByShareToken(token);
  }

  @Post('share/:token/join')
  joinViaShare(@Param('token') token: string, @Body() dto: JoinRetroDto) {
    return this.retroService.joinRetroByToken(token, dto);
  }

  @Post('share/:token/cards')
  addCardViaShare(@Param('token') token: string, @Body() dto: CreateCardDto) {
    return this.retroService.createCardByToken(token, dto);
  }

  @Post('share/:token/cards/:cardId/votes')
  voteViaShare(
    @Param('token') token: string,
    @Param('cardId') cardId: string,
    @Body() dto: VoteCardDto,
  ) {
    return this.retroService.voteCardByToken(token, cardId, dto);
  }

  // ── Authenticated routes ──────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('projects')
  getProjects(@Request() req: any) {
    return this.retroService.getProjects(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('projects/:projectId/sprints')
  getProjectSprints(@Param('projectId') projectId: string, @Request() req: any) {
    return this.retroService.getProjectSprints(projectId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req: any,
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
  ) {
    return this.retroService.findAll(req.user.sub, projectId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRetroDto, @Request() req: any) {
    return this.retroService.create(dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.retroService.findOne(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRetroDto, @Request() req: any) {
    return this.retroService.update(id, dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.retroService.delete(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/advance')
  advancePhase(@Param('id') id: string, @Request() req: any) {
    return this.retroService.advancePhase(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/share/revoke')
  revokeShareToken(@Param('id') id: string, @Request() req: any) {
    return this.retroService.revokeShareToken(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  joinRetro(@Param('id') id: string, @Body() dto: JoinRetroDto, @Request() req: any) {
    return this.retroService.joinRetro(id, dto, req.user.sub);
  }

  // ── Cards ─────────────────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post(':id/cards')
  createCard(@Param('id') id: string, @Body() dto: CreateCardDto, @Request() req: any) {
    return this.retroService.createCard(id, dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cards/:cardId')
  updateCard(
    @Param('id') id: string,
    @Param('cardId') cardId: string,
    @Body() dto: UpdateCardDto,
    @Request() req: any,
  ) {
    return this.retroService.updateCard(id, cardId, dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/cards/:cardId')
  deleteCard(@Param('id') id: string, @Param('cardId') cardId: string, @Request() req: any) {
    return this.retroService.deleteCard(id, cardId, req.user.sub);
  }

  // ── Votes ─────────────────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post(':id/cards/:cardId/votes')
  voteCard(
    @Param('id') id: string,
    @Param('cardId') cardId: string,
    @Body() dto: VoteCardDto,
    @Request() req: any,
  ) {
    return this.retroService.voteCard(id, cardId, dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/cards/:cardId/votes')
  removeVote(@Param('id') id: string, @Param('cardId') cardId: string, @Request() req: any) {
    return this.retroService.removeVote(id, cardId, req.user.sub);
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post(':id/actions')
  createAction(@Param('id') id: string, @Body() dto: CreateActionDto, @Request() req: any) {
    return this.retroService.createAction(id, dto, req.user.sub);
  }
}
