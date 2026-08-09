# Claude Kickoff Prompt

Use this prompt to start Claude on the actual build:

```text
Read these files first and use them as the source of truth:

1. /Users/efi/Documents/ChatGPT/SummerHacks/CLAUDE.md
2. /Users/efi/Documents/ChatGPT/SummerHacks/after-us/README.md
3. /Users/efi/Documents/ChatGPT/SummerHacks/after-us/docs/PRODUCT_SPEC.md

Build the actual SummerHacks app in:
/Users/efi/Documents/ChatGPT/SummerHacks/after-us

Important constraints:
- Do not build inside /Users/efi/Documents/ChatGPT/SummerHacks/hackathon-strategy-engine
- The chosen idea is AFTER US — The Museum of Now
- This is a public museum product, not an AI gallery, not a chatbot, and not a dashboard-only app
- The app must show a shared, growing public artifact
- The app must include a public Census of Us data view

Implementation direction:
- Create a polished React + Vite + TypeScript web app unless the codebase strongly suggests otherwise
- Start from a clean scaffold if no app exists yet
- Build the real UI, not just documents
- Make the visual identity feel like a future museum / archive
- Use seeded local data first if needed so the app is fully demoable
- Prioritize the core demo path:
  1. upload object photo
  2. write one sentence about why it matters
  3. generate museum exhibit
  4. publish into shared gallery
  5. update Census of Us

Use this demo example while building:
- object: house key
- meaning: "This opened my first home."

Success bar:
- the premise is immediately understandable
- the transformation is obvious
- the collection feels cumulative
- the product feels art-directed and judge-memorable
- the data view feels like a museum hall, not an internal analytics dashboard

After implementation:
- run the dev server
- verify desktop and mobile
- leave the app in a runnable state
```
