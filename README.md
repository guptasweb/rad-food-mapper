# SF Food Mapper

Backend + Frontend solution to search San Francisco Mobile Food Facilities using the official Open Data dataset.

## What it does

- Backend (Node + TypeScript + Express)
  - Search by applicant name with optional `status` (defaults to all unless provided)
  - Search by street fragment (address-only matching)
  - Find nearest trucks given `lat`/`lng` (default `APPROVED` only, overrideable); optional `coarse=true` to match integer degree bands for broader results
  - Swagger UI at `/docs`
  - Jest unit tests (services + controllers)

- Frontend (React + TypeScript + Vite)
  - MUI AppBar + sidebar shell
  - Three search modes with form validation
  - Switching search modes clears the search text and results without sending a request
  - Grid “table” with sticky header, resizable columns, count, empty state, loader overlay, and responsive mobile rows
  - Cypress E2E tests + Vitest unit tests for components
  - Accessibility: labeled inputs, keyboard navigable forms and table, consistent focus styles, aria-live loading status, and high-contrast theme variants

## Accessibility (WCAG) notes

- Perceivable
  - Color contrast targets WCAG 2.1 AA using a calmer purple palette; text on primary surfaces keeps sufficient contrast
  - Text alternatives: form inputs have visible labels via MUI `TextField`/`InputLabel`
- Operable
  - Full keyboard support: all controls are focusable; form submission via Enter; sidebar navigation via Tab/Shift+Tab
  - Focus styles: default MUI focus ring retained; no focus trapping
- Understandable
  - Clear error messages surfaced near the results area (Alert) and consistent field labeling
- Robust
  - Results grid uses ARIA roles (`role="row"`, `role="cell"`, column headers) for assistive technologies even though it is a CSS grid
  - Loading overlay announces status with `role="status"` and `aria-live` to screen readers

  
## Getting Started

### Prerequisites
- Node.js 18+

### Install
```bash
npm install
npm --prefix client install
```

Optionally set an app token to increase Socrata API limits:
```bash
setx SFGOV_APP_TOKEN YOUR_TOKEN_HERE  # Windows PowerShell
# restart terminal after setting
```

### Run (dev)
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- API docs: `http://localhost:5173/docs` (proxied)

### Build and run
```bash
npm run build
npm start
```

### Tests
```bash
npm test                               # Backend unit tests (Jest)
npm --prefix client run test:unit       # Frontend unit tests (Vitest)
npm --prefix client run test:e2e        # Cypress headless (requires: npm run dev)
npm --prefix client run test:e2e:open   # Cypress UI runner
```

## API
- `GET /api/v1/applicants?name=<text>&status=<APPROVED|REQUESTED|EXPIRED|SUSPEND|ALL>`
- `GET /api/v1/streets?query=<text>`
- `GET /api/v1/nearest?lat=<number>&lng=<number>&limit=<n>&status=<...>&coarse=<true|false>`

## How it works (design)

- Direct integration with Socrata SODA API (no local DB) keeps data current and simplifies ops.
- Text matching via `upper(field) like upper('%…%')` with quote escaping.
- Nearest uses Socrata geospatial `distance_in_meters()` ordering (precise) or integer-degree bands when `coarse=true`.
- Swagger UI serves `openapi.json` at `/docs` to document the API.

## Security
- Simple public read-only API proxy; CORS enabled for UI.
- No secrets required; optional `SFGOV_APP_TOKEN` to reduce throttling.


## Technical trade-offs

- No database: faster to build and keeps data fresh, but relies on upstream latency/availability and can hit rate limits.
- Direct LIKE filters: simple and explainable, but less performant and fuzzy than full-text search.
- Socrata geo vs Google Maps: I chose Socrata geospatial math (`within_box`/SoQL) over Google Maps Distance Matrix because it’s free (no key/billing), lower latency (single upstream), simpler to test (fewer external calls), and sufficient when “nearest” means geometric proximity. Google would be preferable if ranking by travel time/traffic is required, at the cost of added complexity, quotas, and latency.
- Cypress tests stub only where needed: keeps E2E close to real, but can be flaky due to upstream; unit tests isolate logic.
- Frontend stack (React + TypeScript): broad ecosystem, reusable components, type safety, and fast local DX via Vite. Alternatives like Vue/Svelte are great, but React’s library support (MUI, Testing Library, Cypress docs) and team familiarity reduce risk and delivery time.
- Backend stack (Express + Node): minimal runtime footprint, easy HTTP wiring, and native TypeScript support. Rails offers strong conventions, scaffolding, and batteries-included features (ActiveRecord), but for a small API proxy against a hosted dataset, Express is lighter, needs fewer moving parts, and aligns with the TS frontend.

## Critique / Future work
  - Robust rate limiting/throttling and observability (metrics, tracing)
  - Comprehensive E2E stubbing of all API paths and visual regression tests
  - Geolocation via Google Maps (Places Autocomplete/Geocoding) to power latitude/longitude lookup
  - Pagination (API and UI) for large result sets and better perceived performance
  - Typeahead/autocomplete inputs with debounced queries and dynamic results display while typing


- What would you have done differently with more time?
  - Add React Query for client-side caching/retries and simplify form fetch logic
  - Introduce schema validation (zod/Joi) at controllers and strict response typing
  - Implement paging and sortable columns with a virtualized grid
  - Add map visualization and clustering; deep links and sharable URLs

## What are the problems with this implementation and how would you scale it?

- Upstream dependency (Socrata): subject to rate limits/latency/outages.
  - Add response caching (Redis/Cloudflare), request deduping, retries with backoff, and circuit breakers.
  - Build a background sync that mirrors the dataset into Postgres + PostGIS or Elasticsearch; serve queries from our DB.
- Query performance (LIKE and integer-degree bands): can be slow and not precise.
  - Use full-text indexes (pg_trgm) for text, and geospatial indexes (GiST) for true nearest-neighbor with KNN (`ORDER BY geom <-> point`).
- No pagination/limits in UI/API beyond a hard cap.
  - Add `page`/`pageSize`, return totals, and use keyset pagination for stable performance.
- Frontend data fetching is simple.
  - Adopt React Query (or SWR) for client caching/retries; prefetch popular queries.
