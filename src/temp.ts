import {
  createTSURLGroup,
  requiredString,
  requiredEnum,
  // requiredEnumArray,
  // optionalEnum,
  // optionalEnumArray,
  optionalString,
} from '.';

const api = createTSURLGroup({
  trailingSlash: true,
  normalize: true,
  baseURL: 'http://localhost',
  basePath: '/api',
});

// enum Things {
//   THING_ONE = 'thing1',
//   THING_TWO = 'thing2',
//   THING_THREE = 'thing3',
// }

// enum Things {
//   THING_ONE,
//   THING_TWO,
//   THING_THREE,
// }

enum Things {
  THING_ONE = 1,
  THING_TWO = 'TWO',
  THING_THREE = 3,
  THING_FOUR,
  THING_FIVE,
}

export const test = api.createTSURL([
  'invite',
  'company',
  requiredString('companyId'),
  'user',
  requiredString('userId'),
  optionalString('optional'),
  requiredEnum('inviteToken', Things),
  // optionalEnum('inviteToken', ['one', 'two', 'three'] as const),
]);

const url = test.constructURL(
  {
    companyId: 'test',
    userId: 'yest',
    inviteToken: Things.THING_TWO,
    // inviteToken: 'one',
    // inviteToken: 'thing1',
  },
  {}
);

test.deconstruct(url); //?
