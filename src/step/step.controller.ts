import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StepService } from './step.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { Step as StepModel } from '@prisma/client';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';

@Controller('step')
export class StepController {
  constructor(private readonly stepService: StepService) {}

  @Post()
  create(
    @Body() createStepDto: CreateStepDto,
  ): Promise<ApiReturns<StepModel | null>> {
    return this.stepService.create(createStepDto);
  }

  @Get()
  findAll(): Promise<ApiReturns<StepModel[] | null>> {
    return this.stepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiReturns<StepModel | null>> {
    return this.stepService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStepDto: UpdateStepDto,
  ): Promise<ApiReturns<StepModel | null>> {
    return this.stepService.update(id, updateStepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string | { message: string }> {
    return this.stepService.remove(id);
  }
}
