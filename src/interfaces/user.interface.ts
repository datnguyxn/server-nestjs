import { Document } from 'mongoose';
import { UserRolesShared } from '../shared/user-roles.shared';

const TAG = 'User';
console.log(TAG);

export interface User extends Document {
  id?: string;
  email: string;
  password: string;
  userRole?: UserRolesShared;
}
