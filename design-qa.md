# Selected Work design QA

- Source visual truth: user-attached reference screenshot in this conversation.
- Source pixels: 1672 × 941.
- Implementation screenshot: unavailable; neither the in-app browser nor the Chrome fallback is available in this session.
- Intended CSS viewport: 1672 × 941 at device scale factor 1.
- State: homepage scrolled to `#work`.

## Full-view comparison evidence

Blocked. The source reference is visible in the conversation, but a browser-rendered implementation capture could not be produced.

## Focused region comparison evidence

Blocked for the same reason. Code-level inspection covered the intro, featured card, secondary row, image sources, metrics, CTA targets, breakpoints, and section transition ownership.

## Findings

- No browser-rendered evidence is available for typography, wrapping, image crop, overflow, or exact spatial comparison.
- The implementation uses the requested 1520px master width, 340px/36px desktop split, 44%/56% featured split, 52%/48% secondary split, and a 16px card gap.
- Both formerly missing secondary image paths now point to existing repository assets.
- The following Process section remains the sole owner of the curved transition.

## Comparison history

- No visual iteration could be completed because browser surfaces are unavailable.

## Primary interactions tested

- Not browser-tested. Anchor targets and focus-visible styles were verified in source.

## Console errors checked

- Not available without a browser-rendered session.

## Implementation checklist

- Capture 375×812, 768×1024, 1280×800, 1440×900, 1672×941, and 1920×1080 when a browser surface is available.
- Confirm exact headline wrapping, secondary-card content fit, and image focal crops.
- Confirm no horizontal overflow and no console image errors.

final result: blocked
