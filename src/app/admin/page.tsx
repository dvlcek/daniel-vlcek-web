import type {
  LucideIcon,
} from "lucide-react";

import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  LogOut,
  Mail,
  Users,
  Workflow,
  X,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import {
  DateTime,
} from "luxon";

import {
  BookingStatus,
  LeadSource,
  LeadStatus,
} from "@/generated/prisma/enums";

import {
  AdminAvailabilityPanel,
} from "@/components/admin/AdminAvailabilityPanel";

import {
  AdminFilters,
} from "@/components/admin/AdminFilters";

import {
  LeadStatusEditor,
} from "@/components/admin/LeadStatusEditor";

import {
  isAdminAuthenticated,
} from "@/lib/admin/auth";

import {
  bookingConfig,
} from "@/lib/booking/config";

import {
  getDb,
} from "@/lib/db";

export const dynamic =
  "force-dynamic";

type PageProps = {
  searchParams:
    Promise<{
      q?: string;
      leadStatus?: string;
      bookingStatus?: string;
      bookingView?: string;
      lead?: string;
      booking?: string;
    }>;
};

type ActivityTone =
  | "default"
  | "orange"
  | "success"
  | "warning"
  | "danger";

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  timestamp: Date;
  tone:
    ActivityTone;
};

function formatDateTime(
  value: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday:
        "short",

      day:
        "numeric",

      month:
        "short",

      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        false,

      timeZone:
        bookingConfig.timezone,
    },
  ).format(
    value,
  );
}

function formatDate(
  value: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day:
        "numeric",

      month:
        "short",

      year:
        "numeric",

      timeZone:
        bookingConfig.timezone,
    },
  ).format(
    value,
  );
}

function statusLabel(
  value: string,
): string {
  return value
    .toLowerCase()
    .replaceAll(
      "_",
      " ",
    )
    .replace(
      /\b\w/g,
      (
        character,
      ) =>
        character.toUpperCase(),
    );
}

function parseLeadStatus(
  value:
    string |
    undefined,
): LeadStatus | undefined {
  if (!value) {
    return undefined;
  }

  return Object.values(
    LeadStatus,
  ).includes(
    value as LeadStatus,
  )
    ? value as LeadStatus
    : undefined;
}

function parseBookingStatus(
  value:
    string |
    undefined,
): BookingStatus | undefined {
  if (!value) {
    return undefined;
  }

  return Object.values(
    BookingStatus,
  ).includes(
    value as BookingStatus,
  )
    ? value as BookingStatus
    : undefined;
}

function matchesSearch(
  query: string,

  values:
    Array<
      string |
      null |
      undefined
    >,
): boolean {
  if (!query) {
    return true;
  }

  const normalized =
    query.toLowerCase();

  return values.some(
    (
      value,
    ) =>
      value
        ?.toLowerCase()
        .includes(
          normalized,
        ) ??
      false,
  );
}

function bookingStatusClass(
  status:
    BookingStatus,
): string {
  switch (
    status
  ) {
    case BookingStatus.CONFIRMED:
      return "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200/85";

    case BookingStatus.COMPLETED:
      return "border-white/[0.13] bg-white/[0.06] text-white/70";

    case BookingStatus.NO_SHOW:
      return "border-amber-300/20 bg-amber-300/[0.08] text-amber-200/80";

    case BookingStatus.CANCELLED:
      return "border-red-300/20 bg-red-300/[0.07] text-red-200/75";

    default:
      return "border-white/[0.12] bg-white/[0.05] text-white/65";
  }
}

function activityToneClass(
  tone:
    ActivityTone,
): string {
  switch (
    tone
  ) {
    case "orange":
      return "bg-[#FF6B36] shadow-[0_0_14px_rgba(255,90,31,0.42)]";

    case "success":
      return "bg-emerald-400";

    case "warning":
      return "bg-amber-300";

    case "danger":
      return "bg-red-400";

    default:
      return "bg-white/40";
  }
}

