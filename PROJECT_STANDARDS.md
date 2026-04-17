# HiveCRM Core Project Standards & Rules

This document serves as the **Source of Truth** for development patterns in HiveCRM. All contributors (including AI agents) must strictly adhere to these rules to ensure consistency, performance, and the premium "Aura Velvet" aesthetic.

---

## 1. Styling & Design Tokens

### 1.1 Use Semantic Tokens Over Magic Values
**Never** use arbitrary Tailwind values (magic values) in square brackets for repeatable design elements like shadows or colors.
- ❌ **Wrong:** `shadow-[0px_12px_32px_rgba(78,68,73,0.06)]`
- ✅ **Correct:** `shadow-ambient`

### 1.2 The "Aura Velvet" Palette
Stick to the defined theme variables in `globals.css`. Do not introduce new hex codes unless explicitly requested.
- **Surface:** `bg-surface-container-lowest` (pure white), `bg-surface-container-low` (off-white).
- **Primary:** `text-primary`, `bg-primary` (deep plum).
- **Secondary:** `text-secondary`, `bg-secondary` (soft purple).
- **Inactive/Off State:** Always use `bg-outline-variant/30` or `bg-surface-container-low` for toggle backgrounds/empty states.

### 1.3 UI Reusability
Before engineering a custom UI element, check common primitives:
- `components/ui/Button.tsx`: Supports thematic variants.
- `components/ui/FormInput.tsx`: Automatic RHF integration.
- `components/ui/Modal.tsx`: Consistent backdrop and blur effects.

---

## 2. Form Architecture & Validation

### 2.1 The Zod Input/Output Pattern
Always distinguish between the data shape as it exists in the form vs. how it is sent to the API.
- **Form Values:** `type FormValues = z.input<typeof Schema>;` (Allows optional/undefined fields before input).
- **API Payload:** `type CreateInput = z.output<typeof Schema>;` (Strict, validated, with defaults applied).
- **Rule:** Pass `z.input` as the generic to `useForm<T>()`.

### 2.2 Naming Conventions
- **Database/Prisma:** Use `snake_case` (e.g., `branch_id`, `is_active`).
- **Frontend Form State:** Use `camelCase` (e.g., `branchId`, `categoryId`, `isActive`).
- **Logic:** The API route handler is the bridge—it must map the incoming camelCase request body to the snake_case Prisma fields.

### 2.3 Zod "External Optionality" Fix
When using `z.preprocess()` to handle empty strings (e.g., in a Select dropdown), always place `.optional()` and `.nullable()` **outside** the wrapper.
- ❌ **Wrong:** `z.preprocess(fn, z.string().optional())` (Key remains required in RHF).
- ✅ **Correct:** `z.preprocess(fn, z.string()).optional().nullable()` (Key becomes optional in RHF).

### 2.4 Numeric Coercion
Always use `z.coerce.number()` for fields receiving input from HTML `number` inputs to prevent the common "expected number, received string" Zod error.

### 2.5 Mock UUID Safety & Tolerance
During the "Mock Auth" development phase, database strictness must be balanced with development speed.
- **The Hex Rule**: Database columns typed as `@db.Uuid` strictly require hexadecimal strings (0-9, A-F). **NEVER** use alpha-prefixes like `u1000...` or `sp100...` in seed data or mock sessions.
- **Schema Tolerance**: Use `z.string().min(1)` instead of `.uuid()` in Zod schemas for all ID fields until the onboarding system is fully generating valid UUIDs. This prevents "invalid_format" blocks on legacy or placeholder data.

---

## 3. Layout Ownership & Infrastructure

### 3.1 `PageContainer` Rule
Every new dashboard page (`app/(dashboard)/.../page.tsx`) must be wrapped in a `PageContainer`.
- **Purpose:** Manages standard page padding, max-width, and vertical scrolling.
- **Shadow Rule:** If a page is wrapped in `PageContainer`, do not add redundant `mx-auto`, `max-w-7xl`, or additional horizontal padding wrappers inside the component itself.

