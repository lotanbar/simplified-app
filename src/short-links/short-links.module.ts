import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortLinksService } from './short-links.service';
import { ShortLinksController } from './short-links.controller';
import { ShortLink, ShortLinkSchema } from './short-link.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ShortLink.name, schema: ShortLinkSchema }])],
  controllers: [ShortLinksController],
  providers: [ShortLinksService],
  exports: [ShortLinksService],
})
export class ShortLinksModule {}