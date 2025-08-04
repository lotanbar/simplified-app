import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortLink, ShortLinkDocument } from './short-link.schema';

@Injectable()
export class ShortLinksService {
  constructor(@InjectModel(ShortLink.name) private shortLinkModel: Model<ShortLinkDocument>) {}

  async create(url: string, ownerKind: string, ownerId?: string): Promise<string> {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.shortLinkModel.create({
      code,
      url,
      ownerKind,
      ownerId,
      expiresAt,
    });

    return code;
  }

  async resolve(code: string): Promise<string> {
    const shortLink = await this.shortLinkModel.findOne({ code });

    if (!shortLink) {
      throw new NotFoundException('Short link not found');
    }

    if (shortLink.expiresAt && shortLink.expiresAt < new Date()) {
      await this.shortLinkModel.deleteOne({ code });
      throw new NotFoundException('Short link has expired');
    }

    return shortLink.url;
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}