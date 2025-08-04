import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ShortLinksService } from './short-links.service';

@Controller('r')
export class ShortLinksController {
  constructor(private readonly shortLinksService: ShortLinksService) {}

  @Get(':code')
  async resolve(@Param('code') code: string, @Res() res: Response) {
    const url = await this.shortLinksService.resolve(code);
    return res.redirect(url);
  }
}