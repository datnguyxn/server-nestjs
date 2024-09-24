import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CallbackWithoutResultAndOptionalError } from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  userRole: { type: String, required: true },
});


UserSchema.pre('save', async function(next: CallbackWithoutResultAndOptionalError) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.pre(
  'findOneAndUpdate',
  async function(next: CallbackWithoutResultAndOptionalError) {
    const updateFields = this.getUpdate();

    // Check if updateFields is an UpdateQuery object (i.e., a plain object with fields)
    if (
      updateFields &&
      typeof updateFields === 'object' &&
      !Array.isArray(updateFields)
    ) {
      const updateQuery = updateFields as any; // Explicitly casting to an object type for access

      // Check if password exists in the updateQuery
      if (updateQuery.password) {
        const password = updateQuery.password;

        try {
          const rounds = bcrypt.getRounds(password);

          // If password is not hashed yet, hash it
          if (rounds === 0) {
            updateQuery.password = await bcrypt.hash(password, 10);
          }
        } catch (error) {
          // Handle error in case bcrypt.getRounds fails
          updateQuery.password = await bcrypt.hash(password, 10);
        }
      }
    }

    return next();
  });