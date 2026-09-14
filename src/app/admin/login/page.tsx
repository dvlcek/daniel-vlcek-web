import {
  redirect,
} from "next/navigation";

import {
  LockKeyhole,
} from "lucide-react";

import {
  isAdminAuthenticated,
} from "@/lib/admin/auth";

/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  searchParams:
    Promise<{
      error?:
        string;
    }>;
};

/* =========================================================
   PAGE
========================================================= */

export default async function AdminLoginPage({
  searchParams,
}: PageProps) {
  const authenticated =
    await isAdminAuthenticated();

  if (
    authenticated
  ) {
    redirect(
      "/admin",
    );
  }

  const params =
    await searchParams;

  const hasError =
    Boolean(
      params.error,
    );

  return (
    <main
      className="
        min-h-screen
        bg-[#050708]
        px-5
        text-white
      "
    >
      <div
        className="
          pointer-events-none
          fixed
          left-1/2
          top-[20%]
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          bg-[#FF5A1F]/[0.055]
          blur-[150px]
        "
      />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-[430px]
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full
            overflow-hidden
            rounded-[24px]
            border
            border-white/[0.09]
            bg-[#0A0E10]/95
            shadow-[0_40px_120px_rgba(0,0,0,0.55)]
          "
        >
          <div
            className="
              border-b
              border-white/[0.07]
              px-7
              py-7
            "
          >
            <div
              className="
                flex
                h-[38px]
                w-[38px]
                items-center
                justify-center
                rounded-full
                border
                border-[#FF5A1F]/20
                bg-[#FF5A1F]/[0.07]
              "
            >
              <LockKeyhole
                size={15}
                strokeWidth={1.7}
                className="
                  text-[#FF7040]
                "
              />
            </div>

            <div
              className="
                mt-6
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.23em]
                text-[#FF7040]
              "
            >
              Daniel VLKO
            </div>

            <h1
              className="
                mt-3
                text-[27px]
                font-medium
                tracking-[-0.045em]
              "
            >
              Control center.
            </h1>

            <p
              className="
                mt-3
                text-[11px]
                leading-[1.7]
                text-white/35
              "
            >
              Private access to
              bookings, leads and
              system operations.
            </p>
          </div>

          <form
            method="POST"
            action="/api/admin/login"
            className="
              px-7
              py-7
            "
          >
            <label
              htmlFor="admin-password"
              className="
                block
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white/30
              "
            >
              Password
            </label>

            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              placeholder="Enter admin password"
              className="
                mt-3
                h-[50px]
                w-full
                rounded-[12px]
                border
                border-white/[0.09]
                bg-white/[0.035]
                px-4
                text-[13px]
                text-white
                outline-none
                transition-all
                placeholder:text-white/20

                hover:border-white/[0.14]

                focus:border-[#FF5A1F]/40
                focus:bg-white/[0.05]
                focus:shadow-[0_0_0_3px_rgba(255,90,31,0.05)]
              "
            />

            {hasError && (
              <div
                className="
                  mt-4
                  rounded-[10px]
                  border
                  border-red-300/[0.09]
                  bg-red-300/[0.035]
                  px-4
                  py-3
                  text-[10px]
                  leading-[1.55]
                  text-red-200/70
                "
              >
                {params.error ===
                "server"
                  ? "Admin login is not configured correctly."
                  : "Invalid password."}
              </div>
            )}

            <button
              type="submit"
              className="
                mt-6
                flex
                h-[48px]
                w-full
                items-center
                justify-center
                rounded-full
                bg-[#FF5A1F]
                text-[11px]
                font-semibold
                text-white
                shadow-[0_14px_38px_rgba(255,90,31,0.17)]
                transition-all

                hover:-translate-y-px
                hover:bg-[#ff682e]
                hover:shadow-[0_18px_45px_rgba(255,90,31,0.22)]
              "
            >
              Enter dashboard
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}