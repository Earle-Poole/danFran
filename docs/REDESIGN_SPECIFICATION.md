# Daniel Franzese — Editorial Redesign Specification

Version: 1.0 · September 6, 2026 · Branch: `codex/editorial-redesign`

Status: implementation design baseline. This document records the design decisions for the redesign; it does not claim that the site has been rebuilt or accessibility-tested. Base application revision: `4096fe4`.

### Contents

- [Purpose and decision authority](#1-purpose-and-decision-authority)
- [Information architecture and URL behavior](#2-information-architecture-and-url-behavior)
- [Global visual system](#3-global-visual-system)
- [Shared component contracts](#4-shared-component-contracts)
- [Page-by-page design decisions](#5-page-by-page-design-decisions)
- [Accessible motion and page transitions](#6-accessible-motion-and-page-transitions)
- [Accessibility baseline and acceptance policy](#7-accessibility-baseline-and-acceptance-policy)
- [Implementation map and sequence](#8-implementation-map-and-sequence)
- [Consolidated decision log](#9-consolidated-decision-log)
- [Outstanding verification](#10-outstanding-verification-not-undecided-visual-direction)

## 1. Purpose and decision authority

Give Daniel a recognizable, expressive professional identity while making three visitor tasks straightforward: explore his work, obtain press materials, and make a booking inquiry. Fans should also be able to find videos, Cameo, the shop, and updates without confusing those services with professional booking.

The agreed direction is editorial: large condensed headlines, authentic photography, warm ivory, near-black, and a selective raspberry accent. The website should feel personal, confident, welcoming, and easy to use.

This specification is the source of truth when the generated concepts disagree. The concepts vary in button color, navigation typography, footer copy, and spacing; those variations are resolved here. Implement semantic HTML and original image files, never a screenshot of a generated page.

Decision priority:

1. User requirements: existing photography only, a consistent system, and accessible interaction and animation.
2. Functional access to content and tasks, including keyboard and assistive technology access.
3. Shared tokens and component contracts in this document.
4. Page-specific structure and content requirements.
5. Concept images as composition references.

New exceptions must be recorded in the decision log with a reason, affected components, responsive behavior, accessibility implications, and verification criteria. Do not silently introduce another font, button treatment, footer, or animation style.

### 1.1 Concept references

The concept images are stored locally under `output/redesign-concepts/`.

| Concept | Design intent | Implementation correction |
| --- | --- | --- |
| Revised homepage (`home.png`) | Split portrait hero, oversized identity, three clear destinations | Use shared navigation and footer, original photos, and approved color pairs below |
| About (`about.png`) | Editorial biography, selected credits, advocacy | Use the same button and body type rules as every page |
| Press kit (`press-kit.png`) | Downloads first, concise biography, photography and contact | Use actual downloadable files and record missing metadata; do not invent download bundles |
| Modeling gallery (`modeling-gallery.png`) | Deliberate photo scale and gutters | Preserve source image proportions and logical reading order |
| Video gallery (`video-gallery.png`) | Featured video and a browsable grid | Use existing video thumbnails; typographic covers are the fallback |

Generation prompts remain local exploration history rather than part of the maintained specification. The earlier concept containing an invented stage portrait is rejected and must not be used.

### 1.2 Scope

Deliver the shared design system, redesigned home, dedicated About and Booking pages, press kit, modeling gallery, video gallery, and consistent fallback states. Preserve existing useful content and URLs. The external shop and Cameo remain external destinations. The calendar now has an authorized live appearances integration backed by the private, read-only source described in [GOOGLE_CALENDAR.md](GOOGLE_CALENDAR.md): it refreshes request-driven data at the configured 60-second default and remains conditional on verified upcoming events.

Do not invent show dates, reviews, awards, audience statistics, film stills, photographer credits, downloadable file sizes, or current availability. Existing biography and contact data are a starting point, not independent verification of current facts.

## 2. Information architecture and URL behavior

| Destination | Route | Change and role |
| --- | --- | --- |
| Home | `/` | Canonical introduction, selected destinations, compact fan actions |
| Legacy home | `/home` | Render the same home content; canonical metadata points to `/`; retain old fragment targets |
| About | `/about` | New dedicated biography and selected screen work page |
| Press | `/press-kit` | Retain route; reorganize around useful assets and press inquiries |
| Portraits | `/modeling-gallery` | Retain route; label as Portraits within Work navigation |
| Videos | `/video-gallery` | Retain route; featured player plus categories and grid |
| Booking | `/booking` | New professional inquiry page with actual contact links |
| Calendar | `/calendar` | Dedicated Appearances schedule; conditional navigation/sitemap inclusion follows the positive ready feed |
| Shop | Existing Creator Spring URL | External link; no new local shop or invented products |
| Cameo | Existing Cameo URL | External fan service, distinct from professional bookings |
| Missing page | 404 | Helpful recovery within the shared shell |

Keep `#home`, `#about`, `#cameo`, and `#contact` on both home aliases. `#about` lands on the short About preview, which links to `/about`; `#contact` lands on the shared booking/footer band, which links to `/booking#booking-details`. Do not rely on a server redirect inspecting a URL fragment: fragments are not sent to the server. Keep meaningful alias content available without JavaScript.

The primary navigation is **Work, About, Press, Shop, Book Daniel**, in that order. The identity links home. Work is a disclosure button, not a link to an unspecified future page. Its links are **Videos**, **Portraits**, and **Selected screen work** (`/about#selected-work`). Do not introduce a redundant Work landing page in this phase.

Use descriptive titles: `Daniel Franzese | Actor, Comedian & Activist`, `About | Daniel Franzese`, `Press Kit | Daniel Franzese`, `Portraits | Daniel Franzese`, `Videos | Daniel Franzese`, and `Booking | Daniel Franzese`. Replace create-next-app descriptions with short page-specific descriptions. Preserve correct social metadata using original photography.

## 3. Global visual system

### 3.1 Color tokens and approved combinations

Define tokens once in global CSS and expose the same names through Tailwind. Page styles may consume tokens but may not redefine them.

| Token | Value | Role |
| --- | --- | --- |
| `--color-paper` | `#F6F1E8` | Default page surface |
| `--color-ink` | `#181818` | Primary text, dark surfaces, default buttons |
| `--color-muted` | `#59544E` | Secondary text on paper |
| `--color-pink` | `#E8448A` | Accent bands and selected highlights; pair with ink text |
| `--color-raspberry` | `#A91D55` | Small accent text/links on paper and dark accent buttons |
| `--color-white` | `#FFFFFF` | Text on raspberry; focus-ring contrast layer |
| `--color-rule` | `#CFC7BB` | Decorative dividers only |
| `--color-control-border` | `#82786E` | Form/input boundaries on paper |
| `--color-error` | `#B42318` | Error text and outline on paper |
| `--color-success` | `#24613E` | Success text on paper |

Calculated solid-color contrast ratios, using sRGB relative luminance:

| Foreground / background | Ratio | Decision |
| --- | --- | --- |
| Ink / paper | 15.78:1 | Primary reading pair; inverse is also approved |
| Muted / paper | 6.66:1 | Secondary copy and metadata |
| Ink / pink | 4.76:1 | Pink bands and pink controls; keep fully opaque |
| White / pink | 3.73:1 | Prohibited for UI/body text; replace white labels in mockups |
| Raspberry / paper | 6.23:1 | Underlined accent links and small labels |
| White / raspberry | 7.01:1 | Approved alternate button pair |
| Error / paper | 5.84:1 | Error messages with text and an icon |
| Success / paper | 6.54:1 | Confirmation messages with text |
| Control border / paper | 3.84:1 | Visible input boundary |

These are computed token values, not measured results for an implemented website. Do not round a failing ratio into a pass. Check actual states, opacity, photographs, and compositing during implementation. Normal text needs at least 4.5:1; large text has a 3:1 minimum. This project uses the approved normal-text pairs even for large headings to simplify reuse. See [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Use decorative rules for separation, not as the sole boundary of an interactive control. Necessary UI boundaries and indicators require adequate non-text contrast; see [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Paper is the dominant surface. Ink belongs primarily to the footer, primary controls, and video covers. Pink is an accent, not the default background of every section. Use at most one large pink identity band per page. No gradients, text shadows, glass effects, grayscale photo filters, or auto-switching dark theme. Forced-colors mode remains supported.

### 3.2 Typography

| Role | Family / weight | Rules |
| --- | --- | --- |
| Display | Anton, 400 | Hero and section display headlines only; uppercase via CSS |
| Reading and UI | Inter, 400 / 500 / 600 / 700 | Paragraphs, navigation, controls, forms, captions, card titles |
| Editorial accent | Georgia, italic, 400 | Home tagline only; no body paragraphs or interactive text |
| Fallbacks | Display: Impact, sans-serif; UI: system-ui, sans-serif; accent: serif | Keep all text readable while fonts load |

Anton is a single-weight display choice; do not synthesize bold or horizontally stretch it to imitate the image generator. Self-host licensed font files, retain license notices, and use font swapping. Font sources: [Anton repository](https://github.com/google/fonts/tree/main/ofl/anton), [Inter repository](https://github.com/rsms/inter). Font binaries are not added by this documentation task.

At a default 16px root, use the following rem-based scale. Root font size follows the browser preference; do not lock it with a pixel override.

| Token / use | Compact | Wide maximum | Line height / tracking |
| --- | --- | --- | --- |
| Home name | 3.5rem | 8rem | 1.05 / 0; two words on two lines where they fit |
| Page H1 | 3rem | 6.5rem | 1.08 / 0 |
| Section H2 | 2.25rem | 3.5rem | 1.12 / 0 |
| Card H3 | 1.25rem | 1.5rem | 1.3 / 0; Inter 600 |
| Intro text | 1.125rem | 1.25rem | 1.5 / 0 |
| Body | 1rem | 1.125rem | 1.6 / 0 |
| Navigation/button | 1rem | 1rem | 1.4 / 0; Inter 600, sentence case |
| Caption/metadata | 0.875rem | 0.875rem | 1.5 / 0 |
| Eyebrow | 0.875rem | 0.875rem | 1.5 / 0.08em; Inter 600 |
| Home italic tagline | 1.5rem | 2rem | 1.3 / 0 |

Interpolate using `clamp()` with rem minima/maxima and a rem-plus-viewport preferred value. Verify text zoom; viewport units alone are not sufficient. Home name sizing is constrained by its column, not by the entire viewport. At narrow widths reduce to the compact token and allow breaks when needed; never clip or scale-transform the name. Use `min-width: 0` on grid children. Long URLs and emails may break anywhere; normal prose should wrap naturally.

There is one H1 per page. Use actual H2/H3 hierarchy, not paragraph tags styled to look like headings. Keep normal prose to 60–65 characters per line and introductory copy to about 45 characters. Text remains left-aligned; no justified paragraphs or manual first-line indents. Do not animate individual letters. Uppercase display styling must not split the accessible name into individual characters.

### 3.3 Spacing, grid and breakpoints

| Token family | Values |
| --- | --- |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 80, 96px equivalents in rem |
| Page gutter | 16px below 768px; 32px from 768px; 48px from 1024px |
| Content maximum | 1280px, centered; outer page surface can extend full width |
| Section vertical padding | 48px compact, 64px medium, 96px wide |
| Internal section gap | 24px compact, 32px medium/wide |
| Heading to supporting copy | 16px |
| Copy to action group | 24px |
| Label to control | 8px |
| Card image to caption | 12px |
| Parallel controls | 12px gap; wrap instead of shrinking labels |
| Border widths | 1px dividers, 2px control/selected emphasis |
| Corner radii | 0 for image panels, 4px for inputs/buttons; 50% only for play controls |

Breakpoints: compact below 768px; medium 768–1023px; wide 1024px and above. Use CSS for layout. Prefer content-driven stacking when text needs more room, even inside a nominal breakpoint.

Wide pages use a 12-column grid with 32px gaps, medium pages 6 columns with 24px gaps, and compact pages 4 columns with 16px gaps. These are alignment tools, not a requirement to force every component into equal boxes. Reuse one container and one section wrapper. Do not recreate margins independently in each template.

All pages scroll in the document. Remove the existing `100vw`/`100vh` locked shell and nested `#layout-body` scrolling. Use width 100%, content-driven height, and a minimum page height only for short pages. Do not conceal overflow to hide layout bugs. Exceptions for constrained modal scrolling are defined separately.

At 320 CSS pixels and at 400% desktop zoom, content reflows into one column without page-level horizontal scrolling. At 200% text size, labels and paragraphs remain visible and usable. Avoid fixed-height text boxes. See [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

### 3.4 Identity, iconography and photographs

Use the typographic `DF.` identity from the concepts as live text in Anton. Its link name is `Daniel Franzese — Home`. Use an ink wordmark with raspberry dot on paper; paper on ink. Do not generate a replacement illustrated face. Preserve the existing illustrated logo asset in the repository; it is not the primary redesigned header identity.

Icons use one simple stroke vocabulary, approximately 20–24px, with consistent stroke width. Arrows communicate navigation, downward arrows communicate downloads, and a triangle communicates play. Decorative icons are hidden from assistive technology. Icon-only controls require visible tooltips on focus/hover when useful and accessible names regardless of tooltip availability. Text labels remain the default.

Original source photography is mandatory. Permitted transformations: responsive encoding, proportional resizing, and deliberate cropping that preserves the subject. Prohibited: generative retouching, face reconstruction, skin smoothing, expression changes, altered clothing, fabricated backgrounds, new stage scenes, and extracting portraits from generated mockups.

| Original asset | Selected purpose | Framing requirement |
| --- | --- | --- |
| `public/assets/about_me_photo1.webp` | Home hero; supporting About/Press portrait | Preserve pink/blue light; keep the full face and meaningful shoulder context |
| `public/assets/about_photo_2.webp` | About hero; home About tile | Keep the reaching hand and original expression; use containment if a narrow crop damages either |
| `public/assets/modelling_gallery/mg (3).webp` | Gallery lead; home portrait tile | Preserve raised arm and body pose; portrait aspect ratio preferred |
| `public/assets/home_cover.webp` | Secondary hat portrait; home press tile | Keep hat, visible eye and hand relationship; wide crop preferred |
| `public/assets/modelling_gallery/mg (1–24).webp` | Full modeling collection | Inspect each image; retain all originals in the accessible collection |
| `public/assets/press_kit/pressPhotos/` | Press downloads and original promotional artwork | Retain exact source; only label approved/credited when that is verified |
| Existing YouTube thumbnail URLs | Video cards | Associate each thumbnail with its actual video ID |

Each photo record stores a stable ID, original source, dimensions, alt text, intended aspect ratio, and reviewed focal position for compact/wide use. Center is a starting value, not a claim of crop approval. Test each selected image at 320, 390, 768, 1024 and 1440px. Use the full image with `object-fit: contain` in the lightbox.

Useful alt examples: `Daniel Franzese in a blue jacket under pink and blue lighting`; `Daniel Franzese in a white shirt reaching toward the camera`; `Daniel Franzese in a dark sweater with one arm raised behind his head`. Do not infer emotions, use filenames as alt text, or repeat the entire adjacent caption. A decorative duplicate beside equivalent text can have empty alt text. An image control receives an explicit action name in addition to meaningful photo context.

Reserve image dimensions to prevent layout jumps. Load the actual above-the-fold hero promptly; lazy-load lower images. Do not enlarge generated concept PNGs into production assets. Use original video thumbnails where possible and semantic HTML/CSS typographic covers otherwise.

## 4. Shared component contracts

### 4.1 Site shell and header

Every page uses the same `SiteShell`: skip link, header, main landmark, and footer. Place the shell above individual route content so it can persist during client navigation. Use a single shared metadata/content configuration for navigation and contacts.

Header surface is always opaque paper, with one bottom rule. No transparent navigation over photos. Wide header has an 80px minimum height, identity left, navigation right, and primary Book Daniel action last. Compact header has a 64px minimum height, identity left, Book Daniel link and Menu button right. On very narrow widths or enlarged text, allow the row to wrap rather than overflow.

Header is sticky only at wide widths when the viewport is at least 700px tall. Otherwise it remains in normal flow. Do not hide/reveal it based on scrolling direction. It never shrinks, changes theme, or fades as the visitor scrolls. Anchor offsets must use the actual header height plus 16px. Focused elements must remain visible; the design targets full visibility even though the AA minimum is less strict. See [W3C focus-not-obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).

Navigation typography is Inter 600 at 16px, sentence case. Active links have an underline plus `aria-current="page"`; color alone is insufficient. Work has a section-active underline when a child route is active, but the disclosure button does not falsely claim to be a page link. About may also be active on the selected-work anchor because it is the containing page.

The Work disclosure opens on explicit button activation. It uses `aria-expanded` and `aria-controls`, a normal list of links, and standard Tab navigation. Escape closes it and returns focus to the trigger if focus was inside. Outside click closes it; focus leaving the disclosure closes it without stealing focus. No hover-only opening and no ARIA application-menu roles. Follow the [W3C disclosure navigation pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/).

Compact Menu opens an opaque, in-flow panel below the header; it pushes content down, does not cover it, and is not modal. Trigger label changes between `Open navigation` and `Close navigation`. Work children are already expanded within this panel, avoiding nested mobile disclosure. Tab order follows visible order. Escape closes and restores trigger focus; choosing a destination closes the panel and lets route/anchor focus handling take over. At a breakpoint change, do not leave focus inside hidden content. The no-JavaScript fallback exposes navigation links in normal flow.

### 4.2 Footer and universal booking band

Every page has the same footer, including the same closing message. The varied closing slogans in generated images are superseded.

Structure: ink booking band → utility navigation → copyright/credit row. The band heading is `Let’s make a scene.` Supporting copy: `For appearances, speaking and creative collaborations.` Actions: `Book Daniel` to `/booking#booking-details` and `Press kit` to `/press-kit`. On ink, use a paper primary button with ink text and a paper underlined secondary link. This is the same footer on Booking too; the booking link then targets the existing details anchor.

Utility links: About, Videos, Portraits, Press kit, Shop, Cameo, then the verified existing social destinations. Social links have text names, not only icons. Preserve the existing website credit and current-year copyright in a quiet final row. Do not silently remove attribution or replace social accounts based on assumptions about which platform is fashionable.

Wide layout: booking copy left and action group right; utility links wrap beneath a rule. Compact: all sections stack, with 24px group gaps and 48px section padding. Long labels wrap. No absolute-positioned arrow floating above the footer. Optional `Back to top` is a normal labelled link to `#top`, with motion preference respected and keyboard focus moved to the top target.

### 4.3 Links, buttons and interaction states

| Variant | Default | Hover/active | Placement |
| --- | --- | --- | --- |
| Primary | Ink background, paper text | Raspberry background, white text | Header and principal page action |
| Inverse primary | Paper background, ink text | Pink background, ink text | Ink footer/surfaces |
| Secondary | Paper, ink text, 2px ink border | Ink fill, paper text | Secondary actions when a button shape is useful |
| Text link | Raspberry on paper, underlined | Ink, underline remains | Body links and quieter navigation actions |
| Inverse text link | Paper on ink, underlined | Pink on ink, underline remains | Dark surfaces |
| Selected filter | Ink fill, paper text plus selected semantics | Same selected contrast | Video category controls |

Use anchors for navigation/downloads/mail and buttons for changing UI state. Controls have a 48px minimum block size, 16px horizontal padding, and a 44×44px minimum target including icon controls. This is the project's touch-target policy, not a claim that all controls must be 44px to meet AA. Inputs also use 48px minimum height. Do not force a fixed height when labels wrap.

Focus appears immediately: a 3px ink outer outline with a 2px paper separation on light surfaces; invert the layers on dark surfaces. Maintain both layers around pink/photo contexts and test actual backgrounds. Do not use box-shadow as the only focus indicator; supply an outline that survives forced colors. Focus must not be clipped by overflow. Active state may strengthen the border; no required scale or position change.

Disabled controls explain why they are unavailable and retain readable labels. Avoid reducing whole-control opacity. A loading action keeps its size and action label, adds status text, and prevents duplicate activation. Never represent failure as a silent disabled button. All icon/text pairs have one coherent accessible name and no nested interactive elements.

External links open in the same tab by default. Only use a new tab when needed by the workflow, and then say so in the visible or accessible label and use appropriate relationship attributes. Preserve the existing shop and Cameo destinations. Arrows alone do not communicate new-window behavior.

### 4.4 Cards, downloads and forms

Content cards use a photo or typographic cover, a clear heading, and optional metadata. No gradients over faces. Place captions below images. A destination card has one primary link; a gallery preview uses a button. Keep download links separate from lightbox triggers. Border/underline changes communicate interactivity on hover and focus. Do not tilt or zoom cards.

Download rows contain a descriptive file name, actual format, actual size when available, and a labelled download link. Add dimensions and photographer credit only from verified metadata. Keep an accessible HTML biography available even when a PDF exists. Do not promise a ZIP or JPEG if the only deliverable is a WebP file. Source posters remain unmodified; provide adjacent text equivalents for essential wording.

Newsletter appears once on Home and once on Videos, immediately before the footer; it is not embedded inside the universal footer. Heading: `Stay in the loop.` Benefit: `New projects, appearances and updates from Daniel.` Visible field label: `Email address`. Input type email, autocomplete email, required state, explanatory error text, and a Subscribe button. Use the shared form tokens, not third-party default styling.

Retain the existing Mailchimp destination initially. A cross-origin form submission cannot be treated as verified success by a local timeout. Do not clear the email after 500ms or log the input. If the existing provider flow opens a new tab, label the action `Continue to signup` and explain that signup completes there. An inline success state is permitted only after a confirmed response from a supported integration. Keep an ordinary provider submission fallback without JavaScript.

For supported inline submission: preserve entered values on failure; show field errors next to the field with `aria-describedby` and `aria-invalid`; announce a short status politely; keep focus stable unless submission errors require moving to an error summary. Success copy must reflect the provider result, such as confirmation email required, rather than claiming a completed subscription prematurely. Loading, invalid email, network failure, and retry states all have explicit text. Do not auto-dismiss messages.

## 5. Page-by-page design decisions

### 5.1 Home — `/` and `/home`

**Current structure:** full-screen close-up and name → long About block → oversized signup → Cameo → booking contacts. Context and meaningful actions arrive too late.

**New structure, in order:**

1. Shared header.
2. Split hero: text left, original blue-jacket photograph right at wide widths. Approximately 50/50 columns within the shared container. Eyebrow `Actor / Comedian / Activist`; H1 `Daniel Franzese`; optional home-only italic tagline `Big heart. Bigger personality.`; short introduction `From Mean Girls to the comedy stage. Meet the many sides of Daniel.` Primary `Watch Daniel` links to `/video-gallery`; secondary `Booking inquiries` links to `/booking`.
3. Static pink identity band: `Actor. Comedian. Storyteller. Advocate.` Ink text, no marquee. It wraps gracefully into two rows on compact screens.
4. Selected destinations, heading `Meet the many sides of Daniel.` Three cards: white-shirt photo → About Daniel; sweater photo → Portrait gallery; hat photo → Press kit. Captions describe destinations, not invented acting or stage footage. Wide three columns; medium two with the third staying the same card width; compact one.
5. A short `#about` biography preview with a full-biography link. About three sentences, one text column, no duplicate oversized layered portrait.
6. Compact fan-services block at `#cameo`: `A message, just for you.` with `Find Daniel on Cameo`; a quieter shop link. Explain that these lead to external services. Do not style Cameo as professional booking.
7. Shared newsletter section.
8. Shared footer, containing legacy `#contact` target.

**Design cues:** the portrait and name are the primary event. Do not place navigation or essential copy on the photograph. Keep both hero actions visible together. Use the largest type only for the identity, not every section. Hero height is content-driven, never a full-viewport requirement.

**Compact behavior:** identity, description and actions precede the portrait in DOM and visual order. Hero image becomes a modest, uncropped square where possible. Action group stacks when necessary; the primary action is reachable before scrolling through multiple photos. Remove fixed heights and decorative arrows. The full name must be immediately readable without waiting for animation.

**Acceptance:** the first content region identifies Daniel's roles and offers watching/booking; every destination tile works by keyboard; legacy anchors land meaningfully; no invented photos appear; failed hero loading leaves useful text and actions.

### 5.2 About — `/about`

**Current structure:** biography exists only as a home section and a longer press biography.

**New structure:** shared header → editorial intro → static identity band → biography and selected screen credits → advocacy/speaking section → shared footer.

Hero H1: `More than a familiar face.` Small label: `Meet Daniel Franzese`. Use the existing white-shirt portrait as the companion image. Intro summarizes his roles and background in a few short sentences. `Explore his work` goes to `#selected-work` on this page, so the action has a concrete destination without adding a hub.

Biography section heading: `You might know him as Damian.` Include concise sourced career context, with titles such as Mean Girls, Bully, Looking, and Recovery Road drawn from the existing content. Keep an expanded biography in readable HTML on this page; do not hide essential biography behind an animation or require a PDF. Group selected screen work as a simple list with role/production details only when verified. Preserve existing relevant IMDb links.

Advocacy section heading: `A voice beyond the screen.` Blue-jacket portrait alongside concise copy on speaking and community work. Include existing advocacy affiliations only after checking current wording with maintained biography material. A `Speaking & appearances` link goes to `/booking#booking-details`. `Download biography` uses the actual biography PDF.

**Design cues:** alternate a large portrait/text pairing with quieter reading sections. Preserve warm space between paragraphs. Avoid unrelated inspirational quotations. Use the same Inter body font and button family as Home, even though the About concept depicts some differences.

**Compact behavior:** heading and introductory copy → portrait → biography → credits → advocacy image/copy. Keep reading order intentional in the DOM; do not use CSS order to create a different keyboard/screen-reader sequence. Section copy is never overlaid on a portrait.

**Acceptance:** direct entry communicates a complete biography; `#selected-work` receives a visible anchored heading; all credits are factual and linked where useful; the original portrait retains hand, expression and body proportions.

### 5.3 Press Kit — `/press-kit`

**Current structure:** page title → unrelated quotation → large biography → posters → photo gallery. Downloads and contact are not prioritized.

**New structure:**

1. Shared header and H1 `Press kit.` Subtitle `Biographies, photography & booking contacts.`
2. Resource rows in the first content region: Biography PDF; Tour description PDF; Press photography anchor. Companion blue-jacket portrait on wide screens. Resources remain first on compact screens.
3. Short biography in HTML, with a link to `/about` for more detail.
4. Press photography gallery at `#photography`, preview plus individual original-file download controls.
5. Original promotional artwork/posters in a separate `Promotional materials` section; show full artwork without text-cropping.
6. Press inquiry details, sourced from the shared contact record.
7. Shared footer.

Resources already in the repository: `public/assets/press_kit/df-biography.pdf` and `public/assets/press_kit/yass-comedy-tour-description.pdf`. Existing tour copy is historical material until currentness is verified; do not present it as an upcoming tour announcement. The gallery currently contains press assets `pk1` through `pk16` and promotional artwork. Inspect them before selecting the first row; preserve access to the collection.

The concept's white-shirt and sweater previews demonstrate layout, not permission to call those images approved press headshots. Select downloadable press photography from existing approved materials when status is known. Do not fabricate photographer attribution or broad reuse rights. A neutral `Download photo` label is appropriate when no approval claim is established.

**Interactions:** download controls remain ordinary links. Preview enlargement uses the same accessible lightbox as the modeling gallery. Group resources as a semantic list; no complex table needed unless meaningful column comparison is added. Show real format/size. If a file is missing, show `File unavailable` with a press contact action instead of a dead Download button.

**Compact behavior:** one-column resources, then biography, then one-column previews with visible download links. Long file labels and the contact email wrap. Downloads never depend on hovering over an image.

**Acceptance:** biography and tour files are reachable before a long scroll; previews/downloads are distinct keyboard targets; accessible HTML conveys the core biography and poster information; no invalid bundle links or unverified file metadata.

### 5.4 Modeling Gallery — `/modeling-gallery`

**Current structure:** heading and quote → dense uniform image tiles with little separation; image activation is a clickable div and enlarged view lacks a complete dialog contract.

**New structure:** shared header → H1 `In focus.` and label `Daniel Franzese / Portraits & editorial` → gallery introduction/action row → curated opening grid → remaining collection → shared footer.

Opening grid uses existing photos from the revised concept: dark-sweater portrait, white-shirt portrait, blue-jacket portrait, and hat portrait. Pair a taller portrait with a square/wide companion without changing source proportions. Use an explicit CSS grid, not column-based masonry that makes reading order unpredictable. Numbering follows DOM order. Avoid cropping arms, hands or the top of the head for the sake of perfectly equal rows.

Keep all 24 existing modeling photographs accessible below the opening selection. Avoid showing an identical original twice when a curated lead already belongs to the collection. Build one ordered asset list with unique source IDs. Simple pagination is not needed for this volume; render the collection with lazy-loaded images and intrinsic sizes. Do not add category filters until meaningful categories and asset assignments exist.

**Lightbox contract:** a labelled modal dialog, contained full photo, visible Close, Previous and Next buttons, and `Photo X of Y` caption. Initial focus goes to Close; background content is inert; Tab remains inside; Escape closes; closing restores the initiating thumbnail. Use arrows only while focus is inside the dialog and not editing a field. Previous/Next stop at the ends and expose disabled state; no implicit wrap. Updating the photo retains focus on the triggering control and announces the new index/description politely. Use a labelled close button even when backdrop click also closes. Follow the [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Do not use swipe as the only way to navigate. Native browser zoom stays available. The modal can scroll vertically at high zoom and small landscape heights; the close/action region remains reachable without covering the image caption. Loading uses static text `Loading photo…`; error uses `Photo couldn’t load`, Retry, and an original-file link. No indefinite spinner that hides the controls. A direct original-file link is the no-JavaScript fallback.

**Compact behavior:** a single image column by default, using natural aspect ratios. Lightbox controls live in a solid toolbar and remain comfortably sized. Do not place low-contrast translucent controls directly on a face.

**Acceptance:** original collection remains reachable; all previews open from keyboard; focus returns correctly; full uncropped originals can be viewed; no duplicated IDs or rearranged reading order.

### 5.5 Video Gallery — `/video-gallery`

**Current structure:** heading/quote → initially blank player → separately scrolling thumbnail list. The selection areas are click-driven containers and do not provide a full accessible browsing contract.

**New structure:** shared header → H1 `Press play.` with `Comedy, conversations & a little chaos.` → featured video → category filters → video grid → newsletter → shared footer.

Feature `Shit Italian Moms Say #1`, matching the current initial selection. Use its existing YouTube thumbnail with a clearly labelled Play button. If unavailable, render its title as HTML inside an ink/pink cover. Do not manufacture a performance still. The typographic concept is a fallback treatment, not a requirement to replace valid existing thumbnails.

Filters are **All videos**, **Comedy**, and **Interviews & press**. Implement ordinary buttons with `aria-pressed`, not tab roles unless a complete tab pattern is intentionally adopted later. Filters update the grid, retain focus on the chosen button, and announce the result count. They do not change the featured video, scroll the user, or start playback. Store category in the URL query so refresh and Back behave predictably. No horizontal-only strip; buttons wrap.

Wide grid: three columns; medium: two; compact: one. Cards contain original thumbnail/typographic fallback, actual title, and category. Add duration/caption metadata only after verification. Each card has one labelled playback action and a separate explicit external watch link if needed. Selecting a card promotes it to the featured region, moves focus to the updated player heading, and scrolls that heading into view without motion; announce the selected title through that focus change. Playback starts only on a separate explicit Play action. Update the selected video query without filling browser history for incidental state changes; browser Back must still restore meaningful route state.

The featured region stays 16:9. Do not reproduce the existing rem conversion of computed pixel dimensions. Loading an embed must not shift the surrounding page. The player has an informative iframe title, keyboard-operable native provider controls, and an external watch fallback when unavailable. Only one video plays at a time. Stop/unmount it when selection or route changes. Never autoplay on page arrival, filter changes, hover, or scroll.

Preserve the existing library:

| Category | Existing title | Video ID |
| --- | --- | --- |
| Comedy | Shit Italian Moms Say #1 | `eac91tZsZMw` |
| Comedy | Shit Italian Moms Say #2 | `LCPV0sl4GdE` |
| Comedy | Shit Italian Moms Say #3 | `tSF7heNcXSk` |
| Comedy | Stand Up Comedy Act | `DX2o3U8045U` |
| Comedy | Italian MOMster: Danny Scares Mom! | `_PCPwmuiYL0` |
| Comedy | Italian Mom: Embarrassing Family Stories | `m7FnCsSJ5WY` |
| Interviews & press | Daniel Franzese Hosts the Voice Awards | `kgqXMpDuAA4` |
| Interviews & press | Daniel Franzese on Hey Queen | `ZqtkSped3K4` |
| Interviews & press | 15 Things You Didn't Know About Daniel Franzese | `Bv9mhZqhb8Q` |
| Interviews & press | Daniel Franzese Interview on Pop Trigger | `RpZ_70zuzqg` |

These IDs are extracted from the current code, not verified playback results. Validate availability before release. A missing thumbnail does not mean the video is unavailable. A provider failure has an explanatory message and a working direct link where available; invalid query values revert to a valid selection.

**Media accessibility:** inventory caption availability and accuracy for every retained video. Provide corrected captions for prerecorded synchronized audio and useful transcripts. Where meaningful visual information is not conveyed in the audio, provide the required audio description; a transcript alone does not automatically satisfy the AA audio-description requirement. External hosting does not establish conformance. Unresolved media issues must be recorded rather than described as accessible. See [W3C captions guidance](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html) and [W3C audio-description guidance](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html).

**Acceptance:** all 10 existing records are represented; filters and playback have keyboard paths; focus lands predictably after selecting a card; no nested playlist scroll; provider errors and reduced motion do not prevent browsing.

### 5.6 Booking — `/booking`

**Current structure:** three inquiry categories and one contact at the bottom of Home, with email/phone displayed as plain text.

**New structure:** shared header → H1 `Let’s work together.` → short statement of supported inquiries → `#booking-details` contact area → useful inquiry guidance → separate fan-service link → shared footer.

Supported categories are drawn from the existing content: theatrical/public appearances, college/speaking engagements, and press/invites. Show them as a concise list, not three separate contacts when all route to the same person. Reuse the existing contact record: Gary Ousdahl, `Gary@AdvancedManagement.tv`, `(424) 333-1500`. Confirm current representation before public release; do not invent agents or response times.

Primary action: `Email booking contact`, a `mailto:` link with a plain booking subject. Secondary `Call booking contact`, using a normalized `tel:` destination. The email is visible, selectable and wraps on compact screens. An optional Copy email button announces success/failure and leaves focus in place; the visible address remains usable if clipboard access fails.

Inquiry guidance asks the visitor to include event/project type, date, location, and a short description. Do not imply that an inquiry reserves a date. Use a text-first layout with a modest original portrait only if it adds balance; no full-page photo or fake availability calendar. A small `Looking for a personalized video?` block links to Cameo and explicitly describes that different service.

Do not add an unconnected booking form in this phase. A future form requires a real delivery path, validated input, clear success/error states, spam handling, and maintained privacy copy before it becomes the primary contact route.

**Acceptance:** email and phone activate correctly; categories are easy to understand; no form silently discards an inquiry; professional booking remains distinct from Cameo and newsletter signup.

### 5.7 Calendar, 404 and external destinations

`/calendar` uses the shared shell and H1 `Appearances`, with the same accessible event rows as the Home appearances module. A positive ready feed renders upcoming dates, venue-local times, normalized public descriptions, statuses, and only explicit valid ticket/waitlist actions. An unconfigured or authoritative empty feed returns a real 404 for a fresh direct request; an unavailable source returns a useful 503/noindex state. A page already open can transition to an empty or delayed state after refresh. Conditional navigation and sitemap inclusion follow the positive ready feed, and the existing unused calendar embed remains inactive. See [GOOGLE_CALENDAR.md](GOOGLE_CALENDAR.md) for source setup and entry metadata.

The schedule is a readable date/venue/location list with explicit time zones and ticket links; a visual calendar is not required. Past events are omitted, while sold-out, postponed, cancelled, and coming-soon states remain textually explicit. Browser refresh is visibility/focus aware, coalesced, abortable, and bounded; a stale snapshot is visibly marked and never exposes purchase actions.

404 uses the shared shell, `Page not found` H1, a brief explanation, and links Home, Videos, and Booking. Keep the real 404 response status. Do not use a timed redirect or animated joke that prevents recovery. Page-level loading/error surfaces retain navigation and a readable status.

Shop and Cameo retain existing destinations. No invented merchandise photography or screenshots. Their external interfaces are outside this redesign's implementation scope.

## 6. Accessible motion and page transitions

Motion is optional polish. Content, state, navigation, and feedback must work when every decorative animation is absent. Prefer one restrained transition per interaction. No marquee, parallax, cursor follower, scroll hijacking, rotating text, letter-by-letter reveals, autoplay background video, animated texture, or flashing treatment.

### 6.1 Motion tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `--motion-fast` | 120ms | Button color/underline feedback |
| `--motion-standard` | 160ms | Disclosure/dialog opacity |
| `--motion-page` | 180ms | New route content opacity, if enabled |
| `--motion-ease` | `cubic-bezier(0.2, 0, 0, 1)` | Non-bouncy ease out |
| Reduced motion duration | 0ms | All nonessential effects removed |

Do not use `transition: all`. Animate only the named decorative property. Focus rings, selected state semantics, live messages, and availability of controls update immediately, regardless of duration tokens. Do not delay a click, route completion, modal dismissal, or form confirmation to finish a visual sequence.

### 6.2 Interaction motion matrix

| Interaction | Default enhancement | Reduced-motion behavior | Invariant |
| --- | --- | --- | --- |
| Page navigation | Optional 180ms opacity introduction on new main content, no spatial movement or outgoing delay | Immediate replacement | Focus and title update immediately; header/footer remain stable |
| Work disclosure | 160ms opacity after instant layout/state update | Instant open/close | No focus waiting for an animation |
| Compact navigation | Instant layout expansion; optional 120ms panel opacity | Instant | No height tween pushing the page for several frames |
| Button/link hover | 120ms color change or underline emphasis | Instant visual state | Keyboard focus receives equivalent emphasis |
| Gallery open | 160ms opacity only; no thumbnail-to-screen zoom | Instant | Modal controls/focus usable immediately |
| Gallery next/previous | Immediate image swap with reserved dimensions | Same | No slide animation and no delayed caption |
| Category filtering | Immediate grid update | Same | Focus remains on filter; count announced |
| In-page explicit anchor | Browser-normal jump by default; optional short smooth scroll only when motion allowed | Instant jump | Target receives keyboard focus and is not obscured |
| Loading | Static label; no decorative motion required | Same static label | Error/timeout recovery remains available |

Do not ship scroll-triggered reveal effects in the baseline. They add little value here and risk hiding information or delaying access. If added later, require a documented exception, visible-by-default content, no transforms for reduced-motion users, and no staggered reading order.

Honor `prefers-reduced-motion: reduce` on first load and when the preference changes while the page is open. In CSS, effects are opt-in under `prefers-reduced-motion: no-preference`. JavaScript that requests smooth scrolling or manages animated route effects checks the same preference and responds to changes. See [MDN reduced-motion reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

Illustrative policy, not production code:

```css
.interactive-control { transition: none; }
.route-content { opacity: 1; }

@media (prefers-reduced-motion: no-preference) {
  .interactive-control {
    transition: color 120ms cubic-bezier(0.2, 0, 0, 1),
                background-color 120ms cubic-bezier(0.2, 0, 0, 1);
  }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

### 6.3 Route, history and focus contract

Use one route-transition owner. Do not add a router migration or animation library merely to implement this fade. Keep the Next.js Pages Router for this phase unless an independent technical need justifies migration.

On a new forward page navigation: close disclosures, update document title, render content, move focus to the new H1 using a programmatic focus target, and position the page at its top. With a valid fragment, focus/scroll the fragment heading instead. Do not move focus after decorative animation completes. Avoid duplicate announcements from a custom route live region and the framework announcer; test the chosen single strategy with a screen reader.

Back/Forward restores meaningful scroll and query selection rather than forcing the visitor to the top. If the browser/router can restore the prior focused control safely, keep it; otherwise focus a stable main-region target with `preventScroll` so restored scroll is not discarded. Same-page category changes do not invoke route-entry focus. Selecting a video follows its explicit player-focus behavior. Opening an external link does not animate the local page away.

A failed navigation leaves existing content usable and communicates a retry path. Never fade the current page to invisible while waiting on a response. No-JavaScript navigation remains ordinary links with browser-native page loads. Cancel obsolete transitions on rapid repeated navigation; no stale page overlays or invisible interactive content.

## 7. Accessibility baseline and acceptance policy

Target WCAG 2.2 AA across the redesigned experience, with project-specific enhancements such as 44px targets and complete removal of nonessential motion. This is a target, not a certification or an audit result. Automated checks are supplementary; keyboard, screen-reader, zoom, and media review are required. The [W3C quick reference](https://www.w3.org/WAI/WCAG22/quickref/) is the release checklist authority.

Product-wide requirements: a visible-on-focus skip link; accurate landmarks; coherent headings; meaningful image alternatives; descriptive link/control names; no keyboard-only dead ends; no information available only through color, hover, drag, or animation; and clear persistent feedback for errors and confirmations. Use native elements first. Labels are persistent, not placeholder-only. Do not disable pinch zoom. Respect forced colors and user text settings.

Manual verification matrix:

| Scenario | Required observation |
| --- | --- |
| Keyboard from page load | Skip link first; sensible order; visible focus; all content/actions reachable |
| Wide Work disclosure | Open, traverse, dismiss and continue without focus loss |
| Compact navigation | Opaque readable panel; every link available; Escape and route changes close correctly |
| Gallery dialog | Open, navigate both directions, dismiss, return to initiating photo; repeat at zoom |
| Video controls | Filter, select, reach Play, use provider controls, recover from unavailable video |
| Forms/contact | Labels announced; errors explained; address copy fallback works; no false signup success |
| Reduced motion enabled before load | No decorative effects, smooth scroll, looping indicators or hidden content |
| Reduced motion changed during session | Subsequent effects cease without reload; ongoing effect safely resolves |
| 320px width / 400% zoom | One-column usable flow; no clipped name, controls or email; header does not cover content |
| 200% text / custom spacing | Text boxes grow; no overlap or missing labels |
| Forced colors | Controls, links, focus and selected state remain distinguishable |
| Image/font/embed failure | Text, navigation and fallback actions remain useful |
| Browser Back/Forward | Prior route/query/scroll restored meaningfully |
| JavaScript unavailable | Navigation, content, download and contact links remain available |

Test at 320, 390, 768, 1024 and 1440px widths; include a short landscape viewport. Screen-reader coverage should include NVDA with a Windows browser and VoiceOver with Safari when that environment is available. Record unavailable environments honestly and resolve them before claiming coverage. Test captions and descriptions per video; do not infer them from the presence of a CC icon.

## 8. Implementation map and sequence

### 8.1 Shared code responsibilities

The table below records the original redesign refactor. The October 31 modernization supersedes its router entry points: routes now live in `app/`, `app/layout.tsx` owns the persistent server shell, interactive behavior is isolated in client components, and metadata uses the App Router Metadata API. The visual, content, accessibility and motion decisions remain applicable.

| Current location | Planned change |
| --- | --- |
| `styles/globals.css` | Introduce tokens and base type; remove locked scrolling, global text shadows and indiscriminate smooth scrolling |
| `tailwind.config.js` | Map shared design tokens; retire decorative fast-flip behavior |
| `pages/_app.tsx` | Own persistent shell/route behavior; avoid duplicate shells per page |
| `components/layouts/CommonLayout.tsx` | Refactor to document-flow shell with skip link, header, main and footer |
| `components/organisms/Header/` and `components/molecule/Navigation/` | One responsive navigation system and Work disclosure |
| `components/organisms/Footer/` | One footer and booking band with consistent text/actions |
| `components/atoms/Button/` and `SubtleLink/` | Semantic link/button variants with shared focus and state styling |
| `components/organisms/ContentSectionWrapper/` | Shared container/section spacing, no arbitrary full-height blocks |
| `components/templates/home/` | New home hierarchy and legacy anchors |
| New About/Booking templates and pages | Dedicated complete biography and contact destinations |
| `components/templates/press-kit/` and `PressGallery/` | Resources first, metadata-aware downloads, shared preview dialog |
| `ModelGallery/`, `ModelPicture`, `SelectedModelGalleryImage` | Ordered original-asset collection and accessible lightbox |
| `components/atoms/VideoPlayer/` | Split featured player, filter controls, cards, and URL state |
| `MailChimpInput` and `BookMeNowContacts` | Shared forms/contact records, valid feedback and direct links |
| `lib/constants.ts` | Single navigation/route/external destination source; shared contact/video/photo records |
| Page Head blocks | Accurate titles, descriptions, canonical URLs, original-image social metadata |

Preserve the current React/Next setup for this work. Use CSS and small focused state handlers; an animation dependency is not required. Keep semantic behavior reusable rather than copying bespoke handlers into each page. New production files should use readable domain names; component names in this table describe responsibilities and do not force unnecessary folder churn.

### 8.2 Delivery order

1. Foundation: tokens, font files/licenses, document scrolling, container, typography, links/buttons, shared shell.
2. Navigation/footer: keyboard behavior, mobile expansion, route focus, active states, reduced-motion policy.
3. Home/About/Booking: hierarchy, original images, contact links, legacy anchors.
4. Press/gallery: resource metadata, real downloads, ordered photo data, accessible dialog.
5. Videos/newsletter: query state, player fallback, caption inventory, supported signup feedback.
6. Recovery and polish: 404/calendar empty states, metadata, restrained motion, responsive crop verification.
7. Release verification: accessibility and navigation checks, route/asset audit, relevant lint/type/build checks.

Functional and accessibility behavior lands before optional page fades. Do not defer missing labels, focus handling, or reduced-motion support to a later polish pass.

### 8.3 Verification and completion gates

For documentation: check local asset links, route inventory, exact source names, contrast calculations, consistent terminology, and tracked branch contents. A documentation-only change does not require application tests.

For implementation: run relevant lint, type and build checks; exercise critical user journeys; capture wide/compact screenshots of every page plus open navigation, lightbox, loading and error states. Compare against this specification rather than exact generated pixels. Run automated accessibility scans, then the manual matrix. Add behavior tests for focus return, route/filter state and actual submission outcomes where useful; do not write tests that merely mirror CSS token constants.

Avoid layout shifts by reserving media sizes and stabilizing font fallback. Load only the current video embed; do not instantiate ten iframes on arrival. Keep offscreen photographs lazy-loaded. Performance measurements must identify device/network conditions; do not invent scores or claim improvements without measurement.

Do not declare the redesign complete while required captions/descriptions, keyboard defects, failed downloads, broken legacy links, or unsupported success claims remain unresolved. Content verification can proceed alongside layout work, but unverified facts must not be silently embellished.

## 9. Consolidated decision log

| ID | Decision | Reason / constraint |
| --- | --- | --- |
| D01 | Existing photos only; generated mockups never supply production portraits | Preserve Daniel's actual appearance |
| D02 | Paper/ink/pink editorial identity | Strong recognizable system rooted in existing portrait lighting |
| D03 | Anton display, Inter UI/body, Georgia home accent | Distinct hierarchy with readable controls |
| D04 | Dark text on bright pink; raspberry for small accent text | Correct concept contrast failures |
| D05 | One opaque responsive header and one footer | Prevent page-to-page drift and photo contrast issues |
| D06 | Work disclosure; dedicated About and Booking routes | Simplify navigation without inventing an unnecessary Work hub |
| D07 | Preserve existing gallery/press/video URLs and home fragments | Maintain useful inbound links |
| D08 | Document scrolling, CSS grid, shared spacing | Remove nested scroll friction and support zoom/reflow |
| D09 | Press downloads precede long biography | Serve press/programmer tasks immediately |
| D10 | Curated gallery opening with access to all originals | Balance visual selection with collection completeness |
| D11 | Shared labelled photo dialog with focus return | Make enlargement usable across input methods |
| D12 | Featured video plus filters/grid; real thumbnails first | Improve discovery without fabricated content |
| D13 | Booking uses real mail/phone links, no disconnected form | Provide a dependable inquiry path |
| D14 | Newsletter confirms only a real provider outcome | Prevent misleading success and lost input |
| D15 | Optional opacity polish only; reduced motion disables it | Add refinement without making motion a dependency |
| D16 | No parallax, marquee, letter reveals, autoplay or card zoom | Avoid distraction, hidden text and unnecessary motion |
| D17 | Shared footer copy overrides concept-specific slogans | Maintain a stable closing identity and action |
| D18 | Calendar remains a neutral empty state until maintained data exists | Avoid invented event schedules |
| D19 | WCAG 2.2 AA target plus manual release checks | Accessibility must be demonstrated, not inferred from appearance |
| D20 | 2026-10-25: the calendar scope is activated as a private read-only appearances feed with conditional Home/shell/sitemap behavior, 60-second request-driven refresh, real 404/503 states, and no Event JSON-LD | Verified source data is now available, while uncertain rich-event claims remain intentionally deferred |

## 10. Outstanding verification, not undecided visual direction

The visual system and page structures above are decided for this implementation baseline. The following are factual or technical checks before public release:

- Verify the latest biography wording, representation contact, social destinations, and external service links.
- Confirm which existing press images are intended for downloads and preserve known usage/credit metadata.
- Inspect both existing PDFs for currentness and accessible reading order; keep equivalent HTML information.
- Verify each video's availability, captions, and audio-description needs; record remediation per asset.
- Confirm Mailchimp behavior and choose either the honest provider handoff or a verified inline integration.
- Acquire the selected fonts from official sources with licenses, then check fallback metrics and name fit.
- Review original-image crops at all specified widths; no generated-photo substitutions.
- Record completed testing environments and any remaining release blockers.

Do not stop ordinary implementation to ask for new visual preferences already resolved here. Update this document when a concrete content constraint requires a change, and explain any material scope change to the project owner.

### Wave 5 delivery and Press-resource decisions

These implementation decisions preserve the established visual system and
original-photo rule. Combined-candidate verification is tracked separately in
the Wave 5 reports; recording a decision here is not a release certification.

- Typography keeps Anton for display and Inter for interface/body text. Serve
  deterministic WOFF2 subsets from `public/fonts/optimized/`, retaining the
  original font files and licenses byte-for-byte. Keep Inter's variable axes,
  the required punctuation and the audited rendered character coverage. The
  two delivered files total 89,432 bytes. Preserve the established fallback
  stack and display behavior; do not add a font service or duplicate preload.
  New languages or newly introduced characters require another coverage audit
  and regenerated subsets before relying on those glyphs.
- Press photo cards and promotional artwork use deterministic WebP previews
  derived from the existing originals, with one typed preview per stable
  download ID. Each preview is at most 120 KiB, preserves the source aspect
  ratio and has recorded source/derived hashes, dimensions and encoding
  parameters. This delivery uses one source per ID; it does not claim multiple
  responsive `srcset` variants. Enlargement and download retain the originals.
  No generative image transformation is permitted.
- Runtime image optimization stays disabled. The fixed, local WebP-only
  generation tool is an offline delivery step, not an upload or arbitrary-URL
  image service. Keep the restricted YouTube thumbnail source policy. Security
  headers include a report-only Content Security Policy; do not present it as
  enforced protection or enable native HEIF/AVIF processing without a fresh
  advisory review and a patched native bundle.
- Press starts with its resource rows. Each original PDF retains Preview and
  Download actions and gains a native `Read text version` fragment link to its
  corresponding HTML article. Place `Read the source text.` as an H2 after
  the resource rows and note, before the concise site biography and photography.
  The article targets are `#biography-text-version` and `#tour-text-version`,
  with H3 titles and source subheads at H4. Keep exactly one page H1.
- The HTML alternatives remain ordinary, visible sections in document flow.
  They require neither JavaScript nor an animated disclosure. Focusable
  fragment targets use `tabindex="-1"`, the shell's header offset and a visible
  target outline; native anchor navigation remains useful without JavaScript.
  Use the shared typography, colors, spacing and readable text measure.
- Label both PDF alternatives as historical source text. Preserve DATA's
  extracted wording and reading order, including meaningful banner words as
  adjacent HTML text. Do not imply that old credits, contacts or promotional
  claims have been independently updated. Preserve the original PDFs despite
  their documented accessibility defects. Historical contact/social strings
  remain plain text; current actions elsewhere use canonical content records.
  Do not activate the malformed legacy handle URL from the biography PDF.
- Stack the Press resource rows/actions at compact and intermediate widths.
  Let long historical contact strings and source-photo labels wrap within
  their containers using `min-width: 0` and `overflow-wrap: anywhere` where
  needed. The gallery containment is scoped through the Press template;
  do not conceal overflow or truncate required information. Verify short
  landscape, 320px reflow, forced colors and increased text sizes.
- Keep lazy loading for below-the-fold photographs. Settled-image verification
  must bring each card into view and explicitly await loading and decoding
  within a bounded deadline. A rapid jump that skips lazy-load thresholds is
  not evidence that a source is missing; report the exact failing source and
  distinguish application failures from traversal limitations.

### Change history

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-09-06 | Established shared system, original-photo rule, complete route/page structures, accessible motion and interaction contracts, and release gates |
| 1.1 | 2026-09-11 | Recorded Wave 5 font subsets, original-preserving Press previews, offline image/security boundaries, full historical HTML PDF alternatives, and scoped Press reflow decisions; final combined verification remains in phase reports |

### Live appearances implementation addendum

The verified calendar integration keeps the editorial system’s paper, ink,
pink, Anton, and Inter language while adding a conditional appearances module
after a positive-state compact hero. Only the zero-event homepage retains the
original hero/identity-band sequence unchanged; a positive homepage follows
the approved calendar mock with the split portrait hero, explicit live-date
action, 10px pink divider, and dark update band. The module is rendered only
when the public feed is ready with upcoming events; it shows a maximum of four
rows on Home and links to the full `/calendar` schedule.

The dedicated schedule uses the same mock-aligned row component and venue-local
date/time formatting: an ink month/day rail, Inter title hierarchy, separate
location/time details, status dot/text, and fixed desktop action column that
stacks below the detail column on mobile. Ticket actions are derived only from
explicit normalized URLs:
cancelled and postponed events have no purchase action, sold-out events may
show an explicit waitlist, and unknown or coming-soon states remain neutral.
When a refresh is delayed, the last good schedule is bounded and visibly
marked while all purchase actions are suppressed.

Appearances links in the shared navigation and footer follow the same positive
feed condition. The calendar page is a real 404 for unconfigured or
authoritatively empty direct requests. It becomes indexable and sitemap-listed
only for a positive ready feed on a valid production origin. The October 31
App Router migration uses a visible, JavaScript-independent 503/noindex
recovery response for known source outages; the feed API also returns
503/no-store. Unexpected rendering failures retain route error boundaries.
Individual event pages now have stable opaque URLs and optional Event JSON-LD
when complete venue facts are supplied; see the calendar integration guide.