### 3.2 Prisma Data Safety
- **Optional Chaining:** Always use `?.` when accessing Prisma relations (e.g., `user?.first_name`). Types assume relations could be null.
- **Select Auditing:** In Prisma `select` blocks, include every field you plan to reference in the downstream logic. Do not assume `findFirst` returns fields not in the `select`.

### 3.3 UTC Time Consistency
For "wall-clock" time fields stored as `Time` types:
- **Write:** Use `.setUTCHours()` and `.setUTCMinutes()` to ignore local offsets.
- **Read:** Use `.getUTCHours()` and `.getUTCMinutes()`.
- **Formatting:** Use the project's `formatTime` utility that checks for ISO `T` characters before slicing.

---

## 4. API & Development Standards

### 4.1 Error Reporting
During development, always surface `error.message` in API response catch blocks. Opaque error messages like "Failed to create" block debugging.
- ✅ **Standard:** `return Response.json({ error: error.message || "Generic error" }, { status: 500 });`

### 4.2 Logging
Every server-side `catch` block must include a descriptive console log:
- ✅ **Standard:** `console.error('[POST /api/v1/resource]', error);`

### 4.3 Component Modularization
Avoid monolithic form files. Split complex forms into:
1. **Shell Component:** Handles `FormProvider`, `handleSubmit`, and overall layout.
2. **Section Components:** Logical groups (e.g., `BasicInfoSection`).
3. **UI Primitives:** Atomic inputs registered via `useFormContext`.

### 4.4 Success Response Protocol
To prevent "Unexpected end of JSON input" errors in the client, every successful API response must return a valid JSON object.
- ❌ **Wrong:** `return new Response(null, { status: 204 });`
- ✅ **Correct:** `return Response.json({ success: true });`

---

## 5. API & Data Fetching (TanStack Query)

### 5.1 Centralized Hook Architecture
All data fetching logic must be encapsulated in custom hooks within the `hooks/` directory.
- **Rule:** Never use inline `fetch` or `useEffect` for data fetching in components.
- **Pattern:** `export function useEntity() { return useQuery({ ... }); }`

### 5.2 TanStack Query Best Practices
- **Query Keys:** Use structured arrays for keys: `['entity', id, filters]`.
- **Cache Invalidation:** Every mutation must implement `onSuccess` to invalidate relevant queries.
- **Specific Invalidations:** Use exact keys when possible to prevent global refetching of unrelated data.

### 5.3 Error Handling & Parsing
API hooks must handle response errors by parsing the JSON error body.
- **Standard Pattern:**
  ```ts
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Operation failed');
  }
  ```
- **UI Surface:** Errors should be caught by the component and displayed via `error.message` (e.g., in an alert or toast).

### 5.4 Loading State Experience
High-quality feedback is mandatory during all asynchronous operations.
- **Action Buttons:** Use the `isLoading` or `isPending` state to disable buttons and show a loader (Lucide `Loader2`).
- **Initial Page Load:** Use Skeleton screens or centered spinners for the first data fetch.
- **Background Updates:** Use subtle progress indicators (like a thin top bar) if data is refreshing in the background.

---

## 6. Bridge Patterns & Technical Debt (Mock Auth Phase)

Development is currently in a "Pre-Auth" phase. Specific stabilization patterns are in place that **must** be hardened during Phase 2 (Auth Integration).

### 6.1 Audit Trail Nullability
- **Pattern**: Foreign key fields for auditing (e.g., `created_by`, `updated_by`) are currently set to `nullable` in Prisma and explicitly set to `null` in API route handlers.
- **Reason**: Allows UI and logic testing before a global user session/context is available.
- **Debt Fix**: These fields must be switched to `required` once `NextAuth` is fully integrated and the `getCurrentUserId()` helper is reliable.

### 6.2 Transactional vs. Reference UI Logic
- **Rule**: UI components (like `AppointmentCard`) must always calculate visual states (durations, heights, colors) from the **transactional record** timestamps (`starts_at`, `ends_at`) rather than the **reference record** defaults (`services.duration_mins`).
- **Reason**: Ensures that manual user overrides in the form are immediately visible in the UI.
