"use client";

import type {
  FormEvent,
} from "react";

import {
  useState,
} from "react";

import {
  ArrowRight,
  Check,
  LoaderCircle,
} from "lucide-react";

type FormState =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export function ContactForm() {
  const [state, setState] =
    useState<FormState>("idle");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      state === "submitting"
    ) {
      return;
    }

    setState("submitting");
    setErrorMessage("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const payload = {
      name: String(
        formData.get("name") ?? "",
      ).trim(),

      email: String(
        formData.get("email") ?? "",
      ).trim(),

      company: String(
        formData.get("company") ?? "",
      ).trim(),

      website: String(
        formData.get("website") ?? "",
      ).trim(),

      message: String(
        formData.get("message") ?? "",
      ).trim(),

      companyWebsite: String(
        formData.get(
          "companyWebsite",
        ) ?? "",
      ),
    };

    try {
      const response =
        await fetch(
          "/api/contact",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload,
              ),
          },
        );

      const result =
        (await response.json()) as {
          message?: string;
        };

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Something went wrong.",
        );
      }

      form.reset();

      setState("success");
    } catch (error) {
      setState("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    }
  }

  if (state === "success") {
    return (
      <div
        className="
          flex
          min-h-[330px]

          flex-col
          items-center
          justify-center

          text-center
        "
      >
        <div
          className="
            flex
            h-11
            w-11

            items-center
            justify-center

            rounded-full

            border
            border-[#FF5A1F]/30

            bg-[#FF5A1F]/10
          "
        >
          <Check
            size={18}
            strokeWidth={1.8}
            className="text-[#FF7540]"
          />
        </div>

        <h3
          className="
            mt-4

            text-[19px]
            font-semibold
            tracking-[-0.035em]
          "
        >
          Message received.
        </h3>

        <p
          className="
            mt-2
            max-w-[320px]

            text-[12px]
            leading-5
            text-white/42
          "
        >
          Thanks for the context.
          I&apos;ll take a look and
          get back to you personally.
        </p>

        <button
          type="button"
          onClick={() =>
            setState("idle")
          }
          className="
            mt-5

            text-[11px]
            font-medium
            text-[#FF7540]
          "
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* HONEYPOT */}

      <div
        aria-hidden="true"
        className="
          absolute
          left-[-9999px]
          h-px
          w-px
          overflow-hidden
        "
      >
        <label htmlFor="companyWebsite">
          Company website
        </label>

        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* ROW 1 */}

      <div
        className="
          grid
          gap-4

          sm:grid-cols-2
        "
      >
        <Field
          label="Name"
          name="name"
          placeholder="Your name"
          autoComplete="name"
          required
        />

        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
      </div>

      {/* ROW 2 */}

      <div
        className="
          grid
          gap-4

          sm:grid-cols-2
        "
      >
        <Field
          label="Company"
          name="company"
          placeholder="Your company"
          autoComplete="organization"
          required
        />

        <Field
          label="Website"
          name="website"
          type="url"
          placeholder="https://"
          autoComplete="url"
        />
      </div>

      {/* MESSAGE */}

      <div>
        <label
          htmlFor="message"
          className="
            mb-2
            block

            text-[10px]
            font-medium
            text-white/66
          "
        >
          What&apos;s slowing the
          business down?
        </label>

        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          placeholder="Tell me what takes too much time, feels disconnected or should work better..."
          className="
            min-h-[125px]
            w-full

            resize-y

            rounded-[9px]

            border
            border-white/[0.09]

            bg-[#061018]/80

            px-4
            py-3

            text-[12px]
            leading-5
            text-white

            outline-none

            transition-all
            duration-200

            placeholder:text-white/23

            focus:border-[#FF5A1F]/55
            focus:bg-[#07131B]
          "
        />
      </div>

      {state === "error" &&
        errorMessage && (
          <p
            className="
              text-[11px]
              text-red-400
            "
          >
            {errorMessage}
          </p>
        )}

      <button
        type="submit"
        disabled={
          state === "submitting"
        }
        style={{
          color: "#FFFFFF",
        }}
        className="
          group

          inline-flex
          h-[46px]
          w-full

          items-center
          justify-center
          gap-5

          rounded-full

          bg-[#FF5A1F]

          px-6

          text-[12px]
          font-medium

          shadow-[0_8px_26px_rgba(255,90,31,0.15)]

          transition-all
          duration-300

          hover:-translate-y-0.5
          hover:bg-[#FF6932]

          disabled:pointer-events-none
          disabled:opacity-60
        "
      >
        {state ===
        "submitting" ? (
          <>
            <LoaderCircle
              size={15}
              className="animate-spin"
            />

            Sending...
          </>
        ) : (
          <>
            Send the problem

            <ArrowRight
              size={14}
              strokeWidth={1.7}
              className="
                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            />
          </>
        )}
      </button>

      <p
        className="
          text-center

          text-[9px]
          leading-4
          text-white/25
        "
      >
        Your details are only used
        to reply to your enquiry.
      </p>
    </form>
  );
}

/* ============================================================
   FIELD
============================================================ */

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = false,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="
          mb-2
          block

          text-[10px]
          font-medium
          text-white/66
        "
      >
        {label}

        {!required && (
          <span className="text-white/25">
            {" "}
            · optional
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="
          h-[43px]
          w-full

          rounded-[9px]

          border
          border-white/[0.09]

          bg-[#061018]/80

          px-4

          text-[12px]
          text-white

          outline-none

          transition-all
          duration-200

          placeholder:text-white/23

          focus:border-[#FF5A1F]/55
          focus:bg-[#07131B]
        "
      />
    </div>
  );
}