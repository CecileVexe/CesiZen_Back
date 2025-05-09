import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decortator';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const image = await this.imageService.findOne(id);
    if (!image || !image.url) {
      throw new NotFoundException('Image non trouvée');
    }

    res.setHeader('Content-Type', image.mimetype);
    res.send(Buffer.from(image.url));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
