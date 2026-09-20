export const DEMO_MESSAGE_SAMPLES = [
  {
    id: "kyc-sms",
    title: "Bank KYC Block Threat",
    tag: "High Risk",
    riskCategory: "KYC & Bank Block Scam",
    text: "Dear Customer, Your HDFC/SBI Net Banking will be blocked within 24 hours due to pending KYC verification. Please click immediately http://hdfc-kyc-renewal.account-update.xyz/login to submit your PAN and update KYC to avoid permanent deactivation.",
    quickRisk: 94
  },
  {
    id: "job-telegram",
    title: "Telegram Part-Time Job",
    tag: "High Risk",
    riskCategory: "Part-Time Job Scam",
    text: "Congratulations! You have been shortlisted for our Amazon / YouTube global merchant review program. Work from home 30-45 minutes daily by liking video links and reviewing products. Earn $350 to $800 daily paid instantly to UPI/USDT. Contact manager on Telegram @EarnFast2025 now. Limited slots!",
    quickRisk: 88
  },
  {
    id: "delivery-sms",
    title: "USPS / FedEx Package Detained",
    tag: "Medium Risk",
    riskCategory: "Delivery & Postal Scam",
    text: "USPS Notice: Your package #US94001009827 could not be dispatched due to an incorrect postal address. Please confirm your delivery details and pay the redelivery surcharge of $1.50 at https://usps-parcel-tracking-fix.info/status within 12 hours.",
    quickRisk: 82
  },
  {
    id: "electricity-urgent",
    title: "Electricity Power Disconnection",
    tag: "High Risk",
    riskCategory: "Government & Utility Impersonation",
    text: "URGENT ELECTRICITY ALERT: Dear Consumer, your electricity power connection will be cut off tonight at 9:30 PM from the power office because your previous month bill was not updated. Please immediately contact our power officer at 98112-44589 to avoid disconnection.",
    quickRisk: 91
  },
  {
    id: "safe-calendar",
    title: "Safe Corporate Meeting Invite",
    tag: "Low Risk",
    riskCategory: "Legitimate Communication",
    text: "Hi team, quick reminder about our product sync scheduled for tomorrow, Thursday at 2:00 PM EST via Google Meet. Please review the updated design spec in Google Drive prior to the call. Let me know if you need to reschedule.",
    quickRisk: 12
  }
];

export const DEMO_URL_SAMPLES = [
  {
    id: "url-bank-phish",
    title: "Lookalike Bank KYC Portal",
    url: "http://sbi-secure-kyc-update.account-verify.online/login.php",
    type: "Phishing Attempt",
    risk: 95
  },
  {
    id: "url-netflix",
    title: "Fake Netflix Billing Portal",
    url: "http://netflix-billing-renew-support.top/auth/update",
    type: "Credential Harvester",
    risk: 92
  },
  {
    id: "url-ip",
    title: "Raw IP Address Login Page",
    url: "http://185.220.101.5:8080/paypal/webscr/login",
    type: "Severe Suspicious Indicator",
    risk: 96
  },
  {
    id: "url-safe",
    title: "Official Google Accounts Domain",
    url: "https://accounts.google.com/signin/v2/identifier",
    type: "Legitimate Domain",
    risk: 5
  }
];

export const DEMO_VOICE_SAMPLES = [
  {
    id: "vishing-bank-fraud",
    title: "Bank Fraud Impersonation Call",
    tag: "High Risk",
    caller: "Fake Bank Security Desk",
    text: "Hello, this is Officer Mark Jenkins from the Fraud Prevention Unit at your bank. We have flagged two unauthorized international wire transfers of $1,450 attempted from an unknown IP address. To halt this transaction immediately, do not disconnect this call and read out the six-digit one-time security code sent to your mobile phone right now.",
    quickRisk: 95
  },
  {
    id: "vishing-arrest-warrant",
    title: "Law Enforcement Arrest Threat",
    tag: "High Risk",
    caller: "Fake Law Enforcement Agent",
    text: "This is a priority notification from the Department of Revenue and Law Enforcement. An active federal arrest warrant has been executed under your identity for tax evasion and fraudulent offshore accounts. Stay on the line or local law enforcement officers will be dispatched to your home address within 30 minutes to take you into custody.",
    quickRisk: 96
  },
  {
    id: "vishing-grandchild",
    title: "Emergency Grandchild Bail Scam",
    tag: "High Risk",
    caller: "Impersonated Relative",
    text: "Grandma, please don't tell mom and dad! I was in a terrible car accident and the police arrested me because someone left illegal items in the glove box. My public defender says if you can wire $2,500 bail money right now via MoneyGram or gift cards, I will be released immediately today. Please hurry, I'm scared!",
    quickRisk: 92
  },
  {
    id: "vishing-safe-appointment",
    title: "Legitimate Clinic Appointment Call",
    tag: "Low Risk",
    caller: "Official Medical Clinic",
    text: "Hello, this is a courtesy reminder from Dr. Miller's clinic confirming your routine checkup scheduled for tomorrow, Thursday at 2:00 PM. Please call our official clinic desk at 555-0144 if you need to confirm or reschedule. Thank you and have a wonderful day.",
    quickRisk: 8
  }
];

