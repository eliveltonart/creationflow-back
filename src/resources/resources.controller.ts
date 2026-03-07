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
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Post()
  create(@Body() dto: CreateResourceDto, @Request() req) {
    return this.service.create(dto, req.user.sub);
  }

  @Get()
  findAll(@Query('companyId') companyId: string, @Request() req) {
    return this.service.findAllForCompany(companyId, req.user.sub);
  }

  @Get('company-users')
  getCompanyUsers(@Query('companyId') companyId: string, @Request() req) {
    return this.service.getCompanyUsers(companyId, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto,
    @Request() req,
  ) {
    return this.service.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.sub);
  }
}
