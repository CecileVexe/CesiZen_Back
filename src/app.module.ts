import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JournalEntryModule } from './journal-entry/journal-entry.module';
import { EmotionModule } from './emotion/emotion.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RoleModule } from './role/role.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ArticleModule } from './article/article.module';
import { ArticleCategoryModule } from './articleCategory/articleCategory.module';
import { ImageModule } from './image/image.module';
import { JournalModule } from './journal/journal.module';
import { EmotionCategoryModule } from './emotionCategory/emotionCategory.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    ScheduleModule.forRoot(),
    FavoriteModule,
    UserModule,
    EmotionModule,
    JournalEntryModule,
    ArticleModule,
    ArticleCategoryModule,
    ImageModule,
    JournalModule,
    EmotionCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
