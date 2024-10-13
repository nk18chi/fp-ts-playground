/* eslint-disable no-console */
import * as ReadonlyArray from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Either, right, left, chain, fold } from 'fp-ts/Either';
import { Email } from '../../objects/Email.object';
import { Resolvers } from '../types';

const fpResolver: Resolvers = {
  Query: {
    fpts: async () => {
      const arr = ReadonlyArray.makeBy(5, (i) => i);
      console.log(arr);

      const validateEmail = (email: string): Either<Error, string> => {
        const hasAtSign = email.includes('@');
        return hasAtSign ? right(email) : left(new Error('Invalid email'));
      };

      pipe(
        validateEmail('aaa@example.com'),
        chain(() => validateEmail('b')),
        fold(
          (error) => console.error(error),
          (email) => console.log(email),
        ),
      );
      return true;
    },
    neverthrow: async () => {
      Email('aaa@example.com')
        .andThen(() => Email('bbb@example.com'))
        .match(console.log, console.error);
      Email('aaa@example.com')
        .andThen(() => Email('aaa'))
        .match(console.log, console.error);

      return true;
    },
  },
};

export default fpResolver;
