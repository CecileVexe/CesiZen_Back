import { Controller, Post, Body, Delete, Get, Param } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get('/user/:userId')
  async getFavoritesForUser(@Param('userId') userId: string) {
    return await this.favoriteService.getFavoritesOfUser(userId);
  }

  @Post()
  async addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    return await this.favoriteService.createFavorite(createFavoriteDto);
  }

  @Delete('/:id')
  async removeFavorite(@Param('id') id: string) {
    return await this.favoriteService.removeFavorite(id);
  }
}
