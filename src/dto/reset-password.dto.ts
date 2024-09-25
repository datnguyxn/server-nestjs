export class ResetPasswordDto {
  email: string;
  newPassword: string;
  token: string;
  currentPassword: string;
}