/**
 * ScamShield AI - Heuristic Explainability & First-Pass Signal Engine
 * Extracts observable behavioral signals and provides local explainable fallback assessment.
 */

// Keyword rulesets for signal extraction
const URGENCY_PATTERNS = [
  /\b(immediately|urgent|urgently|suspended today|today|within \d+ hours?|blocked|deactivated|expire|tonight at|action required|final warning|last chance)\b/i,
  /\b(cut off|disconnect|terminate|freeze|frozen|penalty|arrest|closure)\b/i
];

const ACCOUNT_THREAT_PATTERNS = [
  /\b(account (will be|has been)? ?(suspended|blocked|frozen|closed|deactivated|terminated))\b/i,
  /\b(will result in account closure|service termination|permanent deactivation)\b/i
];

const KYC_CREDENTIAL_PATTERNS = [
  /\b(kyc|kyc verification|pan card|pan number|aadhaar|update kyc|complete your kyc|verify kyc)\b/i,
  /\b(otp|one time password|cvv|pin|mpin|password|net banking|login credentials|secret code)\b/i
];

const FINANCIAL_IMPERSONATION_PATTERNS = [
  /\b(bank account|net banking|bank|sbi|hdfc|icici|axis|chase|wells fargo|bank of america)\b/i,
  /\b(paypal|credit card|debit card|billing department|reserve bank|central bank)\b/i
];

const LINK_DIRECTIVE_PATTERNS = [
  /\b(click the link below|click here|visit link|follow this link|open this link|tap here|click immediately)\b/i
];

const FINANCIAL_LURE_PATTERNS = [
  /\b(earn \$\d+|guaranteed|risk-free|deposit \$\d+|profit|weekly roi|lottery|cash prize|won ₹|claim reward)\b/i,
  /\b(part-time job|rating hotel|like youtube|work from home \$\d+|cryptocurrency|usdt arbitrage)\b/i
];

const AUTHORITY_PATTERNS = [
  /\b(cbi|police|customs|cyber crime|electricity board|income tax|court notice)\b/i
];

/**
 * Extracts observable first-pass heuristic signals from raw message text.
 * Used as input for the server-side AI analysis layer.
 */
export function extractHeuristicSignals(text) {
  if (!text || typeof text !== 'string') return {};

  const clean = text.trim();
  const urlMatches = clean.match(/https?:\/\/[^\s]+/gi) || [];

  return {
    urgencyDetected: URGENCY_PATTERNS.some((p) => p.test(clean)),
    accountThreatDetected: ACCOUNT_THREAT_PATTERNS.some((p) => p.test(clean)),
    kycOrCredentialDetected: KYC_CREDENTIAL_PATTERNS.some((p) => p.test(clean)),
    financialImpersonationDetected: FINANCIAL_IMPERSONATION_PATTERNS.some((p) => p.test(clean)),
    linkDirectiveDetected: LINK_DIRECTIVE_PATTERNS.some((p) => p.test(clean)),
    financialLureDetected: FINANCIAL_LURE_PATTERNS.some((p) => p.test(clean)),
    authorityImpersonationDetected: AUTHORITY_PATTERNS.some((p) => p.test(clean)),
    urlCount: urlMatches.length,
    hasExplicitUrl: urlMatches.length > 0,
    textLength: clean.length
  };
}

/**
 * Analyzes a text message using the local heuristic engine.
 * Serves as the fallback when the AI layer is unavailable or unconfigured.
 */
