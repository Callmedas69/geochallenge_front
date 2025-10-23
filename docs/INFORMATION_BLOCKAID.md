# Blockaid Submission Information

> **Purpose:** Copy-paste text for Blockaid false positive report
> **Form URL:** https://report.blockaid.io/mistake
> **Date Created:** 2025-10-20

---

## Quick Reference - Form Fields

### Report Type
```
Developer
```

### Domain
```
https://challenge.geoart.studio/
```

### Chain
```
Base
```

### Wallet
```
Baseapp
```

### Address (Smart Contract)
```
0x09A711bF488aa3d47c28677BEf662d9f7b1b0627
```

### Email
```
phan.harry@gmail.com
```

---

## "Anything you want to add" - Full Text

**Copy everything below this line:**

```
ISSUE: Legitimate Trading Card Competition Platform Flagged in Baseapp

Our platform is a legitimate NFT card competition system built on Base blockchain. We're being incorrectly flagged as a wallet drainer in Baseapp (Coinbase's Base mobile wallet).

ADDRESSES:
• Smart Contract: 0x09A711bF488aa3d47c28677BEf662d9f7b1b0627 (verified on BaseScan)
• Developer Wallet: 0xd76bb115a0487ef0336ab7b73e4eb07f83934160 (baseBuilder allowedAddress)
• Deployer Wallet : 0x127E3d1c1ae474A688789Be39fab0da6371926A7

ROOT CAUSE IDENTIFIED & FIXED:
The flag was triggered by a wildcard image hostname configuration (hostname: '**' in Next.js config) - a common pattern in phishing sites. This has been completely removed and replaced with an explicit whitelist of 8 trusted domains (IPFS gateways, BaseScan, Vibemarket, our own domain).

SECURITY MEASURES IMPLEMENTED:
✓ Removed wildcard image hostname (explicit domain whitelist)
✓ 7 production security headers (X-Frame-Options: DENY, CSP, X-Content-Type-Options, X-XSS-Protection, etc.)
✓ EIP-191 wallet signature authentication on all sensitive APIs
✓ Rate limiting (3 req/hr on proof API, 30 req/min on holdings API)
✓ URL validation to prevent SSRF attacks
✓ Input validation (Ethereum address format, numeric clamping)
✓ RFC 9116 security.txt: https://challenge.geoart.studio/.well-known/security.txt

VERIFICATION (all deployed to production):
• Contract verification: https://basescan.org/address/0x09A711bF488aa3d47c28677BEf662d9f7b1b0627
• Security headers: curl -I https://challenge.geoart.studio
• security.txt: https://challenge.geoart.studio/.well-known/security.txt
• No source code exposure (404 on /next.config.ts)

LEGITIMACY:
• Transparent smart contracts (verified on BaseScan)
• No user complaints or fraud reports
• Active Base community member: @0xdasx on Twitter
• Professional security practices (OWASP compliant)
• baseBuilder integration for Base ecosystem

REQUEST:
Please whitelist challenge.geoart.studio. We've implemented all recommended security measures and pose no threat to users. Happy to provide additional verification if needed.

Thank you for your review!
```

---

## Alternative - Shorter Version (if character limit)

If the form has a character limit, use this condensed version:

```
ISSUE: Legitimate Base NFT platform flagged as wallet drainer in Baseapp

Contract: 0x09A711bF488aa3d47c28677BEf662d9f7b1b0627 (verified on BaseScan)
Developer: 0xd76bb115a0487ef0336ab7b73e4eb07f83934160

ROOT CAUSE FIXED:
Wildcard image hostname (hostname: '**') removed, replaced with explicit domain whitelist.

SECURITY IMPLEMENTED:
✓ 7 production headers (X-Frame-Options: DENY, CSP, etc.)
✓ EIP-191 wallet signature auth
✓ Rate limiting on all APIs
✓ SSRF protection & input validation
✓ RFC 9116 security.txt

VERIFICATION:
• BaseScan: https://basescan.org/address/0x09A711bF488aa3d47c28677BEf662d9f7b1b0627
• security.txt: https://challenge.geoart.studio/.well-known/security.txt
• Headers: curl -I https://challenge.geoart.studio

REQUEST: Please whitelist challenge.geoart.studio. All security fixes deployed.

Contact: phan.harry@gmail.com / @0xdasx
```

