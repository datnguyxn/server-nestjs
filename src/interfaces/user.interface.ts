import { Document } from 'mongoose';
import { UserRolesShared } from '../shared/user-roles.shared';

export interface User extends Document {
  id?: string;
  email: string;
  password: string;
  userRole?: UserRolesShared;
}