export function analyzeTextMessage(text) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const cleanText = text.trim();
  const warningSigns = [];
  let calculatedScore = 10; // baseline safe score

  // 1. Check for Urgency & Coercive Deadline
  const urgencyMatches = cleanText.match(/\b(urgent|immediately|suspended today|today|within \d+ hours?|action required)\b/gi);
  if (urgencyMatches) {
    calculatedScore += 22;
    warningSigns.push({
      title: "Urgency & Artificial Deadline",
      severity: "HIGH",
      description: `Employs coercive urgency cues ("${urgencyMatches.slice(0, 2).join('", "')}") to pressure immediate action and inhibit calm verification.`
    });
  }

  // 2. Check for Account Suspension / Closure Threat
  const hasAccountThreat = ACCOUNT_THREAT_PATTERNS.some((p) => p.test(cleanText));
  if (hasAccountThreat) {
    calculatedScore += 26;
    warningSigns.push({
      title: "Account Suspension Threat",
      severity: "HIGH",
      description: "Directly threatens punitive consequences ('account will be suspended', 'result in account closure') to provoke fear and compliance."
    });
  }

  // 3. Check for KYC / Sensitive Credential Solicitation
  const hasKycOrSensitive = KYC_CREDENTIAL_PATTERNS.some((p) => p.test(cleanText));
  if (hasKycOrSensitive) {
    calculatedScore += 28;
    const isKyc = /kyc/i.test(cleanText);
    warningSigns.push({
      title: isKyc ? "KYC Verification Solicitation" : "Sensitive Credential Request",
      severity: "HIGH",
      description: isKyc
        ? "Requests KYC re-verification through an unsolicited communication channel, a classic precursor to credential theft."
        : "Mentions or solicits sensitive authentication identifiers (OTP, passwords, or banking security credentials)."
    });
  }

  // 4. Check for Financial / Banking Institution Impersonation
  const hasBank = FINANCIAL_IMPERSONATION_PATTERNS.some((p) => p.test(cleanText));
  if (hasBank) {
    calculatedScore += 16;
    warningSigns.push({
      title: "Financial Institution Impersonation",
      severity: "MEDIUM",
      description: "Purports to represent your bank or financial services provider without verifiable sender cryptographic signatures."
    });
  }

  // 5. Check for Link Directive vs Actual URL
  const urlMatches = cleanText.match(/https?:\/\/[^\s]+/gi);
  const hasLinkDirective = LINK_DIRECTIVE_PATTERNS.some((p) => p.test(cleanText));

  if (urlMatches && urlMatches.length > 0) {
    calculatedScore += 20;
    warningSigns.push({
      title: "Embedded External Link",
      severity: "HIGH",
      description: `Contains external web link (${urlMatches[0].slice(0, 45)}...) directing outside verified authentic bank channels.`
    });
  } else if (hasLinkDirective) {
    // Crucial: Note the directive without inventing a URL
    calculatedScore += 16;
    warningSigns.push({
      title: "External Link Action Directive",
      severity: "HIGH",
      description: "Instructs recipient to 'click the link below' to execute actions, bypassing standard verification procedures."
    });
  }

  // 6. Check for Unrealistic Financial Lures
  const hasLure = FINANCIAL_LURE_PATTERNS.some((p) => p.test(cleanText));
  if (hasLure) {
    calculatedScore += 24;
    warningSigns.push({
      title: "Unrealistic Financial Incentive",
      severity: "HIGH",
      description: "Prompts quick income, guaranteed investment returns, or abnormal payouts for minimal effort."
    });
  }

  // 7. Check for Authority Impersonation
  const hasAuthority = AUTHORITY_PATTERNS.some((p) => p.test(cleanText));
  if (hasAuthority) {
    calculatedScore += 22;
    warningSigns.push({
      title: "Legal & Authority Coercion",
      severity: "HIGH",
      description: "Cites regulatory, law enforcement, or utility entities to intimidate victim."
    });
  }

  // Score calibration (never 100% certainty)
  const score = Math.min(Math.max(calculatedScore, 8), 94);

  // Determine Risk Level & Category
  let riskLevel = "LOW";
  if (score >= 75) riskLevel = "CRITICAL";
  else if (score >= 50) riskLevel = "HIGH";
  else if (score >= 25) riskLevel = "MODERATE";

  let category = "Standard Communication";
  if (hasKycOrSensitive && (hasAccountThreat || urgencyMatches)) {
    category = "KYC & Bank Account Block Scam";
  } else if (hasLure) {
    category = "Part-Time Task & Investment Scam";
  } else if (hasAuthority) {
    category = "Authority & Utility Impersonation";
  } else if (score >= 50) {
    category = "Suspected Phishing / Social Engineering";
  }

  // Recommended Safety Actions
  const recommendedActions = [];
  if (score >= 50) {
    if (urlMatches && urlMatches.length > 0) {
      recommendedActions.push("Do NOT click the link provided in the message.");
    } else if (hasLinkDirective) {
      recommendedActions.push("Do NOT click any attached or subsequent links.");
    }
    recommendedActions.push("Do NOT share OTPs, passwords, or personal KYC identifiers.");
    recommendedActions.push("Verify independently by logging directly into your official banking app or calling the number printed on your debit card.");
    recommendedActions.push("Report the message to your cellular provider's spam reporting number (or national cybercrime portal).");
  } else if (score >= 25) {
    recommendedActions.push("Exercise caution with unsolicited messages requesting actions.");
    recommendedActions.push("Confirm the sender's identity through an established, independent channel.");
  } else {
    recommendedActions.push("Message displays normal conversational indicators with no immediate threats identified.");
    recommendedActions.push("Continue practicing standard digital security hygiene.");
  }

  return {
    engine: "heuristic",
    engineLabel: "Local Heuristic Analysis",
    assessmentType: "Heuristic Risk Assessment",
    riskScore: score,
    riskLevel,
    category,
    summary:
      score >= 70
        ? `Identified multiple high-risk indicators (${warningSigns.map((w) => w.title).slice(0, 2).join(", ")}). Strong evidence of social engineering.`
        : score >= 40
        ? "Contains notable indicators requiring caution before taking any action."
        : "No significant coercive language or suspicious patterns identified.",
    warningSigns,
    recommendedActions,
    confidence: 82,
    analyzedInput: cleanText,
    sourceType: "message",
    timestamp: new Date().toISOString()
  };
}

