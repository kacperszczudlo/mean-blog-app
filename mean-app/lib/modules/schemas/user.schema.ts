import { Schema, model } from 'mongoose';
import { IUser } from '../models/user.model';

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const UserModel = model<IUser>('User', UserSchema);

UserModel.collection.dropIndex('login_1').catch(() => {});

export default UserModel;
