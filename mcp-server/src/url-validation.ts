/** Check whether a dotted-quad IPv4 address falls in a private/reserved range. */
export function isPrivateIPv4(dottedQuad: string): boolean {
  const parts = dottedQuad.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!parts) return false;
  const [, a, b] = parts.map(Number);
  if (a === 127) return true; // 127.0.0.0/8   loopback
  if (a === 10) return true; //  10.0.0.0/8    RFC-1918
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 RFC-1918
  if (a === 192 && b === 168) return true; // 192.168.0.0/16 RFC-1918
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local / cloud metadata
  if (a === 0) return true; //   0.0.0.0/8     "this" network
  return false;
}

/** Reject hostnames that resolve to private/loopback/link-local addresses (SSRF mitigation). */
export function isPrivateHost(hostname: string): boolean {
  // Strip IPv6 brackets
  const host = hostname.startsWith('[') ? hostname.slice(1, -1) : hostname;
  const lower = host.toLowerCase();

  // Well-known loopback / unspecified names
  if (lower === 'localhost' || lower === '0.0.0.0') return true;

  // IPv6 loopback / unspecified
  if (lower === '::1' || lower === '::') return true;

  // IPv6-mapped IPv4 (dotted-quad form) — e.g. ::ffff:127.0.0.1 or ::ffff:0:127.0.0.1
  const v4Mapped = lower.match(/^::ffff:(?:0:)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (v4Mapped && isPrivateIPv4(v4Mapped[1])) return true;

  // IPv6-mapped IPv4 (hex form, as normalized by URL constructor) — e.g. ::ffff:7f00:1
  const v4Hex = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (v4Hex) {
    const hi = parseInt(v4Hex[1], 16);
    const lo = parseInt(v4Hex[2], 16);
    const quad = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
    if (isPrivateIPv4(quad)) return true;
  }

  // Decimal-notation IPv4 — browsers resolve all-numeric hostnames as 32-bit IPs
  if (/^\d+$/.test(host)) return true;

  // Dotted-quad IPv4
  if (isPrivateIPv4(host)) return true;

  return false;
}

/**
 * Parse and validate a URL for safe use with Playwright.
 * Rejects non-http(s) schemes and private/internal hostnames (SSRF mitigation).
 * @returns The normalized URL string (via URL.href).
 * @throws {Error} If the URL is malformed, uses a forbidden scheme, or targets a private address.
 */
export function validateUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch (err) {
    throw new Error(`Invalid URL: ${url}`, { cause: err });
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `Unsupported URL scheme "${parsed.protocol}". Only http: and https: are allowed.`,
    );
  }
  if (isPrivateHost(parsed.hostname)) {
    throw new Error(`Access to private/internal address "${parsed.hostname}" is not allowed.`);
  }
  return parsed.href;
}
