import { Document } from 'mongoose';

export interface ForgottenPassword extends Document {
  email: string;
  newPassword: string;
  timestamp: Date;
}
