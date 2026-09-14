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
  CalendarDays,
  Check,
  Loader2,
  Mail,
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

  rounded-[12px]

  border
  border-white/[0.09]

  bg-white/[0.035]

  px-4

  text-[13px]
  text-white

  outline-none

  transition-all
  duration-200

  placeholder:text-white/25

  hover:border-white/[0.14]

  focus:border-[#FF5A1F]/45
  focus:bg-white/[0.05]
  focus:shadow-[0_0_0_3px_rgba(255,90,31,0.06)]
`;

const labelClassName = `
  mb-2

  block

  text-[9px]
  font-semibold
  uppercase
  tracking-[0.22em]

  text-white/40
`;

/* =========================================================
   MODALS
========================================================= */

export function ComingSoonModals() {
  const [
    mounted,
    setMounted,
  ] =
    useState(false);

  const [
    modal,
    setModal,
  ] =
    useState<ModalType>(
      null,
    );

  /* =======================================================
     MOUNT
  ======================================================= */

  useEffect(
    () => {
      setMounted(
        true,
      );
    },
    [],
  );

  /* =======================================================
     BOOKING AVAILABILITY PREFETCH

     Starts loading availability while the visitor is still
     looking at the landing page.

     The actual confirmation route still performs a fresh
     server-side validation before reserving anything.
  ======================================================= */

  useEffect(
    () => {
      preloadBookingAvailability();
    },
    [],
  );

  /* =======================================================
     GLOBAL TRIGGERS
  ======================================================= */

  useEffect(
    () => {
      const handleTrigger =
        (
          event:
            MouseEvent,
        ) => {
          const target =
            event.target instanceof
            Element
              ? event.target
              : null;

          if (!target) {
            return;
          }

          const contactTrigger =
            target.closest(
              "[data-contact-trigger]",
            );

          if (
            contactTrigger
          ) {
            event.preventDefault();

            setModal(
              "contact",
            );

            return;
          }

          const bookTrigger =
            target.closest(
              "[data-book-trigger]",
            );

          if (
            bookTrigger
          ) {
            event.preventDefault();

            setModal(
              "book",
            );
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
    },
    [],
  );

  /* =======================================================
     BODY LOCK + ESCAPE
  ======================================================= */

  useEffect(
    () => {
      if (!modal) {
        return;
      }

      const previousOverflow =
        document.body.style
          .overflow;

      document.body.style.overflow =
        "hidden";

      const handleKeyDown =
        (
          event:
            KeyboardEvent,
        ) => {
          if (
            event.key ===
            "Escape"
          ) {
            setModal(
              null,
            );
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
    },
    [
      modal,
    ],
  );

  if (!mounted) {
    return null;
  }

  /* =======================================================
     PORTAL
  ======================================================= */

  return createPortal(
    <AnimatePresence>
      {modal && (
        <motion.div
          key="coming-soon-modal"
          initial={{
            opacity:
              0,
          }}
          animate={{
            opacity:
              1,
          }}
          exit={{
            opacity:
              0,
          }}
          transition={{
            duration:
              0.2,
          }}
          className="
            fixed
            inset-0
            z-[1000]

            flex
            items-center
            justify-center

            overflow-y-auto

            bg-[#010405]/80

            p-3

            backdrop-blur-[18px]

            sm:p-6
          "
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setModal(
                null,
              );
            }
          }}
        >
          {/* AMBIENT GLOW */}

          <div
            className="
              pointer-events-none

              fixed
              left-1/2
              top-1/2

              h-[500px]
              w-[500px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              bg-[#FF5A1F]/[0.055]

              blur-[150px]
            "
          />

          {/* MODAL */}

          <motion.div
            initial={{
              opacity:
                0,

              y:
                18,

              scale:
                0.985,
            }}
            animate={{
              opacity:
                1,

              y:
                0,

              scale:
                1,
            }}
            exit={{
              opacity:
                0,

              y:
                10,

              scale:
                0.99,
            }}
            transition={{
              duration:
                0.32,

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
              modal ===
              "contact"
                ? "Contact Daniel VLKO"
                : "Book a free discovery call"
            }
            className={`
              relative

              w-full

              overflow-hidden

              rounded-[22px]

              border
              border-white/[0.10]

              bg-[#071014]/[0.94]

              shadow-[0_35px_120px_rgba(0,0,0,0.65)]

              backdrop-blur-[40px]

              ${
                modal ===
                "book"
                  ? "max-w-[780px]"
                  : "max-w-[610px]"
              }
            `}
            onMouseDown={(
              event,
            ) => {
              event.stopPropagation();
            }}
          >
            {/* TOP HIGHLIGHT */}

            <div
              className="
                pointer-events-none

                absolute
                inset-x-0
                top-0
                z-20

                h-px

                bg-gradient-to-r
                from-transparent
                via-white/20
                to-transparent
              "
            />

            {/* HEADER */}

            <div
              className="
                relative
                z-20

                flex
                items-start
                justify-between

                gap-6

                border-b
                border-white/[0.07]

                bg-[#071014]/80

                px-5
                py-5

                backdrop-blur-xl

                sm:px-7
                sm:py-6
              "
            >
              <div>
                <div
                  className="
                    mb-3

                    flex
                    items-center
                    gap-2.5

                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.27em]

                    text-[#FF7040]
                  "
                >
                  {modal ===
                  "contact" ? (
                    <Mail
                      size={
                        12
                      }
                      strokeWidth={
                        1.8
                      }
                    />
                  ) : (
                    <CalendarDays
                      size={
                        12
                      }
                      strokeWidth={
                        1.8
                      }
                    />
                  )}

                  {modal ===
                  "contact"
                    ? "Contact"
                    : "Free discovery call"}
                </div>

                <h2
                  className="
                    text-[24px]
                    font-medium
                    leading-[1.1]
                    tracking-[-0.04em]

                    text-white

                    sm:text-[29px]
                  "
                >
                  {modal ===
                  "contact"
                    ? "Let’s talk."
                    : "Book a free discovery call."}
                </h2>

                <p
                  className="
                    mt-3

                    max-w-[600px]

                    text-[11.5px]
                    leading-[1.7]

                    text-white/43

                    sm:text-[13px]
                  "
                >
                  {modal ===
                  "contact"
                    ? "Tell me briefly what you want to build, improve or automate. I’ll get back to you personally."
                    : "Choose a time that works for you. We’ll look at your current bottlenecks and where software, automation or AI can create the most impact."}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() =>
                  setModal(
                    null,
                  )
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

                  bg-white/[0.035]

                  text-white/50

                  transition-all
                  duration-200

                  hover:border-white/[0.16]
                  hover:bg-white/[0.07]
                  hover:text-white
                "
              >
                <X
                  size={
                    16
                  }
                  strokeWidth={
                    1.7
                  }
                />
              </button>
            </div>

            {/* BODY */}

            {modal ===
            "contact" ? (
              <ContactForm
                onClose={() =>
                  setModal(
                    null,
                  )
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
  ] =
    useState("");

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        status ===
        "loading"
      ) {
        return;
      }

      setStatus(
        "loading",
      );

      setErrorMessage(
        "",
      );

      const form =
        event.currentTarget;

      const formData =
        new FormData(
          form,
        );

      const payload = {
        name:
          formData
            .get(
              "name",
            )
            ?.toString() ??
          "",

        email:
          formData
            .get(
              "email",
            )
            ?.toString() ??
          "",

        website:
          formData
            .get(
              "website",
            )
            ?.toString() ??
          "",

        message:
          formData
            .get(
              "message",
            )
            ?.toString() ??
          "",

        companyWebsite:
          formData
            .get(
              "companyWebsite",
            )
            ?.toString() ??
          "",

        source:
          typeof window !==
          "undefined"
            ? window
                .location
                .href
            : "",
      };

      try {
        const response =
          await fetch(
            "/api/contact",
            {
              method:
                "POST",

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
            .catch(
              () =>
                null,
            );

        if (
          !response.ok
        ) {
          throw new Error(
            result
              ?.message ??
              "Something went wrong.",
          );
        }

        form.reset();

        setStatus(
          "success",
        );
      } catch (error) {
        setStatus(
          "error",
        );

        setErrorMessage(
          error instanceof
            Error
            ? error.message
            : "Something went wrong.",
        );
      }
    };

  /* =======================================================
     SUCCESS
  ======================================================= */

  if (
    status ===
    "success"
  ) {
    return (
      <div
        className="
          flex
          min-h-[390px]

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
            h-[52px]
            w-[52px]

            items-center
            justify-center

            rounded-full

            border
            border-[#FF5A1F]/20

            bg-[#FF5A1F]/[0.08]

            shadow-[0_0_35px_rgba(255,90,31,0.10)]
          "
        >
          <Check
            size={
              21
            }
            strokeWidth={
              1.8
            }
            className="
              text-[#FF6A32]
            "
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

            max-w-[380px]

            text-[12.5px]
            leading-[1.7]

            text-white/42
          "
        >
          Thanks for reaching out.
          I&apos;ll review it and get
          back to you directly.
        </p>

        <button
          type="button"
          onClick={
            onClose
          }
          className="
            mt-7

            inline-flex
            h-[42px]

            items-center
            justify-center

            rounded-full

            border
            border-white/[0.12]

            px-6

            text-[11px]
            font-semibold

            text-white/80

            transition-all

            hover:border-white/[0.22]
            hover:bg-white/[0.04]
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
      onSubmit={
        handleSubmit
      }
      className="
        px-5
        py-6

        sm:px-7
        sm:py-7
      "
    >
      {/* HONEYPOT */}

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

            tabIndex={
              -1
            }

            autoComplete="off"
          />
        </label>
      </div>

      {/* NAME + EMAIL */}

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
            <span
              className="
                text-[#FF5A1F]
              "
            >
              *
            </span>
          </label>

          <input
            id="contact-name"
            name="name"

            type="text"

            required

            maxLength={
              100
            }

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
            <span
              className="
                text-[#FF5A1F]
              "
            >
              *
            </span>
          </label>

          <input
            id="contact-email"
            name="email"

            type="email"

            required

            maxLength={
              160
            }

            autoComplete="email"

            placeholder="you@company.com"

            className={
              fieldClassName
            }
          />
        </div>
      </div>

      {/* WEBSITE */}

      <div
        className="
          mt-4
        "
      >
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
              tracking-[0.22em]

              text-white/40
            "
          >
            Website
          </label>

          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.16em]

              text-white/20
            "
          >
            Optional
          </span>
        </div>

        <input
          id="contact-website"
          name="website"

          type="text"

          maxLength={
            200
          }

          autoComplete="url"

          placeholder="company.com"

          className={
            fieldClassName
          }
        />
      </div>

      {/* MESSAGE */}

      <div
        className="
          mt-4
        "
      >
        <label
          htmlFor="contact-message"
          className={
            labelClassName
          }
        >
          What can I help with?{" "}
          <span
            className="
              text-[#FF5A1F]
            "
          >
            *
          </span>
        </label>

        <textarea
          id="contact-message"
          name="message"

          required

          minLength={
            10
          }

          maxLength={
            2500
          }

          rows={
            5
          }

          placeholder="Tell me briefly what you want to improve, build or automate..."

          className="
            min-h-[135px]
            w-full

            resize-none

            rounded-[12px]

            border
            border-white/[0.09]

            bg-white/[0.035]

            px-4
            py-3.5

            text-[13px]
            leading-[1.65]

            text-white

            outline-none

            transition-all
            duration-200

            placeholder:text-white/25

            hover:border-white/[0.14]

            focus:border-[#FF5A1F]/45
            focus:bg-white/[0.05]
            focus:shadow-[0_0_0_3px_rgba(255,90,31,0.06)]
          "
        />
      </div>

      {/* ERROR */}

      {status ===
        "error" && (
        <p
          className="
            mt-4

            text-[11px]
            leading-[1.5]

            text-red-300/80
          "
        >
          {
            errorMessage
          }
        </p>
      )}

      {/* ACTION */}

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

            text-white/27
          "
        >
          Your details are used
          only to respond to your
          inquiry.
        </p>

        <button
          type="submit"

          disabled={
            status ===
            "loading"
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

            shadow-[0_14px_38px_rgba(255,90,31,0.18)]

            transition-all
            duration-300

            hover:-translate-y-[1px]
            hover:bg-[#ff682e]
            hover:shadow-[0_18px_46px_rgba(255,90,31,0.25)]

            disabled:pointer-events-none
            disabled:opacity-60

            sm:min-w-[172px]
          "
        >
          {status ===
          "loading" ? (
            <>
              Sending

              <Loader2
                size={
                  14
                }
                strokeWidth={
                  1.8
                }
                className="
                  animate-spin
                "
              />
            </>
          ) : (
            <>
              Send inquiry

              <ArrowRight
                size={
                  14
                }
                strokeWidth={
                  1.8
                }
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
   CUSTOM BOOKING
========================================================= */

function BookingPanel() {
  return (
    <BookingWizard />
  );
}