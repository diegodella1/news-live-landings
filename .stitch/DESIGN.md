# Design System: Source-Forward News Landings

## 1. Visual Theme & Atmosphere

A premium editorial intelligence surface: restrained, asymmetric, and visually rich without looking like broadcast TV. Density is balanced for fast scanning, variance is high enough to avoid generic card grids, and motion is fluid but quiet. The atmosphere should feel like a modern newsroom product desk: composed, evidence-led, and visually decisive.

## 2. Color Palette & Roles

- **Charcoal Ink** (#18181B) — Primary page background, never pure black.
- **Deep Zinc** (#27272A) — Elevated panels and visual containers.
- **Paper White** (#F4F4F5) — Primary text and high-contrast labels.
- **Muted Zinc** (#A1A1AA) — Metadata, source context, quiet labels.
- **Whisper Border** (rgba(244,244,245,0.14)) — Structural lines and panel edges.
- **Signal Lime** (#D6FF5F) — Single accent for live state, links, and active evidence. No secondary neon accents.

## 3. Typography Rules

- **Display:** Space Grotesk — tight, confident, controlled scale. No all-caps shouting for headlines.
- **Body:** Work Sans — relaxed leading, max 65 characters per line.
- **Metadata:** Space Grotesk — compact uppercase labels with modest letter spacing.
- **Banned:** Inter, generic serif fonts, pure black, neon glows, purple/blue gradients, fabricated numbers.

## 4. Component Stylings

- **Hero:** Asymmetric split. Large image or visualized evidence background. Concise headline and source-aware metadata. No centered generic hero.
- **Story Frames:** Horizontal evidence cards when multiple sections exist. Each card must include section-level source chips.
- **Visual Tiles:** Use chart, map, image, or abstract evidence visuals. Never show raw placeholder words as visuals.
- **Sources:** Source rail is visible and close to content. Links use Signal Lime only on hover/focus.
- **Cards:** Rounded 28px panels, quiet border, deep shadow. No glassmorphism or outer glow.

## 5. Layout Principles

Use CSS Grid-first responsive architecture with max-width 1380px. Collapse to one column below 800px. No horizontal overflow on mobile except intentional clipped story carousel. Avoid equal 3-column card rows. Every element must occupy a clear spatial zone with no overlap.

## 6. Motion & Interaction

Use transform and opacity only. Reveal content with spring-like ease and restrained stagger. Ticker movement is acceptable only for summaries. Active live dot may pulse subtly. No bouncing arrows, no decorative glow loops.

## 7. Anti-Patterns

No emojis. No pure black. No neon or outer glow shadows. No purple/blue gradient aesthetic. No generic landing-page filler. No fake statistics. No unsourced claims. No placeholder names. No broken image links. No text-only visual tiles. No brand-specific Roxom/TV styling.
