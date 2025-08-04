import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ShortLink {
  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: null })
  expiresAt?: Date;

  @Prop({ type: Types.ObjectId })
  ownerId?: Types.ObjectId;

  @Prop({ type: String, required: true })
  ownerKind: string;

  createdAt: Date;
}

export const ShortLinkSchema = SchemaFactory.createForClass(ShortLink);
ShortLinkSchema.index({ ownerId: 1, ownerKind: 1 });
export type ShortLinkDocument = ShortLink & Document;