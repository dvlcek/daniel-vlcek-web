import Link from "next/link";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AdminDetailDrawer } from "@/components/admin/AdminDetailDrawer";
import styles from "./AdminDashboard.module.css";

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
    <main id="main-content" tabIndex={-1} className={styles.workspace}>
      <div className={styles.shell}>
        <AdminNavigation timezone={bookingConfig.timezone} />
        <div className={styles.content}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Private workspace</p>
              <h1>Control center.</h1>
              <p>Manage your calls, leads and booking availability.</p>
            </div>
            <div className={styles.headerActions}>
              <Link href="/" target="_blank" className={styles.button}>
                View website <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <form method="POST" action="/api/admin/logout">
                <button type="submit" className={styles.button}>
                  <LogOut size={16} aria-hidden="true" /> Logout
                </button>
              </form>
            </div>
          </header>

          <section id="overview" aria-label="Business overview" className={styles.metrics}>
            <MetricCard label="Upcoming calls" value={String(upcomingCalls)}
              description="Confirmed future calls" icon={CalendarDays} />
            <MetricCard label="New leads" value={String(newLeads7d)}
              description="Created in the last 7 days" icon={Users} />
            <MetricCard label="Booking conversion" value={`${conversionRate}%`}
              description="Website booking leads · 30d" icon={Workflow} />
            <MetricCard label="Calls this month" value={String(callsThisMonth)}
              description="Scheduled this calendar month" icon={Clock3} />
          </section>

          <AdminFilters key={JSON.stringify([query, leadStatusFilter, bookingStatusFilter, bookingView])} query={query} leadStatus={leadStatusFilter ?? ""}
            bookingStatus={bookingStatusFilter ?? ""} bookingView={bookingView} />

          <div className={styles.overviewGrid}>
            <section id="bookings" aria-labelledby="bookings-heading" className={styles.panel}>
              <SectionHeader id="bookings-heading" eyebrow="Calendar"
                title={bookingView === "upcoming" ? "Upcoming calls" : "Bookings"}
                description={`${bookings.length} booking${bookings.length === 1 ? "" : "s"} in the current view.`}>
                <Link href={`${detailHref(params, null)}#availability`} className={styles.button}>
                  <Clock3 size={15} aria-hidden="true" /> Edit availability
                </Link>
              </SectionHeader>
              {bookings.length === 0 ? (
                <EmptyState title="No matching bookings." text="Try changing the filters or wait for the next booking." />
              ) : (
                <div>
                  {bookings.map((booking) => (
                    <article key={booking.id} className={styles.bookingRow}>
                      <div className={styles.bookingTop}>
                        <div className={styles.bookingName}>
                          <Link href={detailHref(params, "booking", booking.id)} scroll={false} className={styles.textLink}>
                            {booking.lead.name}
                          </Link>
                          <span className={`${styles.badge} ${bookingStatusClass(booking.status)}`}>
                            {statusLabel(booking.status)}
                          </span>
                        </div>
                        <span className={styles.bookingDate}>
                          <CalendarDays size={15} aria-hidden="true" />
                          {formatDateTime(booking.startsAt)}
                        </span>
                      </div>
                      <p className={styles.contactLine}>{booking.lead.email}</p>
                      <div className={styles.bookingMeta}>
                        {booking.lead.company && <span>{booking.lead.company}</span>}
                        {booking.lead.website && <span>{booking.lead.website}</span>}
                      </div>
                      {booking.lead.message && <p className={styles.context}>{booking.lead.message}</p>}
                      <div className={styles.actions}>
                        <Link href={detailHref(params, "booking", booking.id)} scroll={false} className={styles.button}>View details</Link>
                        {booking.meetingUrl && (
                          <a href={booking.meetingUrl} target="_blank" rel="noreferrer" className={styles.primaryButton}>
                            Join Meet <ArrowUpRight size={15} aria-hidden="true" />
                          </a>
                        )}
                        {booking.status === BookingStatus.CONFIRMED && (
                          <>
                            <BookingAction bookingId={booking.id} status={BookingStatus.COMPLETED} label="Complete" />
                            <BookingAction bookingId={booking.id} status={BookingStatus.NO_SHOW} label="No-show" />
                          </>
                        )}
                        {(booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.NO_SHOW) && (
                          <BookingAction bookingId={booking.id} status={BookingStatus.CONFIRMED} label="Restore" />
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section id="system" aria-labelledby="system-heading" className={styles.panel}>
              <SectionHeader id="system-heading" eyebrow="Infrastructure" title="System health"
                description="Production dependencies required by the booking system." />
              <div className={styles.systemList}>
                {systemChecks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className={styles.systemRow}>
                      <span className={styles.systemName}><Icon size={16} aria-hidden="true" />{item.label}</span>
                      <span className={`${styles.systemState} ${item.ready ? styles.ready : styles.missing}`}>
                        <CheckCircle2 size={15} aria-hidden="true" />{item.ready ? "Ready" : "Missing"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <section id="leads" aria-labelledby="leads-heading" className={`${styles.panel} ${styles.section}`}>
            <SectionHeader id="leads-heading" eyebrow="CRM" title="Leads"
              description={`${leads.length} lead${leads.length === 1 ? "" : "s"} in the current view.`} />
            {leads.length === 0 ? (
              <EmptyState title="No matching leads." text="Change the search or lead status filter." />
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.leadsTable} aria-label="CRM leads">
                  <thead>
                    <tr>{["Lead", "Company", "Source", "Last booking", "Status"].map((label) => (
                      <th key={label} scope="col">{label}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => {
                      const latestBooking = lead.bookings[0];
                      return (
                        <tr key={lead.id}>
                          <td data-label="Lead">
                            <Link href={detailHref(params, "lead", lead.id)} scroll={false} className={styles.textLink}>{lead.name}</Link>
                            <p>{lead.email}</p>
                          </td>
                          <td data-label="Company">{lead.company ?? "—"}</td>
                          <td data-label="Source">{statusLabel(lead.source)}</td>
                          <td data-label="Last booking">{latestBooking ? formatDateTime(latestBooking.startsAt) : "—"}</td>
                          <td data-label="Status"><LeadStatusEditor leadId={lead.id} status={lead.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <AdminAvailabilityPanel />

          <section id="activity" aria-labelledby="activity-heading" className={`${styles.panel} ${styles.section}`}>
            <SectionHeader id="activity-heading" eyebrow="Operations" title="Recent activity"
              description="Latest CRM and booking lifecycle changes." />
            {recentActivity.length === 0 ? (
              <EmptyState title="No activity yet." text="CRM and booking updates will appear here." />
            ) : (
              <div className={styles.activityList}>
                {recentActivity.map((item) => (
                  <div key={item.id} className={styles.activityItem}>
                    <span className={`${styles.activityDot} ${activityToneClass(item.tone)}`} aria-hidden="true" />
                    <div className={styles.activityText}><p>{item.title}</p><span>{item.detail}</span></div>
                    <time dateTime={item.timestamp.toISOString()}>{formatDate(item.timestamp)}</time>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {selectedLead && (
        <DetailOverlay title={`Lead: ${selectedLead.name}`}>
          <DetailHeader eyebrow="CRM lead" title={selectedLead.name} />
          <dl>
            <DetailRow label="Email" value={selectedLead.email} />
            <DetailRow label="Company" value={selectedLead.company ?? "—"} />
            <DetailRow label="Website" value={selectedLead.website ?? "—"} />
            <DetailRow label="Phone" value={selectedLead.phone ?? "—"} />
            <DetailRow label="Source" value={statusLabel(selectedLead.source)} />
            <DetailRow label="Status" value={statusLabel(selectedLead.status)} />
            <DetailRow label="Created" value={formatDateTime(selectedLead.createdAt)} />
          </dl>
          {selectedLead.message && (
            <div className={styles.detailSection}>
              <h3>Bottleneck / context</h3><p className={styles.context}>{selectedLead.message}</p>
            </div>
          )}
          <div className={styles.detailSection}>
            <h3>Booking history</h3>
            {selectedLead.bookings.length === 0 ? <p className={styles.contactLine}>No bookings.</p> :
              selectedLead.bookings.map((booking) => (
                <Link key={booking.id} href={detailHref(params, "booking", booking.id)} scroll={false} className={styles.historyItem}>
                  <span>{formatDateTime(booking.startsAt)}</span><span>{statusLabel(booking.status)}</span>
                </Link>
              ))}
          </div>
        </DetailOverlay>
      )}
      {selectedBooking && (
        <DetailOverlay title={`Booking: ${selectedBooking.lead.name}`}>
          <DetailHeader eyebrow="Booking" title={selectedBooking.lead.name} />
          <dl>
            <DetailRow label="Status" value={statusLabel(selectedBooking.status)} />
            <DetailRow label="Date" value={formatDateTime(selectedBooking.startsAt)} />
            <DetailRow label="Ends" value={formatDateTime(selectedBooking.endsAt)} />
            <DetailRow label="Timezone" value={selectedBooking.timezone} />
            <DetailRow label="Email" value={selectedBooking.lead.email} />
            <DetailRow label="Company" value={selectedBooking.lead.company ?? "—"} />
            <DetailRow label="Website" value={selectedBooking.lead.website ?? "—"} />
            <DetailRow label="Phone" value={selectedBooking.lead.phone ?? "—"} />
            <DetailRow label="24h reminder" value={selectedBooking.reminder24hEmailId ? "Sent" : "Not sent"} />
            <DetailRow label="30m reminder" value={selectedBooking.reminder30mEmailId ? "Sent" : "Not sent"} />
          </dl>
          {selectedBooking.lead.message && (
            <div className={styles.detailSection}>
              <h3>Bottleneck / context</h3><p className={styles.context}>{selectedBooking.lead.message}</p>
            </div>
          )}
          <div className={styles.actions}>
            {selectedBooking.meetingUrl && (
              <a href={selectedBooking.meetingUrl} target="_blank" rel="noreferrer" className={styles.primaryButton}>
                Open Google Meet <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
            {selectedBooking.externalCalendarUrl && (
              <a href={selectedBooking.externalCalendarUrl} target="_blank" rel="noreferrer" className={styles.button}>
                Open calendar event <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
          </div>
        </DetailOverlay>
      )}
    </main>
  );
}

function detailHref(
  params: Awaited<PageProps["searchParams"]>,
  kind: "lead" | "booking" | null,
  id?: string,
) {
  const search = new URLSearchParams();
  for (const key of ["q", "leadStatus", "bookingStatus", "bookingView"] as const) {
    if (params[key]) search.set(key, params[key]);
  }
  if (kind && id) search.set(kind, id);
  return search.size ? `/admin?${search}` : "/admin";
}

function BookingAction({ bookingId, status, label }: { bookingId: string; status: BookingStatus; label: string }) {
  return (
    <form method="POST" action="/api/admin/bookings/status">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={styles.button}>{label}</button>
    </form>
  );
}

function MetricCard({ label, value, description, icon: Icon }: {
  label: string; value: string; description: string; icon: LucideIcon;
}) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricTop}><span>{label}</span><Icon size={19} strokeWidth={1.7} aria-hidden="true" /></div>
      <div className={styles.metricValue}>{value}</div><p>{description}</p>
    </div>
  );
}

function SectionHeader({ id, eyebrow, title, description, children }: {
  id: string; eyebrow: string; title: string; description: string; children?: React.ReactNode;
}) {
  return (
    <div className={styles.sectionHeader}>
      <div><span className={styles.eyebrow}>{eyebrow}</span><h2 id={id}>{title}</h2><p>{description}</p></div>
      {children}
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className={styles.empty}><Activity size={25} strokeWidth={1.5} aria-hidden="true" /><p>{title}</p><span>{text}</span></div>;
}

function DetailOverlay({ title, children }: { title: string; children: React.ReactNode }) {
  return <AdminDetailDrawer title={title}>{children}</AdminDetailDrawer>;
}

function DetailHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className={styles.detailHeader}><span className={styles.eyebrow}>{eyebrow}</span><h2>{title}</h2></div>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <div className={styles.detailRow}><dt>{label}</dt><dd>{value}</dd></div>;
}
