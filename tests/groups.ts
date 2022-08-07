import { createTSURLGroup, requiredString } from '../src';

describe('createTSURLGroup', () => {
  it('should return an object of functions that allow creating TSURLs with some options pre-configured', () => {
    const group = createTSURLGroup({
      baseURL: 'https://domain.com',
      basePath: '/api',
      trailingSlash: true,
    });

    expect(group).toEqual({
      createTSURL: expect.any(Function),
    });
  });

  describe('createTSURL', () => {
    it('should construct a TSURL that extends the group config', () => {
      const group = createTSURLGroup({
        baseURL: 'https://domain.com',
        basePath: '/api',
        trailingSlash: true,
      });

      const user = group.createTSURL(['users', requiredString('userId')]);

      expect(user.getPathTemplate()).toBe('/api/users/:userId/');
      expect(user.getURLTemplate()).toBe(
        'https://domain.com/api/users/:userId/'
      );
    });
  });
});
