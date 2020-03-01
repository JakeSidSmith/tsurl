import createTSURL, { optionalString, requiredString, TSURL } from '../src';

describe('createTSURL', () => {
  it('should construct a TSURL', () => {
    const url1 = createTSURL(
      [
        '/api/test/',
        requiredString('required'),
        optionalString('optional'),
        '///end',
      ],
      { trailingSlash: true }
    );

    expect(url1 instanceof TSURL).toBe(true);
  });
});
