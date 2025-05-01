import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseFilters,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleType } from 'src/utils/types/PrismaApiModel.type';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { validatePagination } from 'src/utils/pageQueryhandeler';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterExceptionFilter } from 'src/filter/multerException.filter';

@Controller('article')
export class ArticleController {
  constructor(private ArticleService: ArticleService) {}

  @Post()
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(FileInterceptor('banner'))
  create(
    @UploadedFile() banner: Express.Multer.File,
    @Body() body: CreateArticleDto,
  ): Promise<ApiReturns<ArticleType | null>> {
    return this.ArticleService.create(body, banner);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '50',
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
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(FileInterceptor('banner'))
  update(
    @Param('id') id: string,
    @UploadedFile() banner: Express.Multer.File,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ApiReturns<Omit<ArticleType, 'step'>>> {
    return this.ArticleService.update(id, updateArticleDto, banner);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string | { message: string }> {
    return this.ArticleService.remove(id);
  }
}
