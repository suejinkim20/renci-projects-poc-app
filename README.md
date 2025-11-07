# RENCI Projects Dashboard

A client-side React dashboard for exploring RENCI projects, including research groups, operations groups, funding organizations, partner organizations, and cross-team staffing.

This app consumes locally-stored JSON exports (mirroring WordPress REST API schemas), normalizes them into an in-memory data graph, runs query functions, and produces enriched UI-ready summaries and tables — all without a backend.

## Core Concepts

### Data Graph Normalization

Raw JSON is transformed via `buildDataGraph`:

* Resolves bidirectional relationships  
* Creates maps keyed by `id` & `slug`  
* Deduplicates cross-references  
* Enables O(1) lookups  
* Produces clean view models

Think: an in-memory mini-database.

### Pure Query Layer

All business logic (filtering, aggregation, stats) is implemented via named query functions:

`data-build/queries/dashboard.js`

This keeps UI components small and testable.

### UI Hook

`useDashboardData` manages:

* Local state (selected research group)  
* Memoized queries  
* Dropdown options  
* Row generation

## Project Architecture

```
src/
   api/                  // Adapter entrypoint (currently empty — adapters planned)
   components/           // Presentational UI  
   data/                 // Raw JSON (WordPress exports)  
   data-build/           // Normalizers + query layer  
   hooks/                // Custom application hooks  
   assets/               // Icons, static assets  
   App.jsx               // Layout shell  
   main.jsx              // React entrypoint
```
This separation allows the app to evolve into:

* Local development mode  
* Remote REST mode  
* GraphQL mode

…without rewriting UI.

## Directory Breakdown

### `/src/data/`

Stores source data only — no logic. Entry point: `src/data/index.js` imports the raw JSON files and calls `buildDataGraph`.

### `/src/data-build/`

Transforms raw JSON into a `graph` object:

* Normalizers  
* Relationship resolvers  
* Memoized query functions

Consumers never receive raw JSON again.

### `/src/hooks/`

`useDashboardData.js` exports clean consumption APIs (for example: `researchGroups`, `selectedResearchGroupId`, `setSelectedResearchGroupId`, `rows`).

### `/src/components/`

All presentational; components should consume the hook/query outputs rather than raw data.

* `elements/ProjectTable.jsx`  
* `elements/SummaryPanel.jsx`  
* `views/DashboardView.jsx`

### `/src/api/`

Planned adapters and adapters entrypoint:

* `src/api/index.js` — the adapter entrypoint (currently empty).
* Future folders: `local/` and `remote/` for browser-persistent and remote REST adapters respectively (not implemented yet).

## How Data Flows

`JSON → buildDataGraph() → Query Layer → useDashboardData → DashboardView → ProjectTable/SummaryPanel`

UI never deals with raw data shape.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run dev server

```bash
npm run dev
```

Vite defaults to http://localhost:5173 unless configured otherwise.

### 3. Build & preview

```bash
npm run build
npm run preview
```

### 4. Linting

```bash
npm run lint
npm run lint:fix
```

## Key Files

* `src/data/index.js`  
   Entry point that imports raw JSON and calls `buildDataGraph`.
* `src/data-build/buildDataGraph.js`  
   Normalizes all entities and relationships.
* `src/data-build/queries/dashboard.js`  
   Contains all dashboard-specific aggregations.
* `src/hooks/useDashboardData.js`  
   Provides UI state + query integration (exports: `researchGroups`, `selectedResearchGroupId`, `setSelectedResearchGroupId`, `rows`).
* `src/components/views/DashboardView.jsx`  
   Renders dropdown, summary, and tables.