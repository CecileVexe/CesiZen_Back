import { Controller, Post, Body, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get('/client/:citizenId')
  async getFavoritesForClient(@Param('citizenId') citizenId: string) {
    return await this.favoriteService.getFavoritesForClient(citizenId);
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
