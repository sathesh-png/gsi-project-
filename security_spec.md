# Security Specification for GSI Workspace Firestore database

## 1. Data Invariants
1. Only authenticated team members can read or write workspace operations.
2. The `SocialDraft` entity requires a valid platform matching LUNA's authorized endpoints (TikTok, YouTube, Instagram, Facebook, LinkedIn, Pinterest, GMC).
3. The `Lead` status must be one of: New, Contacted, Qualified, Nurturing, Declined.
4. Total list/array field limits must be strictly constrained to prevent "Denial of Wallet" resource consumption. For example, `leadTags` inside `LeadSettings` must be <= 20 elements.
5. Immutability: critical IDs and tracking fields cannot be updated after creation (e.g. `createdAt`, `userId`).
6. All updates to records must be statically verified prior to checking relationships.

## 2. The "Dirty Dozen" Hack Payloads
Below are 12 JSON payloads designed to breach integrity or status rules:

1. **Self-Appointed Multi-Million Revenue Bypass**
   - Collection: `/financials`
   - Payload: `{ revenue: 99999999.0, cogs: "invalid_string", adSpend: 0, fees: 0, netProfit: 99999999.0, marginAlert: false, topCostDriver: "" }`
2. **Ghost Field Update Injection**
   - Collection: `/leads`
   - Payload: `{ id: "lead-abc", name: "Siti", source: "TikTok", intent: "Hot", status: "New", nextAction: "", email_verified: true, shadowRole: "ADMIN_BYPASS" }`
3. **Draft Platform Spoof Attack**
   - Collection: `/drafts`
   - Payload: `{ id: "dr-1", title: "Malicious Campaign", platform: "WeChat_Not_Allowed", type: "Script", content: "XSS-inject", status: "Published", createdAt: "2026-06-22" }`
4. **Denial-Of-Wallet Large Array Tags**
   - Collection: `/settings_lead_settings`
   - Payload: `{ autoQualifyHotScore: 80, requireEmail: false, followUpDelayDays: 2, leadTags: ["spam_tag", "spam_tag", ... 500 tags] }`
5. **No-Auth Read Attempt on CX Inquiries**
   - Operation: GET
   - Identity: Unauthenticated (`request.auth == null`)
6. **No-Auth Create Attempt on Hot Lead**
   - Operation: CREATE
   - Identity: Unauthenticated (`request.auth == null`)
7. **Bypassing Core Status Transition**
   - Collection: `/cxInquiries`
   - Payload: `{ status: "Escalated_Malicious_Override" }`
8. **Malicious Platform product injection**
   - Collection: `/products`
   - Payload: `{ price: "should_be_number_fail" }`
9. **Trend Velocity Overflow**
   - Collection: `/trends`
   - Payload: `{ velocity: 9999999999 }`
10. **Spoofing Email Verified Token**
    - Ident: `{ auth: { token: { email_verified: false } } }` trying to bypass standard writes.
11. **Immortal CreatedAt Modification**
    - Operation: UPDATE
    - Payload: Attempting to replace `createdAt: "2026-06-21"` with `"2020-01-01"` on an existing Approved draft.
12. **Malicious Document ID Poisoning**
    - ID: `a_highly_malicious_id_padding_with_one_thousand_bytes_to_exhaust_billing`

## 3. Security Rule Tests (DRAFT)
Verify that all "Dirty Dozen" payloads return `PERMISSION_DENIED`.
