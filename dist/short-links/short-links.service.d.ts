import { Model } from 'mongoose';
import { ShortLinkDocument } from './short-link.schema';
export declare class ShortLinksService {
    private shortLinkModel;
    constructor(shortLinkModel: Model<ShortLinkDocument>);
    create(url: string, ownerKind: string, ownerId?: string): Promise<string>;
    resolve(code: string): Promise<string>;
    private generateCode;
}
