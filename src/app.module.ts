import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RessourceModule } from './Ressource/Ressource.module';
import { CommentModule } from './comment/comment.module';
import { CitizenModule } from './citizen/citizen.module';
import { CategoryModule } from './category/category.module';
import { StepModule } from './step/step.module';
import { ProgressionModule } from './progression/progression.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RoleModule } from './role/role.module';
import { FavoriteModule } from './favorite/favorite.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    CommentModule,
    CitizenModule,
    RessourceModule,
    RoleModule,
    StepModule,
    ProgressionModule,
    ScheduleModule.forRoot(),
    CategoryModule,
    MessageModule,
    FavoriteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
