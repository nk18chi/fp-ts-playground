import { ok, Result } from 'neverthrow';
import {
  InvalidatedUserCommand as InvalidatedUserCommandEntity,
  ValidatedUserCommand as ValidatedUserCommandEntity,
  UpdatedUser as UpdatedUserEntity,
} from '../entities/User.entity';
import { validateUser } from './createUser.workflows';

type ValidatedUserCommand = (command: InvalidatedUserCommandEntity) => Result<ValidatedUserCommandEntity, Error>;

const validateUserCommand: ValidatedUserCommand = (command) => {
  const validatedUser = validateUser(command.invalidatedUser);
  const values = Result.combine([validatedUser]);
  return values.map(([validatedUserResult]) => ({
    validatedUser: validatedUserResult,
    user: command.user,
  }));
};

type UpdatedUserCommand = (command: ValidatedUserCommandEntity) => Result<UpdatedUserEntity, Error>;

const updateUserCommand: UpdatedUserCommand = (command) => {
  const user: UpdatedUserEntity = {
    ...command.user,
    ...command.validatedUser,
    kind: 'UpdatedUser',
  };
  return ok(user);
};

// workflow: invalidatedUserCommand => validatedUserCommand => updatedUser
type UpdateUserWorkflow = (command: InvalidatedUserCommandEntity) => Result<UpdatedUserEntity, Error>;
export const updateUserWorkflow: UpdateUserWorkflow = (command) =>
  ok(command).andThen(validateUserCommand).andThen(updateUserCommand);
