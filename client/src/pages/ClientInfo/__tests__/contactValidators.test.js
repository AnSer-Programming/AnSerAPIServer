import { normalizeContactValue, validateContactValue } from '../utils/contactValidators';

describe('contactValidators', () => {
  test('normalizeContactValue prefixes @ for twitter-like types', () => {
    const res = normalizeContactValue('x-twitter', 'myhandle');
    expect(res.value).toBe('@myhandle');
    expect(res.changed).toBe(true);
  });

  test('normalizeContactValue leaves @ intact', () => {
    const res = normalizeContactValue('twitter', '@already');
    expect(res.value).toBe('@already');
    expect(res.changed).toBe(false);
  });

  test('validateContactValue requires leading @ for twitter', () => {
    const v1 = validateContactValue('twitter', 'nope');
    expect(v1.valid).toBe(false);
    expect(v1.reason).toMatch(/must start with/);

    const v2 = validateContactValue('twitter', '@ok');
    expect(v2.valid).toBe(true);
  });

  test('normalizeContactValue adds https:// for website', () => {
    const res = normalizeContactValue('website', 'example.com');
    expect(res.value.startsWith('https://')).toBe(true);
  });
});