export default async function AdminDashboardPage({
  searchParams,
}: PageProps) {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    redirect(
      "/admin/login",
    );
  }

  const params =
    await searchParams;

  const query =
    params.q
      ?.trim()
      .slice(
        0,
        100,
      ) ??
    "";

  const leadStatusFilter =
    parseLeadStatus(
      params.leadStatus,
    );

  const bookingStatusFilter =
    parseBookingStatus(
      params.bookingStatus,
    );

  const bookingView =
    params.bookingView ===
    "all"
      ? "all"
      : "upcoming";

  const selectedLeadId =
    params.lead
      ?.trim() ||
    null;

  const selectedBookingId =
    params.booking
      ?.trim() ||
    null;

  const db =
    getDb();

  const now =
    new Date();

  const nowLocal =
    DateTime.now().setZone(
      bookingConfig.timezone,
    );

  const monthStart =
    nowLocal
      .startOf(
        "month",
      )
      .toUTC()
      .toJSDate();

  const monthEnd =
    nowLocal
      .endOf(
        "month",
      )
      .toUTC()
      .toJSDate();

  const sevenDaysAgo =
    new Date(
      now.getTime() -
        7 *
          24 *
          60 *
          60 *
          1000,
    );

  const thirtyDaysAgo =
    new Date(
      now.getTime() -
        30 *
          24 *
          60 *
          60 *
          1000,
    );

  const [
    upcomingCalls,
    newLeads7d,
    callsThisMonth,
    websiteBookingLeads30d,
    convertedLeads30d,
    rawBookings,
    rawLeads,
    activityBookings,
    activityLeads,
    selectedLead,
    selectedBooking,
  ] =
    await Promise.all([
      db.booking.count({
        where: {
          status:
            BookingStatus.CONFIRMED,

          startsAt: {
            gte:
              now,
          },
        },
      }),

      db.lead.count({
        where: {
          createdAt: {
            gte:
              sevenDaysAgo,
          },
        },
      }),

      db.booking.count({
        where: {
          startsAt: {
            gte:
              monthStart,

            lte:
              monthEnd,
          },

          status: {
            in: [
              BookingStatus.CONFIRMED,
              BookingStatus.COMPLETED,
              BookingStatus.NO_SHOW,
            ],
          },
        },
      }),

      db.lead.count({
        where: {
          source:
            LeadSource.WEBSITE_BOOKING,

          createdAt: {
            gte:
              thirtyDaysAgo,
          },
        },
      }),

      db.lead.count({
        where: {
          source:
            LeadSource.WEBSITE_BOOKING,

          createdAt: {
            gte:
              thirtyDaysAgo,
          },

          status: {
            in: [
              LeadStatus.BOOKED,
              LeadStatus.QUALIFIED,
              LeadStatus.WON,
            ],
          },
        },
      }),

      db.booking.findMany({
        where: {
          ...(bookingStatusFilter
            ? {
                status:
                  bookingStatusFilter,
              }
            : {}),

          ...(bookingView ===
          "upcoming"
            ? {
                startsAt: {
                  gte:
                    now,
                },
              }
            : {}),
        },

        include: {
          lead:
            true,
        },

        orderBy: {
          startsAt:
            bookingView ===
            "upcoming"
              ? "asc"
              : "desc",
        },

        take:
          80,
      }),

      db.lead.findMany({
        where: {
          ...(leadStatusFilter
            ? {
                status:
                  leadStatusFilter,
              }
            : {}),
        },

        include: {
          bookings: {
            select: {
              id:
                true,

              status:
                true,

              startsAt:
                true,
            },

            orderBy: {
              startsAt:
                "desc",
            },

            take:
              1,
          },
        },

        orderBy: {
          createdAt:
            "desc",
        },

        take:
          100,
      }),

      db.booking.findMany({
        include: {
          lead: {
            select: {
              name:
                true,

              email:
                true,
            },
          },
        },

        orderBy: {
          updatedAt:
            "desc",
        },

        take:
          20,
      }),

      db.lead.findMany({
        select: {
          id:
            true,

          name:
            true,

          email:
            true,

          createdAt:
            true,
        },

        orderBy: {
          createdAt:
            "desc",
        },

        take:
          20,
      }),

      selectedLeadId
        ? db.lead.findUnique({
            where: {
              id:
                selectedLeadId,
            },

            include: {
              bookings: {
                orderBy: {
                  startsAt:
                    "desc",
                },
              },
            },
          })
        : Promise.resolve(
            null,
          ),

      selectedBookingId
        ? db.booking.findUnique({
            where: {
              id:
                selectedBookingId,
            },

            include: {
              lead:
                true,
            },
          })
        : Promise.resolve(
            null,
          ),
    ]);

  const bookings =
    rawBookings.filter(
      (
        booking,
      ) =>
        matchesSearch(
          query,
          [
            booking.lead.name,
            booking.lead.email,
            booking.lead.company,
            booking.lead.website,
          ],
        ),
    );

  const leads =
    rawLeads.filter(
      (
        lead,
      ) =>
        matchesSearch(
          query,
          [
            lead.name,
            lead.email,
            lead.company,
            lead.website,
            lead.phone,
            lead.message,
          ],
        ),
    );

  const conversionRate =
    websiteBookingLeads30d >
    0
      ? Math.round(
          (
            convertedLeads30d /
            websiteBookingLeads30d
          ) *
            100,
        )
      : 0;

  const systemChecks = [
    {
      label:
        "Database",

      ready:
        Boolean(
          process.env
            .DATABASE_URL,
        ),

      icon:
        Database,
    },

    {
      label:
        "Google Calendar",

      ready:
        Boolean(
          process.env
            .GOOGLE_CALENDAR_CLIENT_ID &&
            process.env
              .GOOGLE_CALENDAR_CLIENT_SECRET &&
            process.env
              .GOOGLE_CALENDAR_REFRESH_TOKEN,
        ),

      icon:
        CalendarDays,
    },

    {
      label:
        "Resend",

      ready:
        Boolean(
          process.env
            .RESEND_API_KEY,
        ),

      icon:
        Mail,
    },

    {
      label:
        "Reminder worker",

      ready:
        Boolean(
          process.env
            .CRON_SECRET &&
            process.env
              .BOOKING_MANAGE_SECRET,
        ),

      icon:
        Workflow,
    },
  ];

  const activity:
    ActivityItem[] =
    [];

  for (
    const lead of
    activityLeads
  ) {
    activity.push({
      id:
        `lead-${lead.id}`,

      title:
        "New lead",

      detail:
        `${lead.name} · ${lead.email}`,

      timestamp:
        lead.createdAt,

      tone:
        "orange",
    });
  }

  for (
    const booking of
    activityBookings
  ) {
    activity.push({
      id:
        `booking-${booking.id}`,

      title:
        "Booking created",

      detail:
        `${booking.lead.name} · ${formatDateTime(
          booking.startsAt,
        )}`,

      timestamp:
        booking.createdAt,

      tone:
        "default",
    });

    const scheduleDelta =
      Math.abs(
        booking
          .scheduleChangedAt
          .getTime() -
          booking
            .createdAt
            .getTime(),
      );

    if (
      scheduleDelta >
      5000
    ) {
      activity.push({
        id:
          `rescheduled-${booking.id}`,

        title:
          "Booking rescheduled",

        detail:
          `${booking.lead.name} · ${formatDateTime(
            booking.startsAt,
          )}`,

        timestamp:
          booking.scheduleChangedAt,

        tone:
          "orange",
      });
    }

    if (
      booking.status ===
      BookingStatus.CANCELLED
    ) {
      activity.push({
        id:
          `cancel-${booking.id}`,

        title:
          "Booking cancelled",

        detail:
          booking.lead.name,

        timestamp:
          booking.updatedAt,

        tone:
          "danger",
      });
    }

    if (
      booking.status ===
      BookingStatus.COMPLETED
    ) {
      activity.push({
        id:
          `complete-${booking.id}`,

        title:
          "Call completed",

        detail:
          booking.lead.name,

        timestamp:
          booking.updatedAt,

        tone:
          "success",
      });
    }

    if (
      booking.status ===
      BookingStatus.NO_SHOW
    ) {
      activity.push({
        id:
          `noshow-${booking.id}`,

        title:
          "No-show",

        detail:
          booking.lead.name,

        timestamp:
          booking.updatedAt,

        tone:
          "warning",
      });
    }
  }

  const recentActivity =
    activity
      .sort(
        (
          left,
          right,
        ) =>
          right
            .timestamp
            .getTime() -
          left
            .timestamp
            .getTime(),
      )
      .slice(
        0,
        14,
      );

  return (
    <main
      className="
        min-h-screen
        bg-[#0B1115]
        text-[#F4F6F7]
      "
      style={{
        backgroundColor:
          "#0B1115",
      }}
    >
      <div
        className="
          pointer-events-none
          fixed
          left-[6%]
          top-[-230px]
          h-[620px]
          w-[620px]
          rounded-full
          bg-[#FF5A1F]/[0.065]
          blur-[180px]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          right-[-100px]
          top-[15%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-slate-300/[0.025]
          blur-[160px]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          bottom-[-270px]
          left-[38%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-white/[0.025]
          blur-[180px]
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1540px]
          px-4
          pb-20
          pt-6

          sm:px-6

          lg:px-8
        "
      >
        <header
          className="
            flex
            flex-col
            gap-6
            border-b
            border-white/[0.10]
            pb-7

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#FF8054]
              "
            >
              Daniel VLKO
            </div>

            <h1
              className="
                mt-2.5
                text-[32px]
                font-medium
                tracking-[-0.05em]
                text-white

                sm:text-[38px]
              "
            >
              Control center.
            </h1>

            <p
              className="
                mt-3
                max-w-[640px]
                text-[13px]
                leading-[1.65]
                text-white/50
              "
            >
              Sales pipeline, calls, availability and booking
              infrastructure in one private workspace.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-emerald-300/[0.14]
                bg-emerald-300/[0.055]
                px-4
                py-2.5

                sm:flex
              "
            >
              <span
                className="
                  h-[6px]
                  w-[6px]
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_12px_rgba(52,211,153,0.7)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  text-emerald-200/70
                "
              >
                System live
              </span>
            </div>

            <form
              method="POST"
              action="/api/admin/logout"
            >
              <button
                type="submit"
                className="
                  flex
                  h-[40px]
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/[0.12]
                  bg-[#152027]
                  px-4
                  text-[11px]
                  font-semibold
                  text-white/55
                  transition-all

                  hover:border-white/[0.20]
                  hover:bg-[#1A252B]
                  hover:text-white
                "
              >
                <LogOut
                  size={13}
                  strokeWidth={1.7}
                />

                Logout
              </button>
            </form>
          </div>
        </header>

        <AdminFilters
          query={query}
          leadStatus={
            leadStatusFilter ??
            ""
          }
          bookingStatus={
            bookingStatusFilter ??
            ""
          }
          bookingView={
            bookingView
          }
        />

        <section
          className="
            mt-5
            grid
            gap-3

            sm:grid-cols-2

            xl:grid-cols-4
          "
        >
          <MetricCard
            label="Upcoming calls"
            value={String(
              upcomingCalls,
            )}
            description="Confirmed future calls"
            icon={CalendarDays}
          />

          <MetricCard
            label="New leads"
            value={String(
              newLeads7d,
            )}
            description="Created in the last 7 days"
            icon={Users}
          />

          <MetricCard
            label="Booking conversion"
            value={`${conversionRate}%`}
            description="Website booking leads · 30d"
            icon={Workflow}
          />

          <MetricCard
            label="Calls this month"
            value={String(
              callsThisMonth,
            )}
            description="Scheduled this calendar month"
            icon={Clock3}
          />
        </section>

        <div
          className="
            mt-5
            grid
            gap-5

            xl:grid-cols-[1.42fr_0.58fr]
          "
        >
          <section
            className="
              overflow-visible
              rounded-[20px]
              border
              border-white/[0.11]
              bg-[#11191E]
              shadow-[0_18px_50px_rgba(0,0,0,0.15)]
            "
          >
            <SectionHeader
              eyebrow="Calendar"
              title={
                bookingView ===
                "upcoming"
                  ? "Upcoming calls"
                  : "Bookings"
              }
              description={`${bookings.length} booking${
                bookings.length ===
                1
                  ? ""
                  : "s"
              } in the current view.`}
            />

            {bookings.length ===
            0 ? (
              <EmptyState
                title="No matching bookings."
                text="Try changing the filters or wait for the next booking."
              />
            ) : (
              <div>
                {bookings.map(
                  (
                    booking,
                    index,
                  ) => (
                    <div
                      key={booking.id}
                      className={`
                        px-5
                        py-5

                        sm:px-6

                        ${
                          index >
                          0
                            ? "border-t border-white/[0.08]"
                            : ""
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          flex-col
                          gap-4

                          lg:flex-row
                          lg:items-center
                          lg:justify-between
                        "
                      >
                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-2.5
                            "
                          >
                            <a
                              href={`/admin?booking=${encodeURIComponent(
                                booking.id,
                              )}`}
                              className="
                                truncate
                                text-[14px]
                                font-medium
                                text-white/90
                                transition-colors

                                hover:text-[#FF8A61]
                              "
                            >
                              {
                                booking
                                  .lead
                                  .name
                              }
                            </a>

                            <span
                              className={`
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[9px]
                                font-semibold

                                ${bookingStatusClass(
                                  booking.status,
                                )}
                              `}
                            >
                              {statusLabel(
                                booking.status,
                              )}
                            </span>
                          </div>

                          <p
                            className="
                              mt-1.5
                              truncate
                              text-[11px]
                              text-white/45
                            "
                          >
                            {
                              booking
                                .lead
                                .email
                            }
                          </p>

                          <div
                            className="
                              mt-3
                              flex
                              flex-wrap
                              gap-x-5
                              gap-y-2
                              text-[11px]
                              text-white/50
                            "
                          >
                            <span
                              className="
                                font-medium
                                text-white/65
                              "
                            >
                              {formatDateTime(
                                booking.startsAt,
                              )}
                            </span>

                            {booking
                              .lead
                              .company && (
                              <span>
                                {
                                  booking
                                    .lead
                                    .company
                                }
                              </span>
                            )}

                            {booking
                              .lead
                              .website && (
                              <span>
                                {
                                  booking
                                    .lead
                                    .website
                                }
                              </span>
                            )}
                          </div>

                          {booking
                            .lead
                            .message && (
                            <p
                              className="
                                mt-3
                                max-w-[680px]
                                text-[11px]
                                leading-[1.6]
                                text-white/42
                              "
                            >
                              {
                                booking
                                  .lead
                                  .message
                              }
                            </p>
                          )}
                        </div>

                        <div
                          className="
                            flex
                            shrink-0
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          {booking.meetingUrl && (
                            <a
                              href={
                                booking.meetingUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="
                                inline-flex
                                h-[38px]
                                items-center
                                gap-2
                                rounded-[10px]
                                bg-[#FF5A1F]
                                px-4
                                text-[10px]
                                font-semibold
                                text-white
                                transition-all

                                hover:bg-[#ff682e]
                              "
                            >
                              Join Meet

                              <ArrowUpRight
                                size={12}
                                strokeWidth={1.8}
                              />
                            </a>
                          )}

                          {booking.status ===
                            BookingStatus.CONFIRMED && (
                            <>
                              <BookingAction
                                bookingId={
                                  booking.id
                                }
                                status={
                                  BookingStatus.COMPLETED
                                }
                                label="Complete"
                              />

                              <BookingAction
                                bookingId={
                                  booking.id
                                }
                                status={
                                  BookingStatus.NO_SHOW
                                }
                                label="No-show"
                              />
                            </>
                          )}

                          {(booking.status ===
                            BookingStatus.COMPLETED ||
                            booking.status ===
                              BookingStatus.NO_SHOW) && (
                            <BookingAction
                              bookingId={
                                booking.id
                              }
                              status={
                                BookingStatus.CONFIRMED
                              }
                              label="Restore"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          <section
            className="
              overflow-hidden
              rounded-[20px]
              border
              border-white/[0.11]
              bg-[#11191E]
              shadow-[0_18px_50px_rgba(0,0,0,0.15)]
            "
          >
            <SectionHeader
              eyebrow="Infrastructure"
              title="System health"
              description="Production dependencies required by the booking system."
            />

            <div
              className="
                px-5
                pb-5

                sm:px-6
              "
            >
              {systemChecks.map(
                (
                  item,
                  index,
                ) => {
                  const Icon =
                    item.icon;

                  return (
                    <div
                      key={item.label}
                      className={`
                        flex
                        items-center
                        justify-between
                        gap-4
                        py-4

                        ${
                          index >
                          0
                            ? "border-t border-white/[0.08]"
                            : ""
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-[34px]
                            w-[34px]
                            items-center
                            justify-center
                            rounded-[9px]
                            border
                            border-white/[0.10]
                            bg-[#182329]
                          "
                        >
                          <Icon
                            size={14}
                            strokeWidth={1.6}
                            className="
                              text-white/50
                            "
                          />
                        </div>

                        <span
                          className="
                            text-[12px]
                            font-medium
                            text-white/65
                          "
                        >
                          {
                            item.label
                          }
                        </span>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <CheckCircle2
                          size={13}
                          strokeWidth={1.8}
                          className={
                            item.ready
                              ? "text-emerald-300/75"
                              : "text-red-300/65"
                          }
                        />

                        <span
                          className={`
                            text-[10px]
                            font-semibold

                            ${
                              item.ready
                                ? "text-emerald-200/65"
                                : "text-red-200/65"
                            }
                          `}
                        >
                          {item.ready
                            ? "Ready"
                            : "Missing"}
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </section>
        </div>

        <div
          className="
            mt-5
            grid
            gap-5

            xl:grid-cols-[1.42fr_0.58fr]
          "
        >
          <section
            className="
              overflow-visible
              rounded-[20px]
              border
              border-white/[0.11]
              bg-[#11191E]
              shadow-[0_18px_50px_rgba(0,0,0,0.15)]
            "
          >
            <SectionHeader
              eyebrow="CRM"
              title="Leads"
              description={`${leads.length} lead${
                leads.length ===
                1
                  ? ""
                  : "s"
              } in the current view.`}
            />

            {leads.length ===
            0 ? (
              <EmptyState
                title="No matching leads."
                text="Change the search or lead status filter."
              />
            ) : (
              <div
                className="
                  overflow-x-auto
                  overflow-y-visible
                "
              >
                <table
                  className="
                    w-full
                    min-w-[850px]
                    border-collapse
                  "
                >
                  <thead>
                    <tr
                      className="
                        border-b
                        border-white/[0.09]
                        bg-white/[0.025]
                        text-left
                      "
                    >
                      {[
                        "Lead",
                        "Company",
                        "Source",
                        "Last booking",
                        "Status",
                      ].map(
                        (
                          label,
                        ) => (
                          <th
                            key={label}
                            className="
                              px-6
                              py-3.5
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-[0.11em]
                              text-white/38
                            "
                          >
                            {label}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {leads.map(
                      (
                        lead,
                      ) => {
                        const latestBooking =
                          lead
                            .bookings[0];

                        return (
                          <tr
                            key={lead.id}
                            className="
                              border-b
                              border-white/[0.075]
                              transition-colors

                              hover:bg-white/[0.025]

                              last:border-b-0
                            "
                          >
                            <td
                              className="
                                px-6
                                py-4
                              "
                            >
                              <a
                                href={`/admin?lead=${encodeURIComponent(
                                  lead.id,
                                )}`}
                                className="
                                  text-[12px]
                                  font-medium
                                  text-white/80
                                  transition-colors

                                  hover:text-[#FF8A61]
                                "
                              >
                                {
                                  lead.name
                                }
                              </a>

                              <p
                                className="
                                  mt-1
                                  text-[10px]
                                  text-white/40
                                "
                              >
                                {
                                  lead.email
                                }
                              </p>
                            </td>

                            <td
                              className="
                                px-6
                                py-4
                                text-[11px]
                                text-white/50
                              "
                            >
                              {lead.company ??
                                "—"}
                            </td>

                            <td
                              className="
                                px-6
                                py-4
                                text-[10px]
                                text-white/42
                              "
                            >
                              {statusLabel(
                                lead.source,
                              )}
                            </td>

                            <td
                              className="
                                px-6
                                py-4
                                text-[11px]
                                text-white/48
                              "
                            >
                              {latestBooking
                                ? formatDateTime(
                                    latestBooking.startsAt,
                                  )
                                : "—"}
                            </td>

                            <td
                              className="
                                px-6
                                py-4
                              "
                            >
                              <LeadStatusEditor
                                leadId={
                                  lead.id
                                }
                                status={
                                  lead.status
                                }
                              />
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section
            className="
              overflow-hidden
              rounded-[20px]
              border
              border-white/[0.11]
              bg-[#11191E]
              shadow-[0_18px_50px_rgba(0,0,0,0.15)]
            "
          >
            <SectionHeader
              eyebrow="Operations"
              title="Recent activity"
              description="Latest CRM and booking lifecycle changes."
            />

            <div
              className="
                px-5
                pb-5

                sm:px-6
              "
            >
              {recentActivity.length ===
              0 ? (
                <div
                  className="
                    py-8
                    text-[11px]
                    text-white/40
                  "
                >
                  No activity yet.
                </div>
              ) : (
                recentActivity.map(
                  (
                    item,
                    index,
                  ) => (
                    <div
                      key={item.id}
                      className={`
                        flex
                        gap-3
                        py-3.5

                        ${
                          index >
                          0
                            ? "border-t border-white/[0.075]"
                            : ""
                        }
                      `}
                    >
                      <div
                        className="
                          pt-[5px]
                        "
                      >
                        <span
                          className={`
                            block
                            h-[6px]
                            w-[6px]
                            rounded-full

                            ${activityToneClass(
                              item.tone,
                            )}
                          `}
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <p
                          className="
                            text-[11px]
                            font-medium
                            text-white/65
                          "
                        >
                          {
                            item.title
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            truncate
                            text-[10px]
                            text-white/38
                          "
                        >
                          {
                            item.detail
                          }
                        </p>
                      </div>

                      <span
                        className="
                          shrink-0
                          text-[9px]
                          text-white/30
                        "
                      >
                        {formatDate(
                          item.timestamp,
                        )}
                      </span>
                    </div>
                  ),
                )
              )}
            </div>
          </section>
        </div>

        <AdminAvailabilityPanel />
      </div>

      {selectedLead && (
        <DetailOverlay>
          <DetailHeader
            eyebrow="CRM lead"
            title={selectedLead.name}
          />

          <DetailRow
            label="Email"
            value={selectedLead.email}
          />

          <DetailRow
            label="Company"
            value={
              selectedLead.company ??
              "—"
            }
          />

          <DetailRow
            label="Website"
            value={
              selectedLead.website ??
              "—"
            }
          />

          <DetailRow
            label="Phone"
            value={
              selectedLead.phone ??
              "—"
            }
          />

          <DetailRow
            label="Source"
            value={statusLabel(
              selectedLead.source,
            )}
          />

          <DetailRow
            label="Status"
            value={statusLabel(
              selectedLead.status,
            )}
          />

          <DetailRow
            label="Created"
            value={formatDateTime(
              selectedLead.createdAt,
            )}
          />

          {selectedLead.message && (
            <div
              className="
                mt-6
                rounded-[13px]
                border
                border-white/[0.10]
                bg-[#172127]
                p-4
              "
            >
              <div
                className="
                  text-[10px]
                  font-semibold
                  text-white/40
                "
              >
                Bottleneck / context
              </div>

              <p
                className="
                  mt-3
                  text-[12px]
                  leading-[1.7]
                  text-white/60
                "
              >
                {
                  selectedLead.message
                }
              </p>
            </div>
          )}

          <div
            className="
              mt-7
            "
          >
            <div
              className="
                text-[10px]
                font-semibold
                text-white/40
              "
            >
              Booking history
            </div>

            <div
              className="
                mt-3
                space-y-2
              "
            >
              {selectedLead.bookings.length ===
              0 ? (
                <div
                  className="
                    text-[11px]
                    text-white/35
                  "
                >
                  No bookings.
                </div>
              ) : (
                selectedLead.bookings.map(
                  (
                    booking,
                  ) => (
                    <div
                      key={booking.id}
                      className="
                        rounded-[11px]
                        border
                        border-white/[0.10]
                        bg-[#172127]
                        p-3
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        <span
                          className="
                            text-[11px]
                            text-white/60
                          "
                        >
                          {formatDateTime(
                            booking.startsAt,
                          )}
                        </span>

                        <span
                          className="
                            text-[9px]
                            font-medium
                            text-white/40
                          "
                        >
                          {statusLabel(
                            booking.status,
                          )}
                        </span>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </div>
        </DetailOverlay>
      )}

      {selectedBooking && (
        <DetailOverlay>
          <DetailHeader
            eyebrow="Booking"
            title={
              selectedBooking
                .lead
                .name
            }
          />

          <DetailRow
            label="Status"
            value={statusLabel(
              selectedBooking.status,
            )}
          />

          <DetailRow
            label="Date"
            value={formatDateTime(
              selectedBooking.startsAt,
            )}
          />

          <DetailRow
            label="Timezone"
            value={
              selectedBooking.timezone
            }
          />

          <DetailRow
            label="Email"
            value={
              selectedBooking
                .lead
                .email
            }
          />

          <DetailRow
            label="Company"
            value={
              selectedBooking
                .lead
                .company ??
              "—"
            }
          />

          <DetailRow
            label="Website"
            value={
              selectedBooking
                .lead
                .website ??
              "—"
            }
          />

          <DetailRow
            label="24h reminder"
            value={
              selectedBooking
                .reminder24hEmailId
                ? "Sent"
                : "Not sent"
            }
          />

          <DetailRow
            label="30m reminder"
            value={
              selectedBooking
                .reminder30mEmailId
                ? "Sent"
                : "Not sent"
            }
          />

          {selectedBooking.meetingUrl && (
            <a
              href={
                selectedBooking.meetingUrl
              }
              target="_blank"
              rel="noreferrer"
              className="
                mt-7
                flex
                h-[44px]
                items-center
                justify-center
                gap-2
                rounded-[11px]
                bg-[#FF5A1F]
                text-[11px]
                font-semibold
                text-white
              "
            >
              Open Google Meet

              <ExternalLink
                size={12}
              />
            </a>
          )}

          {selectedBooking.externalCalendarUrl && (
            <a
              href={
                selectedBooking.externalCalendarUrl
              }
              target="_blank"
              rel="noreferrer"
              className="
                mt-2
                flex
                h-[44px]
                items-center
                justify-center
                gap-2
                rounded-[11px]
                border
                border-white/[0.12]
                bg-[#172127]
                text-[11px]
                font-semibold
                text-white/55
                transition-all

                hover:bg-[#1B272D]
                hover:text-white
              "
            >
              Open calendar event

              <ExternalLink
                size={12}
              />
            </a>
          )}
        </DetailOverlay>
      )}
    </main>
  );
}

function BookingAction({
  bookingId,
  status,
  label,
}: {
  bookingId: string;
  status:
    BookingStatus;
  label: string;
}) {
  return (
    <form
      method="POST"
      action="/api/admin/bookings/status"
    >
      <input
        type="hidden"
        name="bookingId"
        value={bookingId}
      />

      <input
        type="hidden"
        name="status"
        value={status}
      />

      <button
        type="submit"
        className="
          h-[38px]
          rounded-[10px]
          border
          border-white/[0.12]
          bg-[#172127]
          px-4
          text-[10px]
          font-semibold
          text-white/50
          transition-all

          hover:border-white/[0.20]
          hover:bg-[#1B272D]
          hover:text-white
        "
      >
        {label}
      </button>
    </form>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon:
    Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon:
    LucideIcon;
}) {
  return (
    <div
      className="
        rounded-[19px]
        border
        border-white/[0.11]
        bg-[#11191E]
        p-5
        shadow-[0_14px_40px_rgba(0,0,0,0.14)]
        transition-all

        hover:border-white/[0.15]
        hover:bg-[#131C21]
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <span
          className="
            text-[10px]
            font-semibold
            text-white/40
          "
        >
          {label}
        </span>

        <div
          className="
            flex
            h-[31px]
            w-[31px]
            items-center
            justify-center
            rounded-[9px]
            border
            border-white/[0.09]
            bg-[#172127]
          "
        >
          <Icon
            size={14}
            strokeWidth={1.6}
            className="
              text-white/45
            "
          />
        </div>
      </div>

      <div
        className="
          mt-5
          text-[34px]
          font-medium
          tracking-[-0.05em]
          text-white
        "
      >
        {value}
      </div>

      <div
        className="
          mt-2
          text-[10px]
          leading-[1.5]
          text-white/38
        "
      >
        {description}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        border-b
        border-white/[0.09]
        px-5
        py-5

        sm:px-6
      "
    >
      <div
        className="
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-[#FF8054]
        "
      >
        {eyebrow}
      </div>

      <h2
        className="
          mt-2
          text-[18px]
          font-medium
          tracking-[-0.03em]
          text-white/95
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-1.5
          text-[11px]
          leading-[1.6]
          text-white/43
        "
      >
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        px-6
        py-14
        text-center
      "
    >
      <Activity
        size={22}
        strokeWidth={1.4}
        className="
          mx-auto
          text-white/30
        "
      />

      <p
        className="
          mt-4
          text-[13px]
          font-medium
          text-white/62
        "
      >
        {title}
      </p>

      <p
        className="
          mx-auto
          mt-2
          max-w-[320px]
          text-[11px]
          leading-[1.6]
          text-white/38
        "
      >
        {text}
      </p>
    </div>
  );
}

function DetailOverlay({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[250]
        flex
        justify-end
        bg-black/55
        backdrop-blur-[9px]
      "
    >
      <a
        href="/admin"
        aria-label="Close details"
        className="
          absolute
          inset-0
        "
      />

      <aside
        className="
          relative
          z-10
          h-full
          w-full
          max-w-[430px]
          overflow-y-auto
          border-l
          border-white/[0.12]
          bg-[#11191E]
          px-6
          pb-10
          pt-6
          shadow-[-40px_0_100px_rgba(0,0,0,0.40)]
        "
      >
        <a
          href="/admin"
          className="
            ml-auto
            flex
            h-[36px]
            w-[36px]
            items-center
            justify-center
            rounded-full
            border
            border-white/[0.12]
            bg-[#172127]
            text-white/45
            transition-all

            hover:bg-[#1B272D]
            hover:text-white
          "
          aria-label="Close details"
        >
          <X
            size={14}
            strokeWidth={1.7}
          />
        </a>

        {children}
      </aside>
    </div>
  );
}

function DetailHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div
      className="
        mb-7
        border-b
        border-white/[0.09]
        pb-6
      "
    >
      <div
        className="
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-[#FF8054]
        "
      >
        {eyebrow}
      </div>

      <h2
        className="
          mt-3
          text-[26px]
          font-medium
          tracking-[-0.045em]
          text-white
        "
      >
        {title}
      </h2>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-6
        border-b
        border-white/[0.075]
        py-3.5
      "
    >
      <span
        className="
          text-[10px]
          font-medium
          text-white/35
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[250px]
          break-words
          text-right
          text-[11px]
          leading-[1.5]
          text-white/65
        "
      >
        {value}
      </span>
    </div>
  );
}