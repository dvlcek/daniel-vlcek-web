import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalContactEmail, legalDetails } from "@/lib/legal-details";

export const metadata = pageMetadata("Privacy notice", "How Daniel VLKO processes browsing, enquiry and appointment information, including optional analytics and your privacy rights. Draft pending review.", "/privacy", { index: legalDetails.reviewed });

export default function PrivacyNotice() {
  return (
    <LegalPage title="Privacy notice" intro="How information is used when you browse this website, send an enquiry or arrange a call.">
      <section>
        <h2>Controller and contact</h2>
        <p>{legalDetails.legalName ?? "Controller identity pending confirmation"}. {legalDetails.address ?? "Registered address pending confirmation"}.</p>
        <p>For questions or requests about your personal data, contact <a href={`mailto:${legalContactEmail}`}>{legalContactEmail}</a>. Business identification details are in the <Link href="/legal">legal notice</Link>.</p>
      </section>
      <section>
        <h2>Enquiries and correspondence</h2>
        <p>When you send an enquiry, the website processes the contact details and project information you provide. Depending on the form, this includes your name, email, company, website and message. Resend delivers enquiry and confirmation emails. Your email provider also handles correspondence.</p>
        <p>The purpose is to respond, discuss your requirements and take steps towards a potential engagement. For an individual requesting a service, the proposed basis is Article 6(1)(b) GDPR. For contacts acting for a company, it is Article 6(1)(f), the legitimate interest in handling business enquiries. Required fields are needed to respond; optional fields can be left blank.</p>
      </section>
      <section>
        <h2>Appointments</h2>
        <p>The booking portal on the homepage, contact page and holding page uses a first-party database. It stores contact and project details, the selected appointment, timezone, status and booking management information. Depending on the configured integration, calendar events, meeting links, confirmations and reminders also pass through Google Calendar and Resend.</p>
        <p>These details are used to arrange and manage the requested call. You can contact me by email instead. Closing the booking portal does not cancel an appointment already submitted; use the booking management link to manage it.</p>
      </section>
      <section>
        <h2>Website operation and optional measurement</h2>
        <p>Hosting and infrastructure services handle connection and security information needed to deliver the website. The proposed basis is Article 6(1)(f) GDPR: reliable operation, security and preventing misuse.</p>
        <p>Optional Vercel Web Analytics and Speed Insights load only after you allow analytics. They measure visits and performance. The site strips URL query strings and fragments before sending measurement events, and excludes booking management and admin pages. This optional measurement uses your consent under Article 6(1)(a).</p>
        <p>You can withdraw that choice through Privacy settings in the footer. Withdrawal stops future optional measurement without affecting processing that took place before withdrawal. See <Link href="/cookies">cookies and privacy choices</Link> for storage details.</p>
      </section>
      <section>
        <h2>Service providers and transfers</h2>
        <p>Relevant recipients include email delivery services, booking and calendar providers, hosting, database infrastructure and, when enabled, measurement services.</p>
        <p>{legalDetails.hostingAndDatabase ?? "The contracted hosting, database, mailbox providers and processing locations still require confirmation before publication."}</p>
        <p>{legalDetails.transferSafeguards ?? "Any processing outside the EEA, the relevant contracted entities and transfer safeguards still require confirmation. This draft does not claim that all data stays in the EU or that every provider agreement has been completed."}</p>
      </section>
      <section>
        <h2>Retention</h2>
        <p>{legalDetails.retentionPolicy ?? "Retention periods and review/deletion procedures for enquiries, appointment records, correspondence, infrastructure logs and backups are pending confirmation. They must reflect the actual operating practices before this notice is published."}</p>
        <p>The privacy choice stored on your device expires after 180 days. Booking management credentials in session storage last for the browser session. The administrator login cookie has a maximum lifetime of seven days.</p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>Subject to the applicable conditions, you can request access, correction, erasure, restriction or portability of your data, object to processing based on legitimate interests, and withdraw consent. Contact the email above to make a request.</p>
        <p>You can also complain to a data protection authority, including the authority in your place of habitual residence, work or the alleged infringement. Relevant authorities include Slovakia&apos;s <a href="https://www.dataprotection.gov.sk/" rel="noreferrer">Úrad na ochranu osobných údajov SR</a> and Austria&apos;s <a href="https://www.dsb.gv.at/" rel="noreferrer">Datenschutzbehörde</a>.</p>
        <p>The website&apos;s enquiry and booking flows do not make automated decisions producing legal or similarly significant effects.</p>
      </section>
    </LegalPage>
  );
}
