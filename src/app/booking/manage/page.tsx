import { pageMetadata } from "@/lib/metadata";
import {
  ManageBookingClient,
} from "./ManageBookingClient";
import { Footer } from "@/components/layout/Footer";

export const metadata = { ...pageMetadata("Manage booking", "Reschedule or cancel your discovery call with Daniel VLKO using your private booking link.", "/booking/manage", { index: false, follow: false }), referrer: "no-referrer" as const };

export default function ManageBookingPage() {
  return (
    <>
      <main id="main-content" tabIndex={-1}
        className="
          min-h-screen

          bg-[#030708]

          px-5
          py-12

          text-white

          sm:px-8
          sm:py-16
        "
      >
        <ManageBookingClient />
      </main>
      <Footer />
    </>
  );
}
