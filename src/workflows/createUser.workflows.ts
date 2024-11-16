import { Types } from 'mongoose';
import { ok, Result } from 'neverthrow';
import { CreatedUser, InvalidatedUser, ValidatedUser as ValidatedUserEntity } from '../entities/User.entity';
import { UserStatus } from '../graphql/types';

type ValidatedUser = (model: InvalidatedUser) => Result<ValidatedUserEntity, Error>;

export const validateUser: ValidatedUser = (model) =>
  ok({
    ...model,
    kind: 'ValidatedUser',
  });

type CreateUser = (model: ValidatedUserEntity) => Result<CreatedUser, Error>;

export const createUser: CreateUser = (model) =>
  ok({
    ...model,
    kind: 'CreatedUser',
    _id: new Types.ObjectId(),
    status: UserStatus.Active,
  });

// workflow: invalidatedUser => validatedUser => createdUser
type CreateUserWorkflow = (model: InvalidatedUser) => Result<CreatedUser, Error>;
export const createUserWorkflow: CreateUserWorkflow = (model) => ok(model).andThen(validateUser).andThen(createUser);
