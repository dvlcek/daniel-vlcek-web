# Contact tracking

All booking and contact CTAs navigate to `/contact`. The page uses the existing
booking API; selecting a time and confirming a booking still use the same flow.
Contact and legal pages remain accessible even with the coming-soon gate enabled.

Vercel Web Analytics records `/contact` page views after analytics consent.
The following custom events also require consent:

| Event | Trigger | Properties |
| --- | --- | --- |
| `contact_click` | A contact CTA is clicked | `path`, `source` |
| `booking_time_selected` | An available slot is selected | `path` |
| `booking_confirmed` | The server confirms the booking | `path` |

CTA sources: `header`, `hero`, `system`, `services`, `process`, `about`,
`final-cta`, `footer`, `coming-soon-header`, `coming-soon-booking`,
`coming-soon-contact`.

In the Vercel project's Analytics tab, filter page views by `/contact`. If custom
events are supported by the project's plan, use Events and filter `contact_click`
by `source` to compare CTAs. Compare `/contact` views, time selections and confirmed
bookings to inspect drop-off. Repeat time selections can generate multiple events.

Enable Web Analytics for the Vercel project and deploy the changes before checking
production traffic. Local development logs events instead of sending production
traffic. See [Vercel custom events](https://vercel.com/docs/analytics/custom-events).

Only public paths and fixed CTA labels are sent. Names, email addresses, website
URLs, messages, booking IDs, selected times and query parameters are excluded.
Rejecting or withdrawing analytics consent prevents subsequent custom events.
