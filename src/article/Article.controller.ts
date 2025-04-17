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
import { ArticleService } from './Article.service';
import { CreateArticleDto } from './dto/create-Article.dto';
import { UpdateArticleDto } from './dto/update-Article.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { validatePagination } from 'src/utils/pageQueryhandeler';
import { ArticleType } from 'src/utils/types/PrismaApiModel.type';

@Controller('Article')
export class ArticleController {
  constructor(private ArticleService: ArticleService) {}

  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<ApiReturns<ArticleType | null>> {
    return this.ArticleService.create(createArticleDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: string,
    @Query('sortBy') sortBy: 'asc' | 'desc' = 'asc',
  ): Promise<ApiReturns<Array<ArticleType> | null>> {
    const { page: pageNumber, perPage: perPageNumber } = validatePagination(
      page,
      perPage,
    );

    return this.ArticleService.findAll(
      pageNumber,
      perPageNumber,
      orderBy,
      sortBy,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiReturns<ArticleType | null>> {
    return this.ArticleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ApiReturns<Omit<ArticleType, 'step'>>> {
    return this.ArticleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string | { message: string }> {
    return this.ArticleService.remove(id);
  }
}
