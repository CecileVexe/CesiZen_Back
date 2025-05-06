import { Controller, Post, Body, Delete, Get, Param } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get('/client/:userId')
  async getFavoritesForClient(@Param('userId') userId: string) {
    return await this.favoriteService.getFavoritesOfUser(userId);
  }

  @Post()
  async addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    return await this.favoriteService.createFavorite(createFavoriteDto);
  }

  @Delete()
  async removeFavorite(@Body() removeFavoriteDto: CreateFavoriteDto) {
    return await this.favoriteService.removeFavorite(removeFavoriteDto);
  }
}
