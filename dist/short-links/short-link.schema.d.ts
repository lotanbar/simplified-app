import { Document, Types } from 'mongoose';
export declare class ShortLink {
    code: string;
    url: string;
    expiresAt?: Date;
    ownerId?: Types.ObjectId;
    ownerKind: string;
    createdAt: Date;
}
export declare const ShortLinkSchema: import("mongoose").Schema<ShortLink, import("mongoose").Model<ShortLink, any, any, any, Document<unknown, any, ShortLink, any, {}> & ShortLink & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ShortLink, Document<unknown, {}, import("mongoose").FlatRecord<ShortLink>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ShortLink> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type ShortLinkDocument = ShortLink & Document;
