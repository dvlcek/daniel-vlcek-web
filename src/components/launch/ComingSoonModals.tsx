"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  ArrowRight,
  Check,
  Loader2,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  BookingWizard,
  preloadBookingAvailability,
} from "@/components/booking/BookingWizard";

/* =========================================================
   TYPES
========================================================= */

type ModalType =
  | "contact"
  | "book"
  | null;

type SubmitStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

/* =========================================================
   SHARED FORM STYLES
========================================================= */

const fieldClassName = `
  h-[50px]
  w-full

  rounded-[10px]

  border
  border-white/[0.085]

  bg-white/[0.025]

  px-4

  text-[13px]
  text-white

  outline-none

  transition-all
  duration-200

  placeholder:text-white/22

  hover:border-white/[0.14]

  focus:border-[#FF5A1F]/40
  focus:bg-white/[0.035]
`;

const labelClassName = `
  mb-2

  block

  text-[9px]
  font-semibold
  uppercase
  tracking-[0.2em]

  text-white/36
`;

/* =========================================================
   MODALS
========================================================= */

export function ComingSoonModals() {
  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    modal,
    setModal,
  ] =
    useState<ModalType>(null);

  /* =======================================================
     MOUNT
  ======================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =======================================================
     BOOKING PREFETCH
  ======================================================= */

  useEffect(() => {
    preloadBookingAvailability();
  }, []);

  /* =======================================================
     GLOBAL TRIGGERS
  ======================================================= */

  useEffect(() => {
    const handleTrigger = (
      event: MouseEvent,
    ) => {
      const target =
        event.target instanceof Element
          ? event.target
          : null;

      if (!target) {
        return;
      }

      const contactTrigger =
        target.closest(
          "[data-contact-trigger]",
        );

      if (contactTrigger) {
        event.preventDefault();
        setModal("contact");
        return;
      }

      const bookTrigger =
        target.closest(
          "[data-book-trigger]",
        );

      if (bookTrigger) {
        event.preventDefault();
        setModal("book");
      }
    };

    document.addEventListener(
      "click",
      handleTrigger,
    );

    return () => {
      document.removeEventListener(
        "click",
        handleTrigger,
      );
    };
  }, []);

  /* =======================================================
     BODY LOCK + ESCAPE
  ======================================================= */

  useEffect(() => {
    if (!modal) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        setModal(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [modal]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {modal && (
        <motion.div
          key="coming-soon-modal"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.18,
          }}
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setModal(null);
            }
          }}
          className="
            fixed
            inset-0
            z-[1000]

            flex
            items-center
            justify-center

            overflow-y-auto

            bg-black/[0.78]

            p-3

            backdrop-blur-[14px]

            sm:p-6
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 14,
              scale: 0.99,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.995,
            }}
            transition={{
              duration: 0.28,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            role="dialog"
            aria-modal="true"
            aria-label={
              modal === "contact"
                ? "Contact Daniel VLKO"
                : "Book a discovery call"
            }
            onMouseDown={(
              event,
            ) => {
              event.stopPropagation();
            }}
            className={`
              relative

              w-full

              overflow-hidden

              rounded-[18px]

              border
              border-white/[0.09]

              bg-[#06090B]/[0.97]

              shadow-[0_30px_100px_rgba(0,0,0,0.65)]

              ${
                modal === "book"
                  ? "max-w-[780px]"
                  : "max-w-[610px]"
              }
            `}
          >
            {/* subtle top highlight */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-8
                top-0
                h-px

                bg-gradient-to-r
                from-transparent
                via-white/[0.16]
                to-transparent
              "
            />

            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-6

                border-b
                border-white/[0.065]

                px-5
                py-5

                sm:px-7
                sm:py-6
              "
            >
              <div>
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#FF6A32]/80
                  "
                >
                  {modal === "contact"
                    ? "Contact"
                    : "Discovery call"}
                </p>

                <h2
                  className="
                    mt-3

                    text-[25px]
                    font-medium
                    leading-[1.08]
                    tracking-[-0.04em]

                    text-white

                    sm:text-[30px]
                  "
                >
                  {modal === "contact"
                    ? "Let’s talk."
                    : "Book a discovery call."}
                </h2>

                <p
                  className="
                    mt-3

                    max-w-[580px]

                    text-[11.5px]
                    leading-[1.7]

                    text-white/40

                    sm:text-[13px]
                  "
                >
                  {modal === "contact"
                    ? "Tell me what you want to build, improve or automate. I’ll get back to you personally."
                    : "Choose a time that works for you. We’ll look at your current setup, bottlenecks and where better systems could create the most leverage."}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() =>
                  setModal(null)
                }
                className="
                  flex
                  h-[36px]
                  w-[36px]
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/[0.09]

                  bg-transparent

                  text-white/42

                  transition-all
                  duration-200

                  hover:border-white/[0.18]
                  hover:bg-white/[0.03]
                  hover:text-white
                "
              >
                <X
                  size={16}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            {/* =================================================
                BODY
            ================================================= */}

            {modal === "contact" ? (
              <ContactForm
                onClose={() =>
                  setModal(null)
                }
              />
            ) : (
              <BookingPanel />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* =========================================================
   CONTACT FORM
========================================================= */

function ContactForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [
    status,
    setStatus,
  ] =
    useState<SubmitStatus>(
      "idle",
    );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      status === "loading"
    ) {
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const payload = {
      name:
        formData
          .get("name")
          ?.toString() ?? "",

      email:
        formData
          .get("email")
          ?.toString() ?? "",

      website:
        formData
          .get("website")
          ?.toString() ?? "",

      message:
        formData
          .get("message")
          ?.toString() ?? "",

      companyWebsite:
        formData
          .get(
            "companyWebsite",
          )
          ?.toString() ?? "",

      source:
        typeof window !==
        "undefined"
          ? window.location.href
          : "",
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
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ??
            "Something went wrong.",
        );
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    }
  };

  /* =======================================================
     SUCCESS
  ======================================================= */

  if (
    status === "success"
  ) {
    return (
      <div
        className="
          flex
          min-h-[380px]

          flex-col
          items-center
          justify-center

          px-6
          py-14

          text-center
        "
      >
        <div
          className="
            flex
            h-[48px]
            w-[48px]

            items-center
            justify-center

            rounded-full

            border
            border-white/[0.09]

            text-[#FF6A32]
          "
        >
          <Check
            size={20}
            strokeWidth={1.8}
          />
        </div>

        <h3
          className="
            mt-6

            text-[23px]
            font-medium
            tracking-[-0.035em]

            text-white
          "
        >
          Message received.
        </h3>

        <p
          className="
            mt-3

            max-w-[360px]

            text-[12.5px]
            leading-[1.7]

            text-white/38
          "
        >
          Thanks for reaching out.
          I&apos;ll review your inquiry
          and get back to you directly.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="
            mt-7

            inline-flex
            h-[42px]

            items-center
            justify-center

            rounded-full

            border
            border-white/[0.11]

            px-6

            text-[11px]
            font-medium

            text-white/70

            transition-all
            duration-200

            hover:border-white/[0.2]
            hover:bg-white/[0.025]
            hover:text-white
          "
        >
          Close
        </button>
      </div>
    );
  }

  /* =======================================================
     FORM
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="
        px-5
        py-6

        sm:px-7
        sm:py-7
      "
    >
      {/* honeypot */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[-9999px]
          top-[-9999px]
          h-0
          w-0
          overflow-hidden
        "
      >
        <label>
          Company website

          <input
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {/* name + email */}

      <div
        className="
          grid
          gap-4

          sm:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="contact-name"
            className={
              labelClassName
            }
          >
            Name{" "}
            <span className="text-[#FF5A1F]">
              *
            </span>
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
            className={
              fieldClassName
            }
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className={
              labelClassName
            }
          >
            Email{" "}
            <span className="text-[#FF5A1F]">
              *
            </span>
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder="you@company.com"
            className={
              fieldClassName
            }
          />
        </div>
      </div>

      {/* website */}

      <div className="mt-4">
        <div
          className="
            mb-2
            flex
            items-center
            justify-between
          "
        >
          <label
            htmlFor="contact-website"
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-white/36
            "
          >
            Website
          </label>

          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.16em]
              text-white/18
            "
          >
            Optional
          </span>
        </div>

        <input
          id="contact-website"
          name="website"
          type="text"
          maxLength={200}
          autoComplete="url"
          placeholder="company.com"
          className={
            fieldClassName
          }
        />
      </div>

      {/* message */}

      <div className="mt-4">
        <label
          htmlFor="contact-message"
          className={
            labelClassName
          }
        >
          What can I help with?{" "}
          <span className="text-[#FF5A1F]">
            *
          </span>
        </label>

        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2500}
          rows={5}
          placeholder="Tell me briefly what you want to improve, build or automate..."
          className="
            min-h-[135px]
            w-full

            resize-none

            rounded-[10px]

            border
            border-white/[0.085]

            bg-white/[0.025]

            px-4
            py-3.5

            text-[13px]
            leading-[1.65]
            text-white

            outline-none

            transition-all
            duration-200

            placeholder:text-white/22

            hover:border-white/[0.14]

            focus:border-[#FF5A1F]/40
            focus:bg-white/[0.035]
          "
        />
      </div>

      {/* error */}

      {status === "error" && (
        <p
          className="
            mt-4
            text-[11px]
            leading-[1.5]
            text-red-300/80
          "
        >
          {errorMessage}
        </p>
      )}

      {/* footer */}

      <div
        className="
          mt-6

          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p
          className="
            max-w-[290px]
            text-[9px]
            leading-[1.6]
            text-white/24
          "
        >
          Your details are used only
          to respond to your inquiry.
        </p>

        <button
          type="submit"
          disabled={
            status === "loading"
          }
          className="
            group

            inline-flex
            h-[46px]

            items-center
            justify-center

            gap-7

            rounded-full

            bg-[#FF5A1F]

            px-6

            text-[11px]
            font-semibold
            text-white

            shadow-[0_12px_34px_rgba(255,90,31,0.16)]

            transition-all
            duration-300

            hover:-translate-y-[1px]
            hover:bg-[#ff652b]

            disabled:pointer-events-none
            disabled:opacity-60

            sm:min-w-[172px]
          "
        >
          {status === "loading" ? (
            <>
              Sending

              <Loader2
                size={14}
                strokeWidth={1.8}
                className="animate-spin"
              />
            </>
          ) : (
            <>
              Send inquiry

              <ArrowRight
                size={14}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300

                  group-hover:translate-x-1
                "
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   BOOKING
========================================================= */

function BookingPanel() {
  return <BookingWizard />;
}