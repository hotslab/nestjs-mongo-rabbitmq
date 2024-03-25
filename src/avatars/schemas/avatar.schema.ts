import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar {
  @Prop({ ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  file: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
