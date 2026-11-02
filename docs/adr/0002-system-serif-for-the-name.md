# System serif for the name

The theme's identity is a single quiet serif moment: the candidate's name. Decision: the name renders on the **system serif stack** — `"New York", Georgia, "Times New Roman", serif` — exposed as the `--font-display` token, with no embedded font.

System fonts ship with the OS, so the output stays self-contained with a **zero** font payload, and the theme carries no font file, license, or generation script to maintain.

Accepted tradeoff: the face **drifts** across viewers — macOS resolves to New York, Windows to Georgia, Linux/Android further down the stack. The name is the one place a viewer will notice the difference; the design accepts that the *face* is not stable per machine while the *role* (one quiet serif moment, semi-bold, ink) is.

Considered: one embedded face (a Source Serif 4 instance, subset and base64-inlined — ~35 KB of WOFF2, ≈47 KB in the built CSS, with the OFL rename and a regeneration script; rejected for the payload and maintenance surface a system face avoids); a font CDN (rejected — breaks self-containment).

Consequences: the name keeps its role everywhere while the face may differ per machine; swapping the display face later is a one-token change (`--font-display`). `--folio-name-weight` stays 600; viewers without a 600 cut resolve to the nearest available weight. Body text is unaffected — it was always the system sans stack.
