import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { AdminService } from './admin.service';
import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
  AdminSetFeatureFlagDto,
  AdminQueryDto,
} from './dto/admin.dto';

@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Stats ──────────────────────────────────────────────────────────────────
  @Get('stats')
  getPlatformStats() {
    return this.adminService.getPlatformStats();
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  @Get('users')
  listUsers(@Query() query: AdminQueryDto) {
    return this.adminService.listUsers(query);
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  createUser(@Body() dto: AdminCreateUserDto, @Req() req: any) {
    const ip = req.ip;
    return this.adminService.createUser(dto, req.user.sub, ip);
  }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
    @Req() req: any,
  ) {
    return this.adminService.updateUser(id, dto, req.user.sub, req.ip);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string, @Req() req: any) {
    return this.adminService.deleteUser(id, req.user.sub, req.ip);
  }

  // ── Feature Flags ──────────────────────────────────────────────────────────
  @Get('users/:id/features')
  getFeatureFlags(@Param('id') id: string) {
    return this.adminService.getFeatureFlags(id);
  }

  @Post('users/:id/features')
  setFeatureFlag(
    @Param('id') userId: string,
    @Body() dto: AdminSetFeatureFlagDto,
    @Req() req: any,
  ) {
    return this.adminService.setFeatureFlag(userId, dto, req.user.sub, req.ip);
  }

  // ── Companies ──────────────────────────────────────────────────────────────
  @Get('companies')
  listCompanies(@Query() query: AdminQueryDto) {
    return this.adminService.listCompanies(query);
  }

  @Delete('companies/:id')
  deleteCompany(@Param('id') id: string, @Req() req: any) {
    return this.adminService.deleteCompany(id, req.user.sub, req.ip);
  }

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  @Get('logs')
  getAdminLogs(@Query() query: AdminQueryDto) {
    return this.adminService.getAdminLogs(query);
  }
}
