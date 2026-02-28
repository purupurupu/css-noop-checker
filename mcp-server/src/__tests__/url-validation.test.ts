import { describe, it, expect } from 'vitest';
import { isPrivateIPv4, isPrivateHost, validateUrl } from '../url-validation.ts';

describe('isPrivateIPv4', () => {
  it.each([
    ['127.0.0.1', true],
    ['127.255.255.255', true],
    ['10.0.0.1', true],
    ['10.255.255.255', true],
    ['172.16.0.1', true],
    ['172.31.255.255', true],
    ['192.168.0.1', true],
    ['192.168.255.255', true],
    ['169.254.1.1', true],
    ['0.0.0.0', true],
    ['0.1.2.3', true],
    // Public addresses
    ['8.8.8.8', false],
    ['172.15.0.1', false],
    ['172.32.0.1', false],
    ['192.167.0.1', false],
    ['1.1.1.1', false],
    // Non-IP strings
    ['not-an-ip', false],
    ['', false],
    ['999.999.999.999', false],
  ])('isPrivateIPv4(%s) → %s', (input, expected) => {
    expect(isPrivateIPv4(input)).toBe(expected);
  });
});

describe('isPrivateHost', () => {
  it.each([
    // Loopback names
    ['localhost', true],
    ['LOCALHOST', true],
    ['0.0.0.0', true],
    // IPv6 loopback/unspecified
    ['::1', true],
    ['::', true],
    // Bracketed IPv6
    ['[::1]', true],
    // IPv6-mapped IPv4 (dotted-quad form)
    ['::ffff:127.0.0.1', true],
    ['::ffff:10.0.0.1', true],
    ['::ffff:0:192.168.1.1', true],
    // IPv6-mapped IPv4 (hex form, as normalized by URL constructor)
    ['::ffff:7f00:1', true],
    ['::ffff:a00:1', true],
    ['::ffff:c0a8:101', true],
    ['::ffff:ac10:1', true],
    // IPv6-mapped public (hex form)
    ['::ffff:808:808', false],
    // Decimal notation (all-numeric)
    ['2130706433', true],
    ['0', true],
    // Private dotted-quad
    ['127.0.0.1', true],
    ['10.0.0.1', true],
    // Public addresses
    ['example.com', false],
    ['8.8.8.8', false],
    ['1.1.1.1', false],
    // IPv6-mapped public
    ['::ffff:8.8.8.8', false],
  ])('isPrivateHost(%s) → %s', (input, expected) => {
    expect(isPrivateHost(input)).toBe(expected);
  });
});

describe('validateUrl', () => {
  it('accepts valid http URLs', () => {
    expect(validateUrl('http://example.com')).toBe('http://example.com/');
  });

  it('accepts valid https URLs', () => {
    expect(validateUrl('https://example.com/path?q=1')).toBe('https://example.com/path?q=1');
  });

  it('normalizes URL via URL.href', () => {
    expect(validateUrl('HTTP://EXAMPLE.COM')).toBe('http://example.com/');
  });

  it('rejects malformed URLs', () => {
    expect(() => validateUrl('not-a-url')).toThrow('Invalid URL');
  });

  it('rejects file: scheme', () => {
    expect(() => validateUrl('file:///etc/passwd')).toThrow('Unsupported URL scheme');
  });

  it('rejects javascript: scheme', () => {
    expect(() => validateUrl('javascript:alert(1)')).toThrow('Unsupported URL scheme');
  });

  it('rejects ftp: scheme', () => {
    expect(() => validateUrl('ftp://example.com')).toThrow('Unsupported URL scheme');
  });

  it('rejects localhost', () => {
    expect(() => validateUrl('http://localhost:3000')).toThrow('private/internal address');
  });

  it('rejects 127.0.0.1', () => {
    expect(() => validateUrl('http://127.0.0.1')).toThrow('private/internal address');
  });

  it('rejects 10.x.x.x RFC-1918', () => {
    expect(() => validateUrl('http://10.0.0.1')).toThrow('private/internal address');
  });

  it('rejects IPv6 loopback', () => {
    expect(() => validateUrl('http://[::1]')).toThrow('private/internal address');
  });

  it('rejects IPv6-mapped private IPv4', () => {
    expect(() => validateUrl('http://[::ffff:127.0.0.1]')).toThrow('private/internal address');
  });

  it('rejects decimal IP notation', () => {
    expect(() => validateUrl('http://2130706433')).toThrow('private/internal address');
  });

  it('preserves error cause for malformed URLs', () => {
    try {
      validateUrl('not-a-url');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).cause).toBeDefined();
    }
  });
});
