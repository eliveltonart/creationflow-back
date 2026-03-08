import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  // Create and send an invite (authenticated)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createInviteDto: CreateInviteDto, @Request() req) {
    return this.invitesService.create(createInviteDto, req.user.sub);
  }

  // Cancel a pending invite (authenticated)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  cancel(@Param('id') id: string, @Request() req) {
    return this.invitesService.cancel(id, req.user.sub);
  }

  // Get invite details by token (public - for the accept page)
  @Get(':token')
  getByToken(@Param('token') token: string) {
    return this.invitesService.getByToken(token);
  }

  // Accept an invite (public - user may not be logged in)
  @Post(':token/accept')
  accept(@Param('token') token: string, @Body() acceptInviteDto: AcceptInviteDto) {
    return this.invitesService.accept(token, acceptInviteDto);
  }

  // List invites for a company (authenticated)
  @UseGuards(JwtAuthGuard)
  @Get('company/:companyId')
  listByCompany(@Param('companyId') companyId: string, @Request() req) {
    return this.invitesService.listByCompany(companyId, req.user.sub);
  }
}
