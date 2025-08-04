import { Response } from 'express';
import { ShortLinksService } from './short-links.service';
export declare class ShortLinksController {
    private readonly shortLinksService;
    constructor(shortLinksService: ShortLinksService);
    resolve(code: string, res: Response): Promise<void>;
}
