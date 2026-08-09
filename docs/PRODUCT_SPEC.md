# AFTER US Product Spec

## One-Sentence Pitch

Photograph one ordinary object that matters to you. AFTER US transforms it into a museum exhibit from 2526 and adds it to a public museum of everyday human life.

## Product Thesis

Most people never get preserved by institutions. Their ordinary objects disappear with them.

AFTER US reframes one meaningful object from an ordinary person as future history.

The product is not an AI image generator. It is a public museum built from personal artifacts.

## User Story

As a contributor, I want to preserve one ordinary object and the meaning it carries, so that it can become part of a shared public record of human life.

As a visitor, I want to browse a growing collection of preserved ordinary objects and understand what people chose to save about themselves.

## Primary User

College students and community-event participants contributing one meaningful possession.

## Core Interaction

1. User uploads or captures a photo of an object.
2. User writes one sentence about why it matters.
3. The system generates a future-museum exhibit.
4. The exhibit is published into the shared museum.
5. The museum data view updates immediately.

## Must-Have Product Surfaces

### 1. Museum Home

Purpose:

- establish the premise
- show featured exhibits
- direct users to contribute

Must communicate:

- this is one public museum
- every contribution becomes part of a living archive

### 2. Contribution Flow

Fields:

- object photo
- short title or object name
- one-sentence meaning
- optional location

Requirements:

- friction must stay low
- upload flow should feel ceremonial, not bureaucratic

### 3. Generated Exhibit

Required output:

- future title
- year
- exhibit card
- curatorial interpretation
- emotional theme
- category / material if useful

The generated result must feel museum-grade and visually distinct from the raw upload.

### 4. Public Gallery

Requirements:

- all contributions belong to one coherent institution
- supports browsing by recency and theme
- should feel cumulative, not like unrelated cards on a feed

### 5. Census of Us

Purpose:

- satisfy the real-data requirement
- satisfy the TECHNATION track in a user-facing way

Required content:

- total objects preserved
- top themes
- top categories
- recent contributions
- patterns about what people choose to preserve

This must feel like a museum hall, not an internal BI dashboard.

### 6. Exhibit Detail

Should show:

- raw uploaded object
- transformed exhibit framing
- user meaning
- future interpretation
- related exhibits if available

## Data Model

Suggested `Exhibit` shape:

```ts
type Exhibit = {
  id: string;
  objectName: string;
  originalImageUrl: string;
  userMeaning: string;
  futureTitle: string;
  futureInterpretation: string;
  theme: string;
  category: string;
  material?: string;
  location?: string;
  createdAt: string;
  views: number;
  reactions: number;
};
```

Suggested aggregate data:

```ts
type CensusSnapshot = {
  totalExhibits: number;
  themeCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  recentExhibitIds: string[];
};
```

## Design Direction

The product should feel:

- museum-like
- editorial
- intentional
- emotionally serious
- visually art-directed

Avoid:

- neon startup UI
- productivity-dashboard chrome
- generic AI image gallery layouts
- purple gradient defaults
- playful toy aesthetics

The visual identity should support the Reve track even if Reve is not yet wired in.

## Demo Script

Use this object for the primary demo:

- house key

Use this meaning statement:

- `This opened my first home.`

Target output:

- a future catalog title
- a curatorial paragraph about independence / belonging / access
- immediate publication into the museum
- immediate update to the `Census of Us`

## Anti-Obvious Guardrails

Do not turn this into:

- a raw photo-to-art generator
- a social feed with captions
- an analytics dashboard with museum branding
- a generic archive or scrapbook
- a one-off generation flow with no persistent public world

## Build Priority

### Priority 1

- strong first-screen premise
- contribution flow
- transformed exhibit result
- public gallery

### Priority 2

- Census of Us
- exhibit detail
- theme navigation

### Priority 3

- related exhibits
- richer archival layout
- external cultural-reference integrations

## Nice-to-Have, Not MVP-Critical

- Smithsonian / Getty / Europeana enrichment
- location maps
- advanced moderation
- accounts
- social sharing
- full AI backend polish

## Acceptance Criteria

The project is ready when:

- the premise is understandable in under 10 seconds
- the transformation is legible in under 5 seconds
- the museum feels like one coherent institution
- the public artifact is clearly shared and growing
- the data layer is visible and meaningful

