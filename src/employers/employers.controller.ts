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
import { EmployersService } from './employers.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreatePositionDto,
  UpdatePositionDto,
  CreateEmployerDto,
  UpdateEmployerDto,
  CreateSkillDto,
  AssignRoleDto,
} from './dto/employer.dto';

@UseGuards(JwtAuthGuard)
@Controller('employers')
export class EmployersController {
  constructor(private readonly service: EmployersService) {}

  // ── Companies ───────────────────────────────────────────────────────────────

  @Get('companies')
  getCompanies(@Request() req: any) {
    return this.service.getAccessibleCompanies(req.user.sub);
  }

  // ── Departments ─────────────────────────────────────────────────────────────

  @Get(':companyId/departments')
  getDepartments(@Param('companyId') companyId: string, @Request() req: any) {
    return this.service.getDepartments(companyId, req.user.sub);
  }

  @Post(':companyId/departments')
  createDepartment(
    @Param('companyId') companyId: string,
    @Body() dto: CreateDepartmentDto,
    @Request() req: any,
  ) {
    return this.service.createDepartment(companyId, dto, req.user.sub);
  }

  @Patch(':companyId/departments/:deptId')
  updateDepartment(
    @Param('companyId') companyId: string,
    @Param('deptId') deptId: string,
    @Body() dto: UpdateDepartmentDto,
    @Request() req: any,
  ) {
    return this.service.updateDepartment(companyId, deptId, dto, req.user.sub);
  }

  @Delete(':companyId/departments/:deptId')
  deleteDepartment(
    @Param('companyId') companyId: string,
    @Param('deptId') deptId: string,
    @Request() req: any,
  ) {
    return this.service.deleteDepartment(companyId, deptId, req.user.sub);
  }

  // ── Positions ───────────────────────────────────────────────────────────────

  @Get(':companyId/positions')
  getPositions(@Param('companyId') companyId: string, @Request() req: any) {
    return this.service.getPositions(companyId, req.user.sub);
  }

  @Post(':companyId/positions')
  createPosition(
    @Param('companyId') companyId: string,
    @Body() dto: CreatePositionDto,
    @Request() req: any,
  ) {
    return this.service.createPosition(companyId, dto, req.user.sub);
  }

  @Patch(':companyId/positions/:posId')
  updatePosition(
    @Param('companyId') companyId: string,
    @Param('posId') posId: string,
    @Body() dto: UpdatePositionDto,
    @Request() req: any,
  ) {
    return this.service.updatePosition(companyId, posId, dto, req.user.sub);
  }

  @Delete(':companyId/positions/:posId')
  deletePosition(
    @Param('companyId') companyId: string,
    @Param('posId') posId: string,
    @Request() req: any,
  ) {
    return this.service.deletePosition(companyId, posId, req.user.sub);
  }

  // ── Members + Profiles ──────────────────────────────────────────────────────

  @Get(':companyId/members')
  listMembers(
    @Param('companyId') companyId: string,
    @Request() req: any,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
    @Query('contractType') contractType?: string,
    @Query('search') search?: string,
  ) {
    return this.service.listMembers(companyId, req.user.sub, {
      departmentId, status, contractType, search,
    });
  }

  @Get(':companyId/profile/:memberUserId')
  getOrCreateProfile(
    @Param('companyId') companyId: string,
    @Param('memberUserId') memberUserId: string,
    @Request() req: any,
  ) {
    return this.service.getOrCreateProfile(companyId, memberUserId, req.user.sub);
  }

  // ── Employers direct CRUD ────────────────────────────────────────────────────

  @Get(':companyId')
  listEmployers(
    @Param('companyId') companyId: string,
    @Request() req: any,
    @Query('departmentId') departmentId?: string,
    @Query('status') status?: string,
    @Query('contractType') contractType?: string,
    @Query('search') search?: string,
  ) {
    return this.service.listEmployers(companyId, req.user.sub, {
      departmentId, status, contractType, search,
    });
  }

  @Get(':companyId/:employerId')
  getEmployer(
    @Param('companyId') companyId: string,
    @Param('employerId') employerId: string,
    @Request() req: any,
  ) {
    return this.service.getEmployer(companyId, employerId, req.user.sub);
  }

  @Post(':companyId')
  createEmployer(
    @Param('companyId') companyId: string,
    @Body() dto: CreateEmployerDto,
    @Request() req: any,
  ) {
    return this.service.createEmployer(companyId, dto, req.user.sub);
  }

  @Patch(':companyId/:employerId')
  updateEmployer(
    @Param('companyId') companyId: string,
    @Param('employerId') employerId: string,
    @Body() dto: UpdateEmployerDto,
    @Request() req: any,
  ) {
    return this.service.updateEmployer(companyId, employerId, dto, req.user.sub);
  }

  @Delete(':companyId/:employerId')
  deleteEmployer(
    @Param('companyId') companyId: string,
    @Param('employerId') employerId: string,
    @Request() req: any,
  ) {
    return this.service.deleteEmployer(companyId, employerId, req.user.sub);
  }

  // ── Skills ──────────────────────────────────────────────────────────────────

  @Post(':companyId/:employerId/skills')
  addSkill(
    @Param('companyId') companyId: string,
    @Param('employerId') employerId: string,
    @Body() dto: CreateSkillDto,
    @Request() req: any,
  ) {
    return this.service.addSkill(companyId, employerId, dto, req.user.sub);
  }

  @Delete(':companyId/:employerId/skills/:skillId')
  removeSkill(
    @Param('companyId') companyId: string,
    @Param('employerId') employerId: string,
    @Param('skillId') skillId: string,
    @Request() req: any,
  ) {
    return this.service.removeSkill(companyId, employerId, skillId, req.user.sub);
  }

  // ── Roles ───────────────────────────────────────────────────────────────────

  @Post(':companyId/:employerId/roles')
  assignRole(
    @Param('companyId') companyId: string,
    @Param('employerId') employerId: string,
    @Body() dto: AssignRoleDto,
    @Request() req: any,
  ) {
    return this.service.assignRole(companyId, employerId, dto, req.user.sub);
  }

  @Delete(':companyId/:employerId/roles/:roleId')
  revokeRole(
    @Param('companyId') companyId: string,
    @Param('employerId') employerId: string,
    @Param('roleId') roleId: string,
    @Request() req: any,
  ) {
    return this.service.revokeRole(companyId, employerId, roleId, req.user.sub);
  }
}
