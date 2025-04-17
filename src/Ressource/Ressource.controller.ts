import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RessourceService } from './Ressource.service';
import { CreateRessourceDto } from './dto/create-Ressource.dto';
import { UpdateRessourceDto } from './dto/update-Ressource.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { validatePagination } from 'src/utils/pageQueryhandeler';
import {
  RessourceType,
  RessourceWithCommentType,
} from 'src/utils/types/PrismaApiModel.type';

@Controller('Ressource')
export class RessourceController {
  constructor(private RessourceService: RessourceService) {}

  @Post()
  create(
    @Body() createRessourceDto: CreateRessourceDto,
  ): Promise<ApiReturns<RessourceType | null>> {
    return this.RessourceService.create(createRessourceDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: string,
    @Query('sortBy') sortBy: 'asc' | 'desc' = 'asc',
  ): Promise<ApiReturns<Array<Omit<RessourceType, 'step'>> | null>> {
    const { page: pageNumber, perPage: perPageNumber } = validatePagination(
      page,
      perPage,
    );

    return this.RessourceService.findAll(
      pageNumber,
      perPageNumber,
      orderBy,
      sortBy,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<ApiReturns<RessourceWithCommentType | null>> {
    return this.RessourceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRessourceDto: UpdateRessourceDto,
  ): Promise<ApiReturns<Omit<RessourceType, 'step'>>> {
    return this.RessourceService.update(id, updateRessourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string | { message: string }> {
    return this.RessourceService.remove(id);
  }
}
