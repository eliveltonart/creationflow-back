import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(dto, req.user.sub);
  }

  @Get()
  findByProject(@Query('projectId') projectId: string, @Request() req) {
    return this.tasksService.findByProject(projectId, req.user.sub);
  }

  @Get('sprint/:sprintId')
  findBySprint(@Param('sprintId') sprintId: string, @Request() req) {
    return this.tasksService.findBySprint(sprintId, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(id, dto, req.user.sub);
  }

  @Patch(':id/dod/:index')
  updateDodItem(
    @Param('id') id: string,
    @Param('index') index: string,
    @Body('completed') completed: boolean,
    @Request() req,
  ) {
    return this.tasksService.updateDodItem(id, parseInt(index), completed, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.sub);
  }
}
