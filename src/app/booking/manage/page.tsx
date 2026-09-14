import type {
  Metadata,
} from "next";

import {
  ManageBookingClient,
} from "./ManageBookingClient";

export const metadata:
  Metadata = {
    title:
      "Manage booking | Daniel VLKO",

    description:
      "Manage your discovery call with Daniel VLKO.",

    robots: {
      index: false,
      follow: false,
    },

    referrer:
      "no-referrer",
  };

export default function ManageBookingPage() {
  return (
    <main
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
  );
}