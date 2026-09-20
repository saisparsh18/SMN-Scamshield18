/**
 * ScamShield AI - Deterministic URL Security Inspector
 * Extracts objective, verifiable technical signals without guessing or inventing data.
 */

export function inspectUrlSignals(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return { valid: false, error: 'Empty URL provided' };
  }

  let urlString = rawUrl.trim();
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = 'https://' + urlString;
  }

  let parsed;
  try {
    parsed = new URL(urlString);
  } catch (err) {
    return {
      valid: false,
      rawUrl,
      error: 'Malformed URL syntax: ' + err.message
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const port = parsed.port;
  const pathname = parsed.pathname;
  const search = parsed.search;
  const hash = parsed.hash;
  const username = parsed.username;
  const password = parsed.password;

  // 1. Transport Security (HTTPS)
  const isHttps = protocol === 'https:';

  // 2. IP-Address Hostname Check (IPv4 and IPv6)
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIpv6 = /^\[?[a-f0-9:]+\]?$/i.test(hostname) && hostname.includes(':');
  const isIpHost = isIpv4 || isIpv6;

  // 3. Punycode / IDN Homograph check
  const isPunycode = hostname.includes('xn--');

  // 4. Port analysis (standard 80/443 vs unusual ports)
  const hasUnusualPort = port !== '' && port !== '80' && port !== '443';

  // 5. Subdomain depth analysis
  const domainParts = hostname.split('.');
  const subdomainCount = Math.max(domainParts.length - 2, 0);
  const hasExcessiveSubdomains = subdomainCount > 2;

  // 6. Obfuscation checks
  const hasUserAuthObfuscation = Boolean(username || password || rawUrl.includes('@'));
  const hasEncodedChars = /%[0-9a-f]{2}/i.test(pathname) || /%[0-9a-f]{2}/i.test(hostname);
  const hyphenCount = (hostname.match(/-/g) || []).length;
  const hasExcessiveHyphens = hyphenCount >= 3;

  // 7. Security and Brand Keyword analysis (Domain vs Path)
  const securityKeywords = [
    'secure', 'kyc', 'verify', 'verification', 'login', 'signin', 'auth', 
    'account', 'banking', 'update', 'wallet', 'password', 'recover', 'billing', 'confirm'
  ];
  const matchedDomainKeywords = securityKeywords.filter((kw) => hostname.includes(kw));
  const matchedPathKeywords = securityKeywords.filter((kw) => pathname.toLowerCase().includes(kw));

  // 8. TLD Analysis (high-churn / low-cost domains)
  const suspiciousTlds = ['.xyz', '.top', '.online', '.click', '.buzz', '.work', '.live', '.support', '.link', '.tk', '.cf', '.ga', '.ml', '.bid', '.trade', '.icu'];
  const matchedTld = suspiciousTlds.find((tld) => hostname.endsWith(tld)) || null;

  return {
    valid: true,
    rawUrl,
    normalizedUrl: parsed.href,
    protocol,
    isHttps,
    hostname,
    port: port || (isHttps ? '443' : '80'),
    hasUnusualPort,
    pathname,
    search,
    hash,
    isIpHost,
    isPunycode,
    subdomainCount,
    hasExcessiveSubdomains,
    hasUserAuthObfuscation,
    hasEncodedChars,
    hyphenCount,
    hasExcessiveHyphens,
    matchedDomainKeywords,
    matchedPathKeywords,
    matchedTld
  };
}

/**
 * Builds standardized observable indicator cards from the extracted signals.
 */
export function buildObservableIndicators(signals) {
  if (!signals || !signals.valid) {
    return [
      {
        name: 'URL Syntax Validation',
        status: 'Malformed',
        safe: false,
        note: signals ? signals.error : 'Invalid URL structure'
      }
    ];
  }

  const indicators = [];

  // Protocol indicator
  indicators.push({
    name: 'Transport Security (HTTPS)',
    status: signals.isHttps ? 'Valid (HTTPS)' : 'Unencrypted (HTTP)',
    safe: signals.isHttps,
    note: signals.isHttps 
      ? 'Connection traffic is encrypted in transit.' 
      : 'Unencrypted plain HTTP. Highly unsafe for credential or identity input.'
  });

  // Host Structure indicator
  indicators.push({
    name: 'Host Structure',
    status: signals.isIpHost ? 'Raw IP Address' : 'Registered Domain',
    safe: !signals.isIpHost,
    note: signals.isIpHost 
      ? 'Uses numerical IP address directly, bypassing standard DNS name registration.' 
      : `Host: ${signals.hostname}`
  });

  // Punycode indicator
  if (signals.isPunycode) {
    indicators.push({
      name: 'Punycode / IDN Homograph',
      status: 'Punycode Detected',
      safe: false,
      note: 'Uses xn-- internationalized domain encoding, frequently employed to impersonate trusted letters with lookalike Cyrillic/Greek characters.'
    });
  }

  // Unusual Port indicator
  if (signals.hasUnusualPort) {
    indicators.push({
      name: 'Network Port',
      status: `Non-Standard (${signals.port})`,
      safe: false,
      note: `Traffic is routed to unusual port :${signals.port} instead of standard HTTPS port 443.`
    });
  }

  // Deceptive Keywords indicator
  if (signals.matchedDomainKeywords.length > 0 || signals.matchedPathKeywords.length > 0) {
    const combined = [...new Set([...signals.matchedDomainKeywords, ...signals.matchedPathKeywords])];
    indicators.push({
      name: 'High-Trust Keyword Usage',
      status: `Matches: [${combined.join(', ')}]`,
      safe: false,
      note: `Employs security/credential keywords (${combined.join(', ')}) in domain or path.`
    });
  } else {
    indicators.push({
      name: 'Keyword Context',
      status: 'Standard Vocabulary',
      safe: true,
      note: 'No prominent banking, authentication, or KYC lures embedded in URL syntax.'
    });
  }

  // TLD indicator
  indicators.push({
    name: 'Top-Level Domain (TLD)',
    status: signals.matchedTld ? `High-Churn TLD (${signals.matchedTld})` : 'Standard TLD',
    safe: !signals.matchedTld,
    note: signals.matchedTld 
      ? `Ends with ${signals.matchedTld}, a top-level domain frequently associated with short-lived phishing campaigns.`
      : 'Common commercial or organizational top-level domain.'
  });

  return indicators;
}
