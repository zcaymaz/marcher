import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenuModule } from './menu/menu.module';
import { BlogModule } from './blog/blog.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ReferencesModule } from './references/references.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FranchiseModule } from './franchise/franchise.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { UploadModule } from './upload/upload.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    MenuModule,
    BlogModule,
    CampaignsModule,
    ReferencesModule,
    ReviewsModule,
    FranchiseModule,
    SiteSettingsModule,
    UploadModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
