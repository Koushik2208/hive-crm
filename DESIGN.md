# Design System Specification: The Ethereal Professional

## 1. Overview & Creative North Star
**Creative North Star: "The Curated Sanctuary"**

This design system moves away from the utilitarian "SaaS" aesthetic of high-density grids and heavy borders. Instead, it draws inspiration from high-end editorial magazines and luxury boutique interiors. The goal is to provide a CRM experience that feels as calm and premium as the salon services it manages.

We achieve this through **Atmospheric Depth**. By breaking the traditional "box-in-a-box" layout, we use intentional asymmetry, generous white space (kerning and leading), and tonal layering. The interface should never feel "crowded"—it should feel like a series of meticulously arranged physical objects on a warm, ivory surface.

---

## 2. Color & Surface Philosophy
The palette is rooted in warmth and sophistication, utilizing a "Tonal-First" approach to hierarchy.

### The Palette (Material 3 Derived)
- **Primary (Deep Plum):** `#32172a` (Action) / `#4a2c40` (Container) – Used for high-authority actions and primary navigation.
- **Secondary (Muted Lavender):** `#6c538b` – Used for supportive actions and subtle brand accents.
- **Tertiary (Champagne/Gold):** `#281f0a` (Text) / `#d6c4a5` (Surface) – Used for "high-touch" highlights, VIP statuses, or special alerts.
- **Neutral (Warm Ivory):** `#faf9f6` – The canvas upon which everything sits.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off the UI. 
- Boundaries must be defined through background color shifts.
- To separate a sidebar from a main feed, use `surface-container-low` against the `background` ivory.
- If a visual break is needed, use a wide gutter of whitespace rather than a line.

### Glass & Gradient Soul
To avoid a "flat" digital feel, main CTAs and Hero sections should utilize a subtle linear gradient:
- **Primary Gradient:** From `primary` (#32172a) to `primary_container` (#4a2c40) at a 135° angle.
- **Surface Glass:** For floating modals or dropdowns, use `surface_container_lowest` at 85% opacity with a `24px` backdrop-blur.

---

## 3. Typography: The Editorial Voice
We use **Manrope** exclusively. Its geometric yet slightly rounded nature strikes the balance between modern efficiency and approachable luxury.

- **Display (3.5rem - 2.25rem):** Used for large, welcoming dashboard greetings. Letter spacing should be set to `-0.02em` to feel tighter and more bespoke.
- **Headlines (2rem - 1.5rem):** Set with generous line-height (1.4) to ensure the interface "breathes."
- **Titles (1.375rem - 1rem):** The workhorse for card headers. Always use `Medium` (500) weight.
- **Body (1rem - 0.75rem):** Standard text. Increase letter spacing to `0.01em` for a high-end, airy feel.
- **Labels (0.75rem - 0.6rem):** All-caps labels should be used sparingly for "Meta" information (e.g., "APPOINTMENT TIME"), with letter spacing at `0.05em`.

---

## 4. Elevation & Depth
We convey importance through **Tonal Layering**, not structural lines.

### The Layering Principle
Think of the UI as layers of fine paper stacked.
1.  **Base:** `surface` (#faf9f6)
2.  **Sectioning:** `surface_container_low` (#f4f3f1)
3.  **Interactive Cards:** `surface_container_lowest` (#ffffff)
4.  **Floating Elements:** `surface_bright` with an **Ambient Shadow**.

### Ambient Shadows
Shadows must be felt, not seen.
- **Values:** `0px 12px 32px rgba(78, 68, 73, 0.06)`
- Use a tint of the `on_surface_variant` color (Plum-Grey) instead of pure black to ensure the shadow looks like it is cast by warm indoor lighting.

### The "Ghost Border" Fallback
If accessibility requires a container definition (e.g., an input field), use the `outline_variant` (#d1c3c9) at **15% opacity**. It should be a whisper of a line, not a statement.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (Plum to Deep Plum), white text, `xl` (0.75rem) corner radius. High-gloss finish.
- **Secondary:** Surface-only (Ivory) with a Lavender (`secondary`) text label. No border.
- **Tertiary:** Text-only in Plum with a subtle Champagne Gold underline on hover.

### Input Fields
- **Styling:** No background. Only a bottom "Ghost Border" (20% opacity). 
- **States:** On focus, the bottom border transitions to a 2px `secondary` (Lavender) line.

### Cards & Lists
- **Forbid Dividers:** Use a `16px` or `24px` vertical gap to separate list items. 
- **Interaction:** On hover, a card should shift from `surface_container_lowest` to a subtle `surface_bright` with an Ambient Shadow.

### Contextual Salon Components
- **The "Availability" Chip:** Use a `tertiary_fixed` (Champagne) background with `on_tertiary_fixed` text for high-end luxury feel for VIP openings.
- **The Service Timeline:** A vertical line-less list using different surface tones to denote "Morning," "Afternoon," and "Evening" shifts.

---

## 6. Do’s and Don’ts

### Do:
- **Use "Asymmetric Breathing Room":** Align text to the left but allow the right side of cards to have excessive padding (e.g., 40px+) to create an editorial feel.
- **Prioritize Tonal Shifts:** If a piece of info feels "lost," change its background tone by one step (e.g., to `surface_container_high`) rather than adding a border.
- **Use Softness:** Use the `xl` (0.75rem) radius for cards and `full` (pill) for status chips.

### Don’t:
- **No 100% Black:** Never use `#000000`. Use `primary` (#32172a) for high-contrast text.
- **No "Heavy" Shadows:** If the shadow is clearly visible as a dark grey blur, it is too heavy. It should look like a soft glow.
- **No Grid Rigidity:** Avoid filling every pixel of a row. If a card only needs 60% of the width, let it sit with empty space to its right. Luxury is the luxury of space.