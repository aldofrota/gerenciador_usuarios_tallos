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
  role: {
    type: String,
    default: 'user',
  },

  permissions: {
    type: Object,
    default: {
      register: false,
      remove: false,
      update_user: false,
    },
  },
});
