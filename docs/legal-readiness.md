# Legal publication status

**Draft only.** CTA and footer improvements do not establish legal compliance.
The legal pages show a review notice and are `noindex` while
`src/lib/legal-details.ts` has `reviewed: false`.
Do not remove that notice or publish these drafts as final before resolving the
remaining contact and processing details below.

## Operator information required

Verified on 3 October 2026 against the official Commercial Register and Financial
Administration datasets:

- Operator: **VLKO Ventures s. r. o.**, a Slovak limited liability company.
- Registered seat: Karpatské námestie 7770/10A, 831 06 Bratislava – mestská časť
  Rača, Slovenská republika.
- IČO: **57790647**; company registered on 11 August 2026.
- Commercial Register of Mestský súd Bratislava III, section Sro, entry 202436/B.
- DIČ: **2123125521**; IČ DPH: **SK2123125521**.
- The VAT dataset records **§ 7a**, effective 24 August 2026. The site describes
  that registration accurately and does not claim standard VAT-payer status.
- SOI's Bratislava inspectorate contact address was checked on its official site.

The public email remains the existing `hello@danielvlko.com`. The operator
explicitly requested that no telephone be published, so the footer and legal
notice omit it, including any empty placeholder. This preference does not
establish that all statutory contact-information duties have been met; assess
the telephone requirement in Slovak Act 22/2004 § 4 during the final legal review.
Personal residential addresses of directors/shareholders were not copied into
the website. Austrian chamber/sole-trader fields were removed from the Slovak
company notice; serving Austrian clients does not itself make this an Austrian
registered operator. Assess additional disclosures according to actual targeting.

Fill only applicable, confirmed fields in `src/lib/legal-details.ts`. Null values
are omitted after review; omission is not evidence that a field is optional.

## Processing details required

- Confirm hosting, database and mailbox providers, contracted entities, regions,
  subprocessors, processor agreements and any EEA transfer safeguards.
- Confirm the actual Cal.com account/deployment and settings. The source contains
  a Cal.com contact-page embed and a separate first-party booking flow on the
  holding page; both must be covered while both remain available.
- Confirm Resend and Google Calendar integrations, processor terms and settings.
- Set real retention periods for unanswered enquiries, bookings, correspondence,
  logs and backups. Record how review/deletion happens. No deletion automation
  was added in this change, and no fictitious retention period is promised.
- Validate the legal bases in the draft, including the legitimate-interest
  assessment for business correspondence, security and infrastructure processing.
- Confirm whether services are B2B only or also offered to consumers. Additional
  consumer/ADR, contractual and pre-contract information may apply; the current
  site is an enquiry/appointment site, not an online checkout.
- Check additional countries actually targeted, data subjects and applicable
  thresholds. A universal “global law compliant” statement is not supported by
  this implementation.
- Review public case-study outcome claims and any presentation metrics separately
  before publication. Their substantiation was not addressed by this footer task.

## Implemented technical controls

- Working `/legal`, `/privacy` and `/cookies` draft pages, linked from the shared
  footer. The footer is on the homepage, contact, work, holding and booking
  management pages. Admin pages do not need the public marketing footer.
- Analytics and performance measurement are off until optional measurement is
  accepted. Acceptance and rejection have equal button presentation. No choice
  blocks access to the main website or enquiry form.
- Footer Privacy settings permits changing/rejecting the choice. Preferences are
  saved in local storage with version/date and expire after 180 days. That is a
  chosen preference lifetime, not a statement that legislation mandates 180 days.
- The before-send guards check the current choice on every event, including
  after withdrawal. They strip URL queries/fragments and use a public-page
  allowlist. Analytics components do not mount on admin or booking management
  routes. A production network inspection is still required to verify SDK,
  hosting and deployment behavior.
- Cal.com embeds load after a separate, informed “Load booking calendar” choice,
  with email as an alternative. That functional choice is independent of analytics.
  Closing the iframe does not erase provider-side data/storage.
- Removed the unsolicited Cal.com prefetch on the holding page, which used a
  timer/hover before any calendar choice despite the holding page using a
  first-party booking wizard.
- Privacy links are shown at collection in the contact form, holding-page enquiry
  form and first-party booking form. No mandatory marketing-consent checkbox was
  added to a service enquiry.
- No social links with `href="#"`, invented registrations, fake certifications,
  generic liability waivers or obsolete ODR-platform link were added.

## Verification before publication

Local verification: TypeScript and ESLint on the new/changed closing, legal and
privacy components passed; the consent/URL guard checks in
`scripts/check-privacy.ts` passed. Seven public routes returned HTTP 200 with the
shared legal footer. The initial HTML contained neither an injected measurement
script nor a Cal.com iframe. This is not an interactive/network browser test.
The broader changed-file ESLint run also found three pre-existing
`react-hooks/set-state-in-effect` errors in BookingWizard and ComingSoonModals;
they were reproduced against the committed versions and are outside these edits.

Verify the deployment in a browser: fresh visitor rejection/acceptance, reload,
withdrawal, blocked storage and cross-tab updates. Inspect outgoing requests
before choice, and on booking/admin routes. Check Cal.com creates no requests
before the separate load action. Audit production cookies/storage and provider
dashboards. Review identity, notices and relevant commercial terms with a local
professional where appropriate; source-code checks cannot establish the full
legal and operational position.

## Official sources checked

- [Official Commercial Register company extract](https://www.orsr.sk/vypis.asp?ID=771082&SID=2&P=0).
- [Financial Administration income-tax register](https://opendata.financnasprava.sk/opendata/show/zoznam-danovych-subjektov-registrovanych-na-dan-z-prijmov),
  with the matching IČO in [the official XML dataset](https://report.financnasprava.sk/ds_dsrdp.zip).
- [Financial Administration VAT register](https://opendata.financnasprava.sk/opendata/show/zoznam-danovych-subjektov-registrovanych-pre-dph1),
  with the matching IČO in [the official XML dataset](https://report.financnasprava.sk/ds_dphs.zip).
- [SOI official contacts](https://www.soi.sk/kontakt).
- [Slovak Act 22/2004, §§ 3–4](https://static.slov-lex.sk/static/SK/ZZ/2004/22/20220901.print.html):
  provider identification/contact/registration and supervision disclosures;
  cross-border applicability is not simply both countries' laws combined.
- [WKO: correct website Impressum](https://www.wko.at/internetrecht/website-impressum)
  and [ECG information duties](https://www.wko.at/internetrecht/informationspflichten-nach-dem-e-commerce-gesetz--dem-unte):
  Austrian requirements depend on legal form, registration and website content.
- [GDPR, Articles 6, 7 and 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng):
  controller identity, purposes, bases, recipients, transfers, retention and rights.
- [European Commission: information and rights](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en):
  clear notice at collection and conditional data-subject rights.
- [Vercel Web Analytics privacy](https://vercel.com/docs/analytics/privacy-policy)
  and [Speed Insights privacy](https://vercel.com/docs/speed-insights/privacy-policy):
  product-specific measurement and URL redaction considerations. Opt-in here is
  a conservative implementation choice, not a claim that all cookieless analytics
  legally require the same banner.
- [Cal.com privacy](https://cal.com/privacy) and
  [Resend privacy](https://resend.com/legal/privacy-policy): provider-side practices
  must be reconciled with the actual account and contracts.
- [European Commission: ODR platform closure](https://consumer-redress.ec.europa.eu/site-relocation_en):
  the platform was discontinued on 20 July 2025. This does not remove all possible
  national consumer/ADR information duties.
