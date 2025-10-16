import { sanitizeStr } from './sanitize-str';

describe('saniteze str (unit)', () => {
  test('return empty string if not sent string', () => {
    // @ts-expect-error testing a function without parameter
    expect(sanitizeStr()).toBe('');
  });

  test('return empty strign if sent various types, but not a string', () => {
    // @ts-expect-error testing a function with a number type
    expect(sanitizeStr(123)).toBe('');
  });

  test('return string without space if have spaces in start or end', () => {
    expect(sanitizeStr('  a  ')).toBe('a');
  });

  test('Ensure string normalized with NFC', () => {
    const original = 'e\u0301';
    const expected = 'é';
    expect(expected).toBe(sanitizeStr(original));
  });
});
