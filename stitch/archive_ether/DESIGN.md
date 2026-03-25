# Design System Strategy: The Digital Archivist

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Digital Archivist."** 

We are moving away from the frantic, high-intensity UI of modern social platforms and toward a "Calm Technology" experience. This system treats user memories with the reverence of a physical museum or a high-end editorial publication. 

To break the "template" look common in memory apps, we utilize **intentional asymmetry** and **tonal depth**. Layouts should feel curated, not auto-generated. This is achieved by overlapping elements (e.g., a photo breaking the container of a card), high-contrast typography scales that prioritize storytelling, and a rejection of the "box-within-a-box" grid in favor of open, breathable compositions.

---

## 2. Colors

The palette is rooted in warmth and permanence, moving away from sterile whites and toward organic creams and deep, authoritative charcoals.

### The Palette
- **Primary (Memory Green):** `#46645b` — Used for discovery and forward momentum.
- **Surface (The Canvas):** `#fcf9f5` — A warm, paper-like neutral.
- **On-Surface (The Ink):** `#32332d` — Deep charcoal for high-legibility storytelling.
- **Tertiary (The Artifact):** `#6d5c49` — A soft clay-brown for metadata and secondary archiving cues.

### Core Visual Rules
*   **The "No-Line" Rule:** We do not use 1px solid borders to section content. To separate a header from a body or one card from another, use background color shifts (e.g., a `surface-container-low` section sitting on a `surface` background) or vertical whitespace.
*   **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of fine paper. Use the `surface-container` tiers (Lowest to Highest) to create depth. An inner memory card should use `surface-container-lowest` while its parent container sits on `surface-container-low`.
*   **The "Glass & Gradient" Rule:** For floating navigation or "quick-add" menus, use Glassmorphism. Implement a semi-transparent `surface` color with a `backdrop-blur` effect.
*   **Signature Textures:** Main Call-to-Actions should use a subtle gradient from `primary` (#46645b) to `primary-dim` (#3a584f) to provide a "tactile" weight that flat buttons lack.

---

## 3. Typography

The typography strategy relies on the tension between the classic, literary feel of **Newsreader** (Serif) and the functional, modern clarity of **Manrope** (Sans-Serif).

| Level | Token | Font Family | Size | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Newsreader | 3.5rem | Large, emotive storytelling titles. |
| **Headline** | `headline-md` | Newsreader | 1.75rem | Section headers for memory collections. |
| **Title** | `title-md` | Manrope | 1.125rem | UI-centric titles, card headers. |
| **Body** | `body-lg` | Manrope | 1.0rem | Primary reading experience; high line-height. |
| **Label** | `label-md` | Manrope | 0.75rem | Metadata, dates, and micro-copy. |

**Editorial Note:** Always pair a `display-lg` Serif title with a `label-md` Sans-Serif uppercase subtitle to achieve that high-end archive aesthetic.

---

## 4. Elevation & Depth

We avoid the "shadow-heavy" look of standard Material Design, opting instead for **Tonal Layering**.

*   **The Layering Principle:** Soft, natural lift is achieved by stacking `surface-container` tiers. For example, place a `surface-container-highest` card on a `surface` background. The color difference alone should provide the boundary.
*   **Ambient Shadows:** If a floating element (like a modal) requires a shadow, it must be extra-diffused. Use a blur of `24px` to `48px` at a `4%` opacity, tinted with the `on-surface` color.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **20% opacity**. Never use 100% opaque borders.
*   **Glassmorphism:** Use `surface-tint` at 10% opacity with a blur of 12px for floating navigation bars, allowing the "spatial memory" colors to bleed through.

---

## 5. Components

### Buttons
*   **Primary:** High-contrast `primary` background with `on-primary` text. Roundedness: `lg` (0.5rem). Use a subtle linear gradient for a "pressed-ink" feel.
*   **Secondary:** `surface-container-highest` background. No border. Text in `on-surface`.
*   **Tertiary:** No background. Text in `primary`. Use for low-emphasis actions like "Cancel" or "View More."

### Input Fields
*   **Styling:** Forgo the 4-sided box. Use a `surface-container-low` background with a slightly darker bottom-only `outline-variant` (20% opacity).
*   **States:** On focus, the bottom border transitions to `primary` 2px.

### Cards & Lists
*   **The Rule of Zero Dividers:** Never use horizontal lines to separate list items. Use the **Spacing Scale `4` (1.4rem)** to create "breathing room" between entries.
*   **Memory Cards:** Use `surface-container-lowest` with a `xl` (0.75rem) corner radius. For archival feel, allow the image to bleed to the edges or overlap the title.

### Chips
*   **Action Chips:** Small, `full` rounded elements using `secondary-container`. Use `label-md` typography. These should feel like "labels" in a physical filing cabinet.

---

## 6. Do's and Don'ts

### Do
*   **Do** use generous whitespace (Spacing `8` and `12`) to allow the user's memories to "breathe."
*   **Do** use Newsreader for any text that is "content" (stories, quotes, descriptions).
*   **Do** use Manrope for "utility" (buttons, settings, timestamps).
*   **Do** utilize intentional asymmetry. Align a title to the left, but place the "Edit" button in a non-traditional floating position.

### Don't
*   **Don't** use pure black `#000000`. It is too harsh for the "Calm Tech" aesthetic. Use `on-surface` (#32332d).
*   **Don't** use 1px solid dividers. Use tonal shifts or whitespace.
*   **Don't** use aggressive, fast animations. Use longer durations (300ms-500ms) with "Ease-in-out" curves to mimic the slow unfolding of a letter.
*   **Don't** clutter the screen. If a piece of metadata isn't essential to the "memory," hide it behind a "Details" interaction.