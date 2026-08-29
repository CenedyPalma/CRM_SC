import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionsService } from './actions.service';

@Controller('workflows/:workflowId/actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  create(
    @Param('workflowId') workflowId: string,
    @Body() createActionDto: any
  ) {
    return this.actionsService.create(workflowId, createActionDto);
  }

  @Get()
  findAll(@Param('workflowId') workflowId: string) {
    return this.actionsService.findAll(workflowId);
  }

  @Get(':id')
  findOne(
    @Param('workflowId') workflowId: string,
    @Param('id') id: string
  ) {
    return this.actionsService.findOne(workflowId, id);
  }

  @Patch(':id')
  update(
    @Param('workflowId') workflowId: string,
    @Param('id') id: string, 
    @Body() updateActionDto: any
  ) {
    return this.actionsService.update(workflowId, id, updateActionDto);
  }

  @Delete(':id')
  remove(
    @Param('workflowId') workflowId: string,
    @Param('id') id: string
  ) {
    return this.actionsService.remove(workflowId, id);
  }
}