---

## Supporting Links (Reference)

### Smart Contract
- **Address:** 0x09A711bF488aa3d47c28677BEf662d9f7b1b0627
- **BaseScan:** https://basescan.org/address/0x09A711bF488aa3d47c28677BEf662d9f7b1b0627

### Developer Wallet
- **Address:** 0xd76bb115a0487ef0336ab7b73e4eb07f83934160

### Website
- **Production:** https://challenge.geoart.studio
- **security.txt:** https://challenge.geoart.studio/.well-known/security.txt

### Social/Contact
- **Email:** phan.harry@gmail.com
- **Twitter:** @0xdasx
- **Twitter URL:** https://twitter.com/0xdasx

---

## Twitter Post - Copy-Paste

For posting to Twitter **after** submitting to Blockaid:

```
@BuildOnBase @Blockaid_ Need help with false positive!

Our legitimate Base dApp (challenge.geoart.studio) is flagged as unsafe in Baseapp.

✓ Verified contract: 0x09A711bF488aa3d47c28677BEf662d9f7b1b0627
✓ All security measures implemented
✓ Just submitted report to Blockaid

Can you help expedite the review?

Contact: phan.harry@gmail.com
```

---

## Base Discord Post - Copy-Paste

For posting in Base Discord #support channel:

```
Hi Base team,

Our NFT platform (challenge.geoart.studio) is being flagged in Baseapp but we're a legitimate project.

**Details:**
• Contract (verified): 0x09A711bF488aa3d47c28677BEf662d9f7b1b0627
• Website: https://challenge.geoart.studio
• BaseScan: https://basescan.org/address/0x09A711bF488aa3d47c28677BEf662d9f7b1b0627

**What we've done:**
✓ Fixed wildcard image hostname (replaced with explicit whitelist)
✓ Added 7 production security headers
✓ Implemented rate limiting & authentication
✓ RFC 9116 security.txt deployed

Just submitted appeal to Blockaid. Can you help expedite?

Thanks!
phan.harry@gmail.com / @0xdasx
```

---

## Submission Checklist

- [ ] Go to: https://report.blockaid.io/mistake
- [ ] Select "Developer" report type
- [ ] Enter domain: https://challenge.geoart.studio/
- [ ] Enter chain: Base
- [ ] Enter wallet: Baseapp
- [ ] Enter address: 0x09A711bF488aa3d47c28677BEf662d9f7b1b0627
- [ ] Enter email: phan.harry@gmail.com
- [ ] Copy-paste full text from "Anything you want to add" section above
- [ ] Complete CAPTCHA
- [ ] Click "Next" and submit
- [ ] Save confirmation screenshot
- [ ] Note submission date: ___________
- [ ] Tweet at @BuildOnBase and @Blockaid_ (use text above)
- [ ] Post in Base Discord #support (use text above)
- [ ] Set calendar reminder for Oct 27 (7 days) to follow up

---

## Follow-Up Schedule

| Date | Action |
|------|--------|
| **Oct 20** | Submit to Blockaid + Tweet + Discord post |
| **Oct 23** | Check Baseapp manually (3 days) |
| **Oct 27** | Follow up if no response (7 days) |
| **Nov 3** | Escalate on Twitter (14 days) |
| **Nov 10** | Consider partner referral (21 days) |

---

## FAQ

**Q: Will I get a confirmation email?**
A: Usually yes, but not always. Save a screenshot of the "submitted" page.

**Q: How long until whitelist?**
A: Typically 3-7 business days. Check manually in Baseapp.

**Q: Should I follow up?**
A: Yes! If no response after 7 days, reply to your submission or tweet at @Blockaid_

**Q: What if they ask for more info?**
A: Respond quickly with any additional details they need. Reference your smart contract verification and security.txt as proof of legitimacy.

---

**Last Updated:** 2025-10-20
**Status:** Ready to submit

