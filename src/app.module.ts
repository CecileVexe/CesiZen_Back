import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './Article/Article.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { EmotionModule } from './emotion/emotion.module';
import { CategoryModule } from './category/category.module';
import { StepModule } from './step/step.module';
import { ProgressionModule } from './progression/progression.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RoleModule } from './role/role.module';
import { FavoriteModule } from './favorite/favorite.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CommentModule,
    UserModule,
    ArticleModule,
    RoleModule,
    StepModule,
    ProgressionModule,
    ScheduleModule.forRoot(),
    CategoryModule,
    MessageModule,
    FavoriteModule,
    UserModule,
    EmotionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
