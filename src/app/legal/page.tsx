import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalContactEmail, legalDetails } from "@/lib/legal-details";

export const metadata = pageMetadata("Legal notice / Impressum", "Company identification, business registration and legal contact information for Daniel VLKO. Draft pending legal review.", "/legal", { index: legalDetails.reviewed });

export default function LegalNotice() {
  const fields = [
    ["Legal name / Registered business", legalDetails.legalName],
    ["Legal form", legalDetails.legalForm],
    ["Registered address / Place of business", legalDetails.address],
    ["Country of establishment", legalDetails.jurisdiction === "SK" ? "Slovakia / Slovenská republika" : legalDetails.jurisdiction],
    [legalDetails.jurisdiction === "SK" ? "Company ID / IČO" : "Business identifier / GISA", legalDetails.businessId],
    [legalDetails.jurisdiction === "SK" ? "Register entry" : "Firmenbuchnummer", legalDetails.registrationNumber],
    ["Register and registration authority / court", legalDetails.registerAndCourt],
    ["Tax number / DIČ", legalDetails.taxId],
    ["VAT identification number / IČ DPH / UID", legalDetails.vatId],
    ["VAT registration", legalDetails.vatRegistration],
    ...(legalDetails.phone ? [["Telephone", legalDetails.phone]] : []),
    ["Supervisory / Trade authority", legalDetails.supervisoryAuthority],
    ...(legalDetails.jurisdiction === "AT" ? [
      ["Chamber / Professional membership", legalDetails.chamber],
      ["Applicable professional rules", legalDetails.professionalRules],
    ] : []),
  ];

  return (
    <LegalPage title="Legal notice / Impressum" intro="Identification and contact information for the operator of danielvlko.com.">
      <section>
        <h2>Website operator</h2>
        <dl className="divide-y divide-[#071017]/10">
          {fields.filter(([, value]) => value || !legalDetails.reviewed).map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[1fr_1fr] sm:gap-6">
              <dt className="font-medium text-[#263640]">{label}</dt>
              <dd className="whitespace-pre-line">{value ?? "Pending confirmation"}</dd>
            </div>
          ))}
          <div className="grid gap-1 py-3 sm:grid-cols-[1fr_1fr] sm:gap-6">
            <dt className="font-medium text-[#263640]">Contact email</dt>
            <dd><a href={`mailto:${legalContactEmail}`}>{legalContactEmail}</a></dd>
          </div>
        </dl>
        <p className="mt-4">You can also use the <Link href="/contact">contact and booking page</Link>.</p>
        {legalDetails.registrySource && (
          <p className="mt-4 text-[13px]">
            Company registration details verified against the{" "}
            <a href={legalDetails.registrySource} target="_blank" rel="noreferrer">Slovak Commercial Register</a> on {legalDetails.registryVerifiedAt}.
          </p>
        )}
        {legalDetails.taxSource && legalDetails.vatSource && (
          <p className="mt-3 text-[13px]">
            Tax identifiers and registration checked against the Slovak Financial Administration&apos;s{" "}
            <a href={legalDetails.taxSource}>income-tax register</a> and{" "}
            <a href={legalDetails.vatSource}>VAT register</a> on {legalDetails.registryVerifiedAt}.
          </p>
        )}
      </section>
      <section>
        <h2>Website purpose</h2>
        <p>This website presents Daniel VLKO&apos;s software development, website and automation services and provides a way to make enquiries or arrange a call.</p>
        {legalDetails.jurisdiction === "AT" && <p>Media owner: {legalDetails.legalName}. Place of establishment: {legalDetails.address}. Editorial direction: information about the operator and these services.</p>}
      </section>
      <section>
        <h2>Privacy and website storage</h2>
        <p>Details about personal data processing are in the <Link href="/privacy">privacy notice</Link>. Optional measurement and browser storage are explained in <Link href="/cookies">cookies and privacy choices</Link>.</p>
      </section>
    </LegalPage>
  );
}
