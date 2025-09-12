import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','employee'], required: true, index: true },
  name: { type: String }
}, { timestamps: true });

export type UserDoc = {
  _id: any; email: string; passwordHash: string; role: 'admin'|'employee'; name?: string;
};
export const User = model<UserDoc>('User', UserSchema);
