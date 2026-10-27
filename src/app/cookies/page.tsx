import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { PrivacySettingsButton } from "@/components/site/PrivacyProvider";
import { legalDetails } from "@/lib/legal-details";

export const metadata = pageMetadata("Cookies & privacy choices", "Essential booking storage and optional analytics on danielvlko.com. Manage your privacy choices. Draft pending review.", "/cookies", { index: legalDetails.reviewed });

export default function CookiesNotice() {
  return (
    <LegalPage title="Cookies & privacy choices" intro="Browser storage, optional measurement and booking services used by this website.">
      <section>
        <h2>Your choice</h2>
        <p>Optional analytics and performance measurement are off by default. Rejecting them leaves the main website, enquiry form and contact information available. You can allow or withdraw optional measurement at any time.</p>
        <PrivacySettingsButton className="mt-4 inline-flex min-h-11 items-center rounded-full border border-[#071017]/25 px-5 text-[14px] font-medium text-[#071017] transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2410C]" />
      </section>
      <section>
        <h2 id="browser-storage-heading">First-party browser storage</h2>
        <div tabIndex={0} role="region" aria-labelledby="browser-storage-heading" className="overflow-x-auto rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2410C]">
          <table className="w-full min-w-[580px] border-collapse text-left text-[14px]">
            <caption className="sr-only">Website storage, its purpose and lifetime</caption>
            <thead><tr className="border-b border-[#071017]/15 text-[#263640]"><th scope="col" className="py-3 pr-5">Storage</th><th scope="col" className="py-3 pr-5">Purpose</th><th scope="col" className="py-3">Lifetime</th></tr></thead>
            <tbody className="divide-y divide-[#071017]/10">
              <tr><th scope="row" className="py-4 pr-5 font-medium">Privacy choice<br /><code className="text-[12px]">dv_privacy_choice_v1</code></th><td className="py-4 pr-5">Local storage remembers acceptance or rejection of optional measurement.</td><td className="py-4">180 days, then the choice is requested again.</td></tr>
              <tr><th scope="row" className="py-4 pr-5 font-medium">Booking ownership</th><td className="py-4 pr-5">A secure, HTTP-only cookie identifies the browser allowed to update and confirm its booking attempt. It is required for booking and is not used for analytics.</td><td className="py-4">One hour.</td></tr>
              <tr><th scope="row" className="py-4 pr-5 font-medium">Booking attempt<br /><code className="text-[12px]">dv-booking-attempt</code></th><td className="py-4 pr-5">Session storage remembers a nonsecret attempt identifier for retries in this tab. The identifier alone grants no access.</td><td className="py-4">Reused for up to one hour within the browser session.</td></tr>
              <tr><th scope="row" className="py-4 pr-5 font-medium">Booking management<br /><code className="text-[12px]">danielvlko.booking.manage</code></th><td className="py-4 pr-5">Session storage keeps credentials for the requested appointment management flow.</td><td className="py-4">Browser session.</td></tr>
              <tr><th scope="row" className="py-4 pr-5 font-medium">Administrator login<br /><code className="text-[12px]">dv_admin_session</code></th><td className="py-4 pr-5">An HTTP-only session cookie authenticates the administrator. Ordinary visitors do not receive it from browsing the homepage.</td><td className="py-4">Up to seven days, or until logout.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">If browser storage is blocked, the privacy choice is kept for the current page session only. Deleting local storage removes the saved choice.</p>
      </section>
      <section>
        <h2>Optional Vercel measurement</h2>
        <p>Vercel Web Analytics records aggregate website usage without tracking cookies. Speed Insights records performance measurements. Both are optional on this website and load only when you allow analytics. Cookieless measurement still involves sending information to a service provider.</p>
        <p>More details are available in Vercel&apos;s <a href="https://vercel.com/docs/analytics/privacy-policy" rel="noreferrer">Web Analytics privacy documentation</a> and <a href="https://vercel.com/docs/speed-insights/privacy-policy" rel="noreferrer">Speed Insights privacy documentation</a>.</p>
      </section>
      <section>
        <h2>Booking portal</h2>
        <p>The booking portal uses this website&apos;s own availability and booking endpoints. It does not load an external Cal.com embed. Booking management uses the session storage described above.</p>
        <p>You can contact me by email instead. Closing the portal does not cancel an appointment already submitted. See the <Link href="/privacy">privacy notice</Link> for how appointment details are processed.</p>
      </section>
      <section>
        <h2>Hosting and infrastructure</h2>
        <p>Additional infrastructure or security cookies depend on the deployed hosting configuration. That deployment must be checked before publication; this source-code review is not a complete inventory of cookies introduced by hosting services.</p>
        <p>For controller information, purposes, recipients, retention and your rights, read the <Link href="/privacy">privacy notice</Link>.</p>
      </section>
    </LegalPage>
  );
}
