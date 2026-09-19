export const SCAM_CATEGORIES = [
  {
    id: "phishing",
    title: "Phishing & Credential Harvesters",
    tag: "High Volume",
    severity: "High",
    icon: "FishHook",
    summary: "Deceptive emails, SMS (smishing), or websites designed to trick you into entering login credentials, passwords, or credit card details.",
    howItWorks: [
      "Attacker sends an email/SMS pretending to be Netflix, Google, Apple, or your bank.",
      "Claims your account is locked, payment failed, or unusual login was detected.",
      "Provides a link to a cloned fake login page that steals your submitted credentials."
    ],
    redFlags: [
      "Urgent threats: 'Your account will be suspended in 24 hours'",
      "Sender domain looks slightly off (e.g., support@netflix-update-billing.com)",
      "Generic greetings like 'Dear Customer' instead of your name",
      "Login links leading to mismatched domains or raw IP addresses"
    ],
    realExample: "NETFLIX ALERT: We were unable to process your monthly subscription payment. Update your billing information within 12 hours at netflix-billing-verify.com/renew to avoid service termination.",
    preventionTips: [
      "Never click billing or reset links in unsolicited emails or SMS.",
      "Open your browser and navigate directly to the service's official website or app.",
      "Enable Multi-Factor Authentication (MFA/2FA) with an authenticator app, not SMS."
    ]
  },
  {
    id: "kyc",
    title: "KYC & Bank Account Block Scams",
    tag: "Banking",
    severity: "Critical",
    icon: "ShieldAlert",
    summary: "Targeted SMS or calls impersonating leading banks claiming your PAN, Aadhaar, or KYC verification has expired and your bank account is blocked.",
    howItWorks: [
      "Victim receives an SMS stating their savings account or credit card has been deactivated.",
      "A short URL or phone number is provided to 'complete KYC online' immediately.",
      "Victim is prompted to download an APK or enter net-banking user ID, password, and incoming OTPs.",
      "Scammers drain the account via instant UPI or NEFT transfers."
    ],
    redFlags: [
      "SMS sent from personal 10-digit phone numbers rather than official bank SMS headers",
      "Immediate deadline ('within 2 hours') to prevent account freezing",
      "Requests to download remote-access apps (AnyDesk, TeamViewer) or unofficial APK files",
      "Requests for OTPs under the guise of 'verification' or 're-activating account'"
    ],
    realExample: "Dear Customer, Your SBI/HDFC Bank Account has been blocked today due to pending PAN/KYC update. Please update immediately by clicking here: http://bit.ly/bank-kyc-update2025 to keep services active.",
    preventionTips: [
      "Banks NEVER ask you to update KYC via third-party links or WhatsApp.",
      "Physical verification or authenticated official mobile banking apps are the only legitimate KYC channels.",
      "Never share OTP, MPIN, or debit card CVV with anyone, even if they claim to be bank officials."
    ]
  },
  {
    id: "job",
    title: "Part-Time & Remote Job Scams",
    tag: "Social Engineering",
    severity: "High",
    icon: "Briefcase",
    summary: "Offers for lucrative remote work—such as liking YouTube videos, rating hotels, or simple data entry—promising $200–$1,000/day for minimal effort.",
    howItWorks: [
      "Recruiter reaches out unprompted on WhatsApp, Telegram, or LinkedIn.",
      "Offers high pay for simple micro-tasks (e.g., 'Like 3 YouTube videos, earn $30').",
      "Pays a small initial reward ($10-$20) to build trust.",
      "Requires user to join a VIP 'prepaid task' tier where they must deposit their own money first to unlock higher earnings, then locks withdrawals."
    ],
    redFlags: [
      "Unsolicited job offer via WhatsApp or Telegram without any formal interview",
      "Promise of disproportionately high pay ($300+/day) for basic tasks",
      "Demand for upfront 'security deposit', 'equipment fee', or 'crypto transfer'",
      "Communication conducted entirely through encrypted group chats"
    ],
    realExample: "Hello! I am Sarah, HR Director at Global Talent Media. We have flexible part-time remote roles rating Google Maps places and liking YouTube videos. Work 30-60 mins daily, earn $300-$800/day. Reply YES to start.",
    preventionTips: [
      "Legitimate employers never ask you to pay money to get paid.",
      "Verify company credentials and job postings directly on official company career portals.",
      "Block unprompted job solicitations from unknown foreign numbers (+62, +234, etc.)."
    ]
  },
  {
    id: "payment",
    title: "UPI & Overpayment / QR Code Scams",
    tag: "UPI / Financial",
    severity: "Critical",
    icon: "CreditCard",
    summary: "Scammers trick victims into scanning a QR code or entering their UPI PIN under the false pretense of 'receiving' money or refunds.",
    howItWorks: [
      "Scammer poses as a buyer on OLX/marketplace or claims to offer a merchant cashback.",
      "Sends a QR code or payment collect request claiming 'Scan and enter PIN to receive ₹5,000 credit'.",
      "As soon as victim enters PIN, money is debited from their account instead of credited."
    ],
    redFlags: [
      "Entering a UPI PIN to 'receive' money (UPI PIN is ONLY needed to SEND money)",
      "Buyer agrees to purchase an item without bargaining or inspecting it",
      "Requests to test a transaction with ₹1 or ₹5 first",
      "Payment collect requests disguised as refund requests"
    ],
    realExample: "Hi, I am interested in buying your furniture posted on marketplace. I will pay advance via Google Pay QR. Scan this QR code and enter your PIN to immediately credit ₹15,000 to your account.",
    preventionTips: [
      "GOLDEN RULE: You NEVER need to enter your UPI PIN or scan a QR code to receive money.",
      "Reject payment requests from unverified buyers insisting on UPI collect requests.",
      "Immediately report unauthorized debits to cybercrime portal (e.g., 1930 in India or IC3)."
    ]
  },
  {
    id: "investment",
    title: "Crypto & High-Yield Investment Scams",
    tag: "High Loss",
    severity: "Critical",
    icon: "TrendingUp",
    summary: "Guaranteed high returns on cryptocurrency, forex, or algorithmic trading through fake investment dashboards and fabricated profit graphs.",
    howItWorks: [
      "Scammer meets victim on social media or dating apps ('pig butchering').",
      "Introduces an exclusive, insider trading platform with 'guaranteed 20% weekly ROI'.",
      "The custom trading website shows huge simulated profits.",
      "When victim tries to withdraw, the platform demands heavy 'taxes' or 'withdrawal clearance fees' before freezing everything."
    ],
    redFlags: [
      "Promises of 'guaranteed', 'risk-free' returns that beat market standards",
      "Unregulated offshore trading platforms without licensed broker registration",
      "Demand to transfer funds exclusively via crypto (USDT, BTC) or wire to personal accounts",
      "Inability to withdraw funds without paying exorbitant additional fees"
    ],
    realExample: "VIP Insider Signal Group: Our proprietary AI bot yields 18.5% guaranteed weekly profit on automated crypto arbitrage. Deposit $500 now and receive $2,450 by Friday. 100% principal protected.",
    preventionTips: [
      "There is no such thing as guaranteed high-yield investment without high risk.",
      "Check registered financial regulators (SEC, SEBI, FCA) before depositing funds.",
      "Never trust investment advice from strangers met on Instagram, Tinder, or Telegram."
    ]
  },
  {
    id: "support",
    title: "Fake Customer Support & Tech Support",
    tag: "Impersonation",
    severity: "High",
    icon: "Headphones",
    summary: "Fake helpline numbers posted on Google Maps, search engines, or fake error screens claiming your PC or account has a virus or payment glitch.",
    howItWorks: [
      "User searches Google for customer support (e.g., airline refund, Amazon delivery, printer help).",
      "Calls a spoofed SEO-poisoned phone number operated by scammers.",
      "Scammer instructs victim to install remote desktop software (TeamViewer, AnyDesk).",
      "Scammer blacks out the screen and steals stored banking passwords or initiates transfers."
    ],
    redFlags: [
      "Phone numbers found via casual web search that don't match the official website contact page",
      "Support agent requesting remote desktop installation for a simple billing or delivery issue",
      "Aggressive scare tactics: 'Your computer is sending spam to the dark web'",
      "Demands for payment via gift cards (Apple, Amazon) or direct wire"
    ],
    realExample: "MICROSOFT CRITICAL ALERT: Windows Defender detected Trojan:Win32/Spyware. Call certified Windows Support immediately at +1-800-555-0199. Do not restart your computer or your data will be permanently wiped.",
    preventionTips: [
      "Only obtain support phone numbers and chat from within the official verified app or domain.",
      "Never grant remote desktop control to someone who unsolicitedly contacted you or from an unverified number.",
      "Real tech support teams never ask for payment in gift cards or cryptocurrency."
    ]
  },
  {
    id: "delivery",
    title: "Package & Delivery Rescheduling Scams",
    tag: "High Volume",
    severity: "Medium",
    icon: "Package",
    summary: "Fake notifications from DHL, FedEx, USPS, or India Post claiming a package cannot be delivered due to an incorrect address or unpaid customs fee.",
    howItWorks: [
      "Victim receives an automated SMS: 'Your parcel is detained at distribution hub due to missing street number'.",
      "A link points to a lookalike postal tracking site.",
      "Site asks for updated address details and a trivial $0.99 or ₹25 're-delivery fee'.",
      "Once credit card details are entered, recurring unauthorized charges or card cloning occurs."
    ],
    redFlags: [
      "You were not expecting any package delivery or the courier name is generic",
      "Tracking URL does not use the courier's official domain (e.g., usps-redelivery-hub.info)",
      "Urgency countdown timer forcing immediate payment to avoid parcel return",
      "SMS comes from an overseas or random personal number"
    ],
    realExample: "USPS Notice: Your package could not be delivered on 09/19 due to an incomplete street address. Please update your details and pay the $1.25 redelivery fee at usps-redelivery-address-update.com/track within 24 hours.",
    preventionTips: [
      "Check tracking numbers directly on the courier's authentic app or website (fedex.com, usps.com).",
      "Legitimate postal carriers do not send SMS from personal numbers requesting fee payments.",
      "Inspect the URL carefully before entering any card or address information."
    ]
  },
  {
    id: "impersonation",
    title: "Executive & Government Impersonation",
    tag: "Authority Coercion",
    severity: "Critical",
    icon: "UserX",
    summary: "Scammers pose as law enforcement (CBI, Police, IRS), utility boards (electricity cutoff), or corporate executives requesting urgent wire transfers.",
    howItWorks: [
      "Attacker calls or messages impersonating a police officer or court official ('Digital Arrest').",
      "Claims victim's identity is tied to an illegal narcotics package or money laundering case.",
      "Pressures victim via video call in a fake police station setup to transfer funds to a 'government verification account'.",
      "Or sends an urgent SMS threatening power disconnection tonight at 9:30 PM due to an unpaid bill."
    ],
    redFlags: [
      "Threats of immediate arrest, deportation, or power disconnection within hours",
      "Demand for confidentiality: 'Do not speak to family or consult a lawyer'",
      "Payment requested through untraceable channels or personal accounts",
      "Officials conducting formal interrogations or settlements over Skype/WhatsApp video calls"
    ],
    realExample: "URGENT ELECTRICITY BOARD: Your power supply will be disconnected tonight at 9:30 PM from the power office because your previous month's bill was not updated. Immediately contact our officer at 98765-XXXXX.",
    preventionTips: [
      "There is NO legal concept of 'Digital Arrest'. Law enforcement never conducts trials over video call.",
      "Utility providers never dispatch personal phone numbers threatening same-night disconnection.",
      "Hang up immediately and contact the official government or utility helpline."
    ]
  }
];