/**
 * Analyzes observable indicators of a URL.
 */
export function analyzeUrlIndicators(rawUrl) {
  if (!rawUrl || rawUrl.trim().length === 0) {
    return null;
  }

  let urlString = rawUrl.trim();
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = "https://" + urlString;
  }

  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    return {
      engine: "heuristic",
      engineLabel: "Local Heuristic Analysis",
      assessmentType: "Heuristic Risk Assessment",
      sourceType: "url",
      analyzedInput: rawUrl,
      riskScore: 60,
      riskLevel: "HIGH",
      category: "Malformed / Invalid URL Structure",
      summary: "The provided string cannot be parsed as a valid URL. Obfuscated URI strings are frequently used to evade standard URL inspection.",
      indicators: [
        { name: "Syntax Validation", status: "Fail", safe: false, note: "Unable to parse standardized domain syntax." }
      ],
      warningSigns: [
        {
          title: "Malformed URL Structure",
          severity: "HIGH",
          description: "URL is structured irregularly or uses non-standard encoding."
        }
      ],
      recommendedActions: [
        "Do not attempt to open this link in any web browser.",
        "Manually navigate to official websites via bookmarks or verified search."
      ],
      confidence: 90,
      timestamp: new Date().toISOString()
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const pathname = parsed.pathname;
  const warningSigns = [];
  const indicators = [];
  let score = 10; // baseline

  // 1. Transport Security (HTTPS)
  const isHttps = protocol === "https:";
  indicators.push({
    name: "Transport Security (HTTPS)",
    status: isHttps ? "Valid (HTTPS)" : "Unencrypted (HTTP)",
    safe: isHttps,
    note: isHttps ? "Connection is encrypted in transit." : "Unencrypted plain-text HTTP connection; highly atypical for modern authentication."
  });
  if (!isHttps) {
    score += 30;
    warningSigns.push({
      title: "Unencrypted Connection (HTTP)",
      severity: "HIGH",
      description: "The link uses unencrypted HTTP. Legitimate banking, tech, and payment portals require HTTPS."
    });
  }

  // 2. IP Address as Hostname
  const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  indicators.push({
    name: "Host Structure",
    status: isIpHost ? "Raw IP Address" : "Registered Domain Name",
    safe: !isIpHost,
    note: isIpHost ? "Uses raw numerical IP address instead of a recognized registered domain." : `Standard domain hierarchy: ${hostname}`
  });
  if (isIpHost) {
    score += 45;
    warningSigns.push({
      title: "Raw IP Hostname",
      severity: "HIGH",
      description: "Legitimate consumer services use registered domain names. Raw IP addresses are strongly correlated with transient phishing kits."
    });
  }

  // 3. High-Risk TLD
  const suspiciousTlds = [".xyz", ".top", ".online", ".click", ".buzz", ".work", ".live", ".support", ".account-update", ".link", ".tk", ".cf", ".ga"];
  const matchedTld = suspiciousTlds.find((tld) => hostname.endsWith(tld));
  indicators.push({
    name: "Top-Level Domain (TLD)",
    status: matchedTld ? `High-Churn TLD (${matchedTld})` : "Standard Domain TLD",
    safe: !matchedTld,
    note: matchedTld ? "Frequently abused by automated disposable phishing campaigns due to low acquisition cost." : "Common commercial or organizational TLD."
  });
  if (matchedTld) {
    score += 25;
    warningSigns.push({
      title: "High-Risk Top-Level Domain",
      severity: "HIGH",
      description: `Ends with '${matchedTld}', a TLD frequently associated with ephemeral phishing pages.`
    });
  }

  // 4. Brand Impersonation & Subdomain Confusion
  const brandKeywords = ["sbi", "hdfc", "paypal", "netflix", "apple", "google", "amazon", "chase", "bank", "microsoft", "usps", "fedex"];
  const foundBrands = brandKeywords.filter((b) => hostname.includes(b) || pathname.toLowerCase().includes(b));
  
  const parts = hostname.split(".");
  const rootDomain = parts.slice(-2).join(".");
  const brandInSubdomain = foundBrands.some((b) => hostname.includes(b) && !rootDomain.includes(b));

  if (brandInSubdomain) {
    score += 40;
    warningSigns.push({
      title: "Brand Subdomain Confusion",
      severity: "HIGH",
      description: `Contains brand name '${foundBrands.join(", ")}' in the subdomain prefix, while the actual registered parent domain is '${rootDomain}'.`
    });
    indicators.push({
      name: "Domain Mismatch",
      status: "Mismatch Detected",
      safe: false,
      note: `The root domain is '${rootDomain}', NOT an official domain for ${foundBrands.join(", ")}.`
    });
  } else if (foundBrands.length > 0) {
    indicators.push({
      name: "Brand Keyword Reference",
      status: `References: ${foundBrands.join(", ")}`,
      safe: rootDomain.includes("google.com") || rootDomain.includes("apple.com") || rootDomain.includes("amazon.com") || rootDomain.includes("netflix.com"),
      note: "URL contains recognized brand nomenclature."
    });
  }

  // 5. Suspicious Action Keywords in Path
  const actionKeywords = ["login", "verify", "update", "kyc", "billing", "renew", "account", "signin", "password", "wallet"];
  const foundActions = actionKeywords.filter((act) => pathname.toLowerCase().includes(act) || hostname.includes(act));
  if (foundActions.length > 0 && score > 20) {
    score += 15;
    warningSigns.push({
      title: "Credential Action Triggers",
      severity: "MEDIUM",
      description: `URL path solicits security actions (${foundActions.join(", ")}) on an unverified host.`
    });
  }

  const riskScore = Math.min(Math.max(score, 5), 96);
  let riskLevel = "LOW";
  if (riskScore >= 75) riskLevel = "CRITICAL";
  else if (riskScore >= 50) riskLevel = "HIGH";
  else if (riskScore >= 25) riskLevel = "MODERATE";

  const recommendedActions = [];
  if (riskScore >= 50) {
    recommendedActions.push("Do not open this URL or submit any credentials.");
    recommendedActions.push("Do not ignore browser SSL or security warnings if you already visited.");
    recommendedActions.push("Access the target service exclusively via bookmarks or verified search.");
  } else {
    recommendedActions.push("Domain displays standard structural indicators with no deceptive subdomains observed.");
    recommendedActions.push("Always verify the browser padlock icon and domain spelling before entering login details.");
  }

  return {
    engine: "heuristic",
    engineLabel: "Local Heuristic Analysis",
    assessmentType: "Heuristic Risk Assessment",
    sourceType: "url",
    analyzedInput: rawUrl,
    hostname,
    protocol,
    rootDomain,
    riskScore,
    riskLevel,
    category:
      riskScore >= 75
        ? "Suspected Brand Impersonation / Phishing URL"
        : riskScore >= 45
        ? "Suspicious Domain Structure"
        : "Standard Web Domain",
    summary:
      riskScore >= 60
        ? `Observable indicators (including ${warningSigns.map((w) => w.title).slice(0, 2).join(" and ")}) indicate a deceptive domain.`
        : "No structural mismatch, unencrypted transport, or deceptive subdomain patterns observed.",
    indicators,
    warningSigns,
    recommendedActions,
    confidence: 88,
    timestamp: new Date().toISOString()
  };
}
