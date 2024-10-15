import { Types } from 'mongoose';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import UserModel from './User.schema';
import { CreatedUser, User } from '../../entities/User.entity';

export const findUserById = (id: Types.ObjectId): ResultAsync<User, Error> =>
  ResultAsync.fromPromise(UserModel.findById(id), (err) => err as Error).andThen((user) => {
    if (!user) return errAsync(new Error('Database Error: User not found'));
    return okAsync(user);
  });

export const saveCreatedUser = (model: CreatedUser): ResultAsync<User, Error> =>
  ResultAsync.fromPromise(UserModel.create(model), (err) => err as Error);
