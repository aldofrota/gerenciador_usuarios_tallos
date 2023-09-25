// user.schema.ts
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: {
    type: String,
    unique: true,
    require: true,
  },
  level: {
    type: String,
    default: 'User',
  },
});
