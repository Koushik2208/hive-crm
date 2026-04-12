# Salon · Spa · Clinic CRM — System Blueprint

---

## 1. Project Overview

**Product Name:** HiveCRM (working title)
**Type:** Multi-tenant SaaS CRM Platform
**Target Users:** Salons, spas, aesthetic clinics, and hybrid businesses
**Tagline:** One system for booking, billing, and client care — from a single chair to a multi-branch chain.

HiveCRM is a modular, white-label-ready CRM platform that competes directly with Vagaro, Fresha, and Zenoti. It wins on flexibility: a single system that handles beauty-style booking UX, spa-style packages, and clinic-style consent and treatment notes without forcing workflow compromises. Built for a solo developer to ship incrementally, but architected to scale.

---

## 2. Clarified Requirements

| Dimension | Decision |
|---|---|
| Core action | Appointment booking and calendar management |
| Primary users | Receptionist (daily), Manager/Owner (as needed) |
| Role model | 6-role hierarchical inheritance |
| Phase 1 modules | Appointments, Billing/POS, Client Profiles, Staff Scheduling |
| Phase 2 modules | Inventory, Multi-branch, Branch Reporting |
| Phase 3 modules | Clinic Notes, Consent Forms, Analytics Dashboard |
| Tenancy model | Shared DB + tenant_id on every row + Supabase RLS |
| Integrations | Razorpay/Stripe, WhatsApp Business API / Twilio, Resend |
| Device target | Desktop/tablet-first, responsive mobile fallback |
| Hosting | Vercel + Supabase + custom subdomain |
| Team size | Solo developer, phased delivery |
| Monetisation | Monthly SaaS subscription per branch or per seat |

---

## 3. Market Insights

### Similar Products
- **Vagaro** — Best for small single-location salons. Weak multi-branch support, basic CRM, dated UI.
- **Fresha** — Good for budget-conscious new salons. Hidden fees at scale, no real inventory.
- **Zenoti** — Best for large chains. Expensive, heavy onboarding, overkill for small shops.

### What Users Love
- Fast, visual calendar that front desk can operate under pressure
- Closing a bill right after a service without switching tools
- Marketplace discovery for new clients

### Common Complaints
- Hidden costs: "free" plans with per-booking fees; add-ons for reports, staff seats
- Terrible multi-branch reporting — no same-day cross-branch visibility
- Clunky front-desk flow: slow checkout, crashes on busy days

### Market Gaps (Your Opportunity)
- **Hybrid-practice OS** — no tool handles beauty booking + spa packages + clinic consent/notes cleanly in one system
- **WhatsApp-first + offline-capable POS** — critical for India and similar markets

---

## 4. Architecture Strategy

### Architecture Type: Modular Monolith

**Why:** Solo developer + CRUD-heavy + under 10k users to start = Modular Monolith is the optimal choice. Each feature domain (appointments, billing, inventory, etc.) lives in its own module folder with clear boundaries, but they share one Next.js app and one database. When a domain needs to be extracted into a microservice later, the boundary is already clean.

### Database: PostgreSQL (via Supabase)

**Why:** All 9 data types are deeply relational. Appointments link to clients, staff, and services. Invoices link to appointments and inventory. Supabase adds Row-Level Security (RLS) for tenant isolation, built-in auth, and S3-compatible storage — all in one platform.

### Next.js Strategy

| Layer | Approach | Why |
|---|---|---|
| Dashboard / CRM UI | App Router + Server Components | Fast initial load, SEO not needed |
| Calendar / POS | Client Components | High interactivity required |
| API | Next.js Route Handlers (/api/*) | Co-located, simple for solo dev |
| Auth | NextAuth.js + Supabase session | Role-based, tenant-aware |
| Forms | React Hook Form + Zod | Type-safe validation |
| State | Zustand (client), TanStack Query (server) | Minimal, predictable |

### Communication Pattern
- **Synchronous:** REST via Next.js Route Handlers for all CRUD operations
- **Asynchronous:** Supabase Edge Functions for WhatsApp/SMS reminders (triggered by appointment events)
- **Realtime:** Supabase Realtime for calendar updates (appointment created/updated broadcasts)

### Future Path
- Phase 1–2: Modular Monolith on Vercel + Supabase
- Phase 3+: Extract high-traffic modules (e.g., booking engine) to Supabase Edge Functions
- Scale: Add read replicas on Supabase Pro when tenant count exceeds 100

---

## 5. Feature Modules

### Phase 1 — MVP (Build First)

**M1 — Appointments**
- Visual calendar (day/week/multi-staff view)
- Book, reschedule, cancel appointments
- Service duration and buffer time support
- Multi-provider service types (e.g., couples' treatments)
- Appointment status tracking (booked, confirmed, in-progress, completed, no-show)
- Conflict detection and availability checks

**M2 — Billing / POS**
- Invoice generation from completed appointments
- Line items: services, retail products, tips
- Payment methods: cash, card, UPI, split payment
- Discount and coupon application
- Refund and void support
- Receipt generation (email via Resend)
- Razorpay / Stripe payment gateway integration

**M3 — Client Profiles**
- Client record: name, contact, DOB, photo
- Visit history and service history
- Beauty notes (colour formulas, preferences, allergies)
- Medical history fields (conditions, medications, contraindications)
- Tags and custom fields per tenant
- Client search and merge duplicates

**M4 — Staff Scheduling**
- Staff profiles: name, role, services they perform
- Availability schedules (recurring weekly + exceptions)
- Leave and time-off management
- Commission rate configuration per staff

---

### Phase 2 — Growth Features (Build Second)

**M5 — Inventory**
- Product catalogue (retail + backbar/consumables)
- Stock level tracking with low-stock alerts
- Backbar usage logging per appointment (product consumed on client)
- Purchase orders and supplier management
- Stock adjustment and audit log

**M6 — Multi-Branch**
- Branch creation and management per tenant
- Staff assignment to branches
- Services and pricing per branch
- Cross-branch client record access (with permission)

**M7 — Branch Reporting**
- Daily revenue summary per branch
- Appointments completed vs. cancelled vs. no-show
- Top services and top staff by revenue
- Inventory consumption report
- Exportable CSV reports

---

### Phase 3 — Clinic Depth (Build Third)

**M8 — Clinic Notes**
- SOAP-style treatment notes per appointment
- Before/after image upload (Supabase Storage)
- Treatment history timeline per client
- Note templates per service type
- Role-restricted visibility (staff vs. doctor vs. owner)

**M9 — Consent Forms**
- Consent form template builder (per tenant)
- Client digital signature capture
- Form assignment to appointment or service type
- Signed form storage and audit trail
- GDPR/DPDP-compliant data handling flags

**M10 — Analytics Dashboard**
- Revenue trends (daily, weekly, monthly)
- Client retention rate and churn risk flags
- Staff performance metrics
- Inventory cost vs. revenue analysis
- Cross-branch comparison charts

---

## 6. Database Design

### Naming Convention
All entity names are identical across database, API routes, frontend components, and seed data.

---

### tenants
```
id              UUID PRIMARY KEY
name            VARCHAR(255)
slug            VARCHAR(100) UNIQUE        -- used for subdomain routing
plan            ENUM('trial','starter','pro','enterprise')
plan_seats      INTEGER
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### branches
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
name            VARCHAR(255)
address         TEXT
phone           VARCHAR(20)
timezone        VARCHAR(50)
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ
```

### users
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
branch_id       UUID REFERENCES branches(id) NULLABLE   -- NULL = all branches
email           VARCHAR(255) UNIQUE
password_hash   TEXT
role            ENUM('super_admin','tenant_owner','branch_manager','receptionist','staff','client')
first_name      VARCHAR(100)
last_name       VARCHAR(100)
phone           VARCHAR(20)
avatar_url      TEXT
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ
```

### staff_profiles
```
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
tenant_id       UUID REFERENCES tenants(id)
branch_id       UUID REFERENCES branches(id)
bio             TEXT
commission_rate DECIMAL(5,2)
color_hex       VARCHAR(7)                 -- calendar colour
created_at      TIMESTAMPTZ
```

### staff_availability
```
id              UUID PRIMARY KEY
staff_id        UUID REFERENCES staff_profiles(id)
tenant_id       UUID REFERENCES tenants(id)
branch_id       UUID REFERENCES branches(id)
day_of_week     INTEGER                    -- 0=Sun, 6=Sat
start_time      TIME
end_time        TIME
is_available    BOOLEAN DEFAULT true
```

### clients
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
first_name      VARCHAR(100)
last_name       VARCHAR(100)
email           VARCHAR(255)
phone           VARCHAR(20)
dob             DATE
gender          ENUM('male','female','other','prefer_not_to_say')
notes           TEXT
tags            TEXT[]
avatar_url      TEXT
medical_flags   JSONB                      -- allergies, conditions, medications
beauty_notes    JSONB                      -- colour formulas, preferences
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ
```

### service_categories
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
name            VARCHAR(100)
color_hex       VARCHAR(7)
sort_order      INTEGER
```

### services
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
branch_id       UUID REFERENCES branches(id) NULLABLE   -- NULL = all branches
category_id     UUID REFERENCES service_categories(id)
name            VARCHAR(255)
description     TEXT
duration_mins   INTEGER
buffer_mins     INTEGER DEFAULT 0
price           DECIMAL(10,2)
is_multi_staff  BOOLEAN DEFAULT false
is_active       BOOLEAN DEFAULT true
```

### appointments
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
branch_id       UUID REFERENCES branches(id)
client_id       UUID REFERENCES clients(id)
staff_id        UUID REFERENCES staff_profiles(id)
service_id      UUID REFERENCES services(id)
starts_at       TIMESTAMPTZ
ends_at         TIMESTAMPTZ
status          ENUM('booked','confirmed','in_progress','completed','cancelled','no_show')
notes           TEXT
cancel_reason   TEXT
created_by      UUID REFERENCES users(id)
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### invoices
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
branch_id       UUID REFERENCES branches(id)
appointment_id  UUID REFERENCES appointments(id) NULLABLE
client_id       UUID REFERENCES clients(id)
invoice_number  VARCHAR(50)
subtotal        DECIMAL(10,2)
discount_amount DECIMAL(10,2) DEFAULT 0
tax_amount      DECIMAL(10,2) DEFAULT 0
tip_amount      DECIMAL(10,2) DEFAULT 0
total           DECIMAL(10,2)
status          ENUM('draft','paid','refunded','void')
payment_method  ENUM('cash','card','upi','split')
gateway_ref     VARCHAR(255)
created_by      UUID REFERENCES users(id)
created_at      TIMESTAMPTZ
```

### invoice_items
```
id              UUID PRIMARY KEY
invoice_id      UUID REFERENCES invoices(id)
tenant_id       UUID REFERENCES tenants(id)
item_type       ENUM('service','product','tip','discount')
name            VARCHAR(255)
quantity        DECIMAL(10,3)
unit_price      DECIMAL(10,2)
total           DECIMAL(10,2)
service_id      UUID REFERENCES services(id) NULLABLE
product_id      UUID REFERENCES products(id) NULLABLE
staff_id        UUID REFERENCES staff_profiles(id) NULLABLE
```

### products
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
branch_id       UUID REFERENCES branches(id) NULLABLE
name            VARCHAR(255)
sku             VARCHAR(100)
category        VARCHAR(100)
product_type    ENUM('retail','backbar','consumable')
unit            VARCHAR(50)
price           DECIMAL(10,2)
cost            DECIMAL(10,2)
stock_qty       DECIMAL(10,3)
low_stock_alert DECIMAL(10,3)
is_active       BOOLEAN DEFAULT true
```

### consent_form_templates
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
name            VARCHAR(255)
content         JSONB                      -- form field schema
service_ids     UUID[]                     -- which services require this form
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ
```

### consent_form_submissions
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
template_id     UUID REFERENCES consent_form_templates(id)
client_id       UUID REFERENCES clients(id)
appointment_id  UUID REFERENCES appointments(id)
form_data       JSONB
signature_url   TEXT
submitted_at    TIMESTAMPTZ
```

### treatment_notes
```
id              UUID PRIMARY KEY
tenant_id       UUID REFERENCES tenants(id)
appointment_id  UUID REFERENCES appointments(id)
client_id       UUID REFERENCES clients(id)
staff_id        UUID REFERENCES staff_profiles(id)
subjective      TEXT
objective       TEXT
assessment      TEXT
plan            TEXT
images          TEXT[]
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

---

## 7. API Design

All routes are prefixed with `/api/v1`. Every route handler enforces `tenant_id` from the authenticated session. Role-based guards are noted per endpoint.

### Tenants
```
POST   /api/v1/tenants                    -- super_admin only
GET    /api/v1/tenants/:id                -- super_admin, tenant_owner
PATCH  /api/v1/tenants/:id                -- super_admin, tenant_owner
```

### Branches
```
GET    /api/v1/branches                   -- scoped to tenant
POST   /api/v1/branches                   -- tenant_owner
PATCH  /api/v1/branches/:id               -- tenant_owner, branch_manager
DELETE /api/v1/branches/:id               -- tenant_owner
```

### Users
```
GET    /api/v1/users                      -- manager+
POST   /api/v1/users                      -- manager+
GET    /api/v1/users/:id                  -- self or manager+
PATCH  /api/v1/users/:id                  -- self (limited fields) or manager+
DELETE /api/v1/users/:id                  -- tenant_owner
```

### Clients
```
GET    /api/v1/clients                    -- staff+
POST   /api/v1/clients                    -- staff+
GET    /api/v1/clients/:id                -- staff+
PATCH  /api/v1/clients/:id                -- staff+
DELETE /api/v1/clients/:id                -- manager+
GET    /api/v1/clients/:id/appointments   -- staff+
GET    /api/v1/clients/:id/invoices       -- receptionist+
```

### Services
```
GET    /api/v1/services                   -- all authenticated
POST   /api/v1/services                   -- manager+
PATCH  /api/v1/services/:id               -- manager+
DELETE /api/v1/services/:id               -- manager+
GET    /api/v1/service-categories         -- all authenticated
POST   /api/v1/service-categories         -- manager+
```

### Staff
```
GET    /api/v1/staff                      -- all authenticated (supports role filter)
POST   /api/v1/staff                      -- manager+
GET    /api/v1/staff/:id/availability     -- all authenticated
PUT    /api/v1/staff/:id/availability     -- manager+ or self
GET    /api/v1/staff/:id/schedule         -- manager+ or self
```

### Appointments
```
GET    /api/v1/appointments               -- scoped by role/branch
POST   /api/v1/appointments               -- receptionist+
GET    /api/v1/appointments/:id           -- scoped
PATCH  /api/v1/appointments/:id           -- receptionist+
DELETE /api/v1/appointments/:id           -- manager+
POST   /api/v1/appointments/:id/confirm   -- receptionist+
POST   /api/v1/appointments/:id/complete  -- staff+
POST   /api/v1/appointments/:id/cancel    -- receptionist+
GET    /api/v1/appointments/availability  -- all authenticated (slot checker)
```

### Invoices
```
GET    /api/v1/invoices                   -- receptionist+
POST   /api/v1/invoices                   -- receptionist+
GET    /api/v1/invoices/:id               -- receptionist+
PATCH  /api/v1/invoices/:id               -- receptionist+
POST   /api/v1/invoices/:id/pay           -- receptionist+
POST   /api/v1/invoices/:id/refund        -- manager+
POST   /api/v1/invoices/:id/void          -- manager+
GET    /api/v1/invoices/:id/receipt       -- receptionist+
```

### Products (Phase 2)
```
GET    /api/v1/products                   -- staff+
POST   /api/v1/products                   -- manager+
PATCH  /api/v1/products/:id               -- manager+
POST   /api/v1/products/:id/adjust-stock  -- manager+
GET    /api/v1/products/low-stock         -- manager+
```

### Treatment Notes (Phase 3)
```
GET    /api/v1/treatment-notes            -- staff+ (own) manager+ (all)
POST   /api/v1/treatment-notes            -- staff+
GET    /api/v1/treatment-notes/:id        -- staff+ (own) manager+ (all)
PATCH  /api/v1/treatment-notes/:id        -- staff+ (own within 24h)
```

### Consent Forms (Phase 3)
```
GET    /api/v1/consent-form-templates     -- staff+
POST   /api/v1/consent-form-templates     -- manager+
POST   /api/v1/consent-form-submissions   -- staff+ (submit on behalf)
GET    /api/v1/consent-form-submissions/:clientId -- staff+
```

---

## 8. Frontend Structure

Next.js 14 App Router layout. All routes under `(dashboard)` are protected by middleware that checks session + tenant_id.

```
.
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                    -- sidebar, topbar, auth guard
│   │   ├── page.tsx                      -- redirect to /appointments
│   │   ├── appointments/
│   │   │   ├── page.tsx                  -- calendar view
│   │   │   ├── [id]/page.tsx             -- appointment detail
│   │   │   └── new/page.tsx              -- booking form
│   │   ├── clients/
│   │   │   ├── page.tsx                  -- client list
│   │   │   ├── [id]/page.tsx             -- client profile
│   │   │   └── new/page.tsx
│   │   ├── billing/
│   │   │   ├── page.tsx                  -- invoice list
│   │   │   ├── [id]/page.tsx             -- invoice/POS view
│   │   │   └── new/page.tsx
│   │   ├── staff/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── [id]/schedule/page.tsx
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── inventory/                    -- Phase 2
│   │   │   └── page.tsx
│   │   ├── branches/                     -- Phase 2
│   │   │   └── page.tsx
│   │   ├── reports/                      -- Phase 2
│   │   │   └── page.tsx
│   │   ├── clinic-notes/                 -- Phase 3
│   │   │   └── page.tsx
│   │   ├── consent-forms/               -- Phase 3
│   │   │   └── page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── billing/page.tsx
│   │       └── team/page.tsx
│   └── api/
│       └── v1/
│           ├── appointments/route.ts
│           ├── clients/route.ts
│           ├── invoices/route.ts
│           └── ... (one folder per resource)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── PageContainer.tsx
│   ├── appointments/
│   │   ├── AppointmentCalendar.tsx
│   │   ├── AppointmentCard.tsx
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentStatusBadge.tsx
│   │   └── StaffFilterBar.tsx            -- horizontal staff filters
│   ├── clients/
│   │   ├── ClientCard.tsx
│   │   ├── ClientForm.tsx
│   │   └── ClientProfileTabs.tsx
│   ├── billing/
│   │   ├── InvoiceForm.tsx
│   │   ├── POSPanel.tsx
│   │   └── PaymentModal.tsx
│   ├── staff/
│   │   ├── StaffCard.tsx
│   │   └── AvailabilityGrid.tsx
│   └── ui/                               -- shared: Button, Input, Modal, Table, Badge
│       ├── Button.tsx                    -- generic button with thematic variants
│       ├── SegmentedControl.tsx          -- tab-style state toggler
│       └── FloatingActionButton.tsx      -- global bottom right action
├── lib/
│   ├── mockData.ts                       -- temporary api structured mock data
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── auth/
│   │   ├── session.ts
│   │   └── permissions.ts                -- role permission matrix
│   ├── validations/
│   │   ├── appointment.schema.ts
│   │   ├── client.schema.ts
│   │   └── invoice.schema.ts
│   └── utils/
│       ├── date.ts
│       └── currency.ts
├── hooks/
│   ├── useAppointments.ts
│   ├── useStaff.ts
│   ├── useCalendar.ts
│   └── useClients.ts
├── stores/
│   ├── calendarStore.ts                  -- Zustand
│   └── posStore.ts
└── types/
    ├── appointments.ts
    ├── clients.ts
    ├── invoices.ts
    └── index.ts
```

---

## 9. Security

### Authentication
- **Provider:** NextAuth.js with Supabase adapter
- **Session:** JWT stored in httpOnly cookie, 24-hour expiry
- **Tenant resolution:** `tenant_id` resolved from subdomain on every request via middleware
- **Password policy:** Minimum 8 characters, bcrypt hashing (cost factor 12)

### Role Permission Matrix

| Action | super_admin | tenant_owner | branch_manager | receptionist | staff | client |
|---|---|---|---|---|---|---|
| Manage tenants | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage branches | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage users | ✅ | ✅ | ✅ (own branch) | ❌ | ❌ | ❌ |
| View all appointments | ✅ | ✅ | ✅ (own branch) | ✅ | own only | own only |
| Create/edit appointments | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create invoices | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Refund/void invoices | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View client records | ✅ | ✅ | ✅ | ✅ | ✅ | own only |
| Write treatment notes | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| View reports | ✅ | ✅ | ✅ (own branch) | ❌ | ❌ | ❌ |
| Manage inventory | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage services | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

### Tenant Isolation (Supabase RLS)
Every table has a `tenant_id` column. Supabase Row-Level Security policies enforce:
```sql
-- Example RLS policy on appointments table
CREATE POLICY "tenant_isolation" ON appointments
  USING (tenant_id = auth.jwt() ->> 'tenant_id');
```
This ensures a query bug cannot leak one tenant's data to another.

### Input Validation
- All API inputs validated with Zod schemas before database write
- File uploads (consent forms, images) validated for MIME type and max size (10MB)
- SQL injection: prevented by Prisma parameterised queries (no raw string interpolation)

### Rate Limiting
- Auth endpoints: 10 requests/minute per IP (via Vercel Edge middleware)
- API endpoints: 100 requests/minute per tenant
- Webhook endpoints (payment, WhatsApp): 50 requests/minute with HMAC signature verification

### Environment Secrets
- All secrets stored in Vercel environment variables (never in code)
- Supabase service role key never exposed to client
- Payment gateway webhooks verified with HMAC signatures

### OWASP Top Risks Addressed

**Risk 1 — Broken Access Control (A01)**
Every API route handler calls `getServerSession()` and validates role permissions before any database operation. `tenant_id` is always taken from the session, never from user input. Supabase RLS provides a second enforcement layer.

**Risk 2 — Security Misconfiguration (A05)**
CORS configured to allow only the platform's own subdomain. `Content-Security-Policy`, `X-Frame-Options`, and `Strict-Transport-Security` headers set via Next.js config. Supabase public anon key has minimal permissions; all sensitive operations use server-side service role key.

---

## 10. Trade-offs

### Why This Architecture

**Modular Monolith** was chosen because a solo developer building a validation-stage SaaS needs to ship fast without managing inter-service communication, distributed tracing, or separate deployment pipelines. The module boundaries are enforced by folder structure and import rules — not by network calls. When a specific module needs to scale independently later, it can be extracted cleanly.

**PostgreSQL over MongoDB** because the data is deeply relational — appointments join clients, staff, services, and invoices. Joins are a feature here, not a problem. Supabase's RLS also only works natively with PostgreSQL.

**Supabase over plain PostgreSQL** because it bundles auth, RLS, realtime, and storage — eliminating three separate integrations a solo developer would otherwise need to wire up manually.

### Why Not Alternatives

**Not Microservices:** Premature for a solo developer validating with 1–50 tenants. Adds deployment complexity, network latency between services, and distributed transaction problems with no team to manage them.

**Not MongoDB:** The schema is well-defined and relational. MongoDB's flexibility would be unused and its lack of native joins would require application-level joins — slower and more error-prone.

**Not Kubernetes/Kafka/Elasticsearch:** Stack constraint enforced intentionally. These are enterprise-grade tools that add operational overhead that would slow a solo developer to a halt before shipping.

### Honest Weaknesses

**Weakness 1 — Shared database at scale:** The `tenant_id` row-level approach is fast to build and works well to ~500 tenants. Beyond that, a single PostgreSQL instance becomes a bottleneck and one noisy tenant can degrade performance for others. Mitigation: Supabase Pro allows read replicas; enterprise clients can be migrated to dedicated schemas when needed.

**Weakness 2 — Vercel cold starts for API routes:** Next.js Route Handlers on Vercel run as serverless functions and have cold start latency (~200–400ms) on the first request. For a POS checkout flow, this could feel slow. Mitigation: Keep critical POS endpoints warm using Vercel's fluid compute option, or move the billing module to a persistent Supabase Edge Function.

---

## 11. Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
NEXT_PUBLIC_APP_ENV=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth (NextAuth)
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=https://app.yourdomain.com

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-hmac-secret
# OR for Stripe
STRIPE_PUBLIC_KEY=pk_live_xxxx
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# WhatsApp / SMS
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
# OR WhatsApp Business API
WHATSAPP_API_TOKEN=your-meta-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id

# Email (Resend)
RESEND_API_KEY=re_xxxx
EMAIL_FROM=noreply@yourdomain.com

# Storage (Supabase Storage — built-in, no extra vars needed)
SUPABASE_STORAGE_BUCKET_CONSENT=consent-forms
SUPABASE_STORAGE_BUCKET_IMAGES=treatment-images
```

---

## 12. Day 1 Developer Checklist

### Project Setup
- [ ] Create Next.js 14 app: `npx create-next-app@latest hivecrm --typescript --tailwind --app`
- [ ] Install core dependencies: `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs next-auth prisma @prisma/client zod react-hook-form zustand @tanstack/react-query`
- [ ] Install UI: `npm install lucide-react clsx tailwind-merge`
- [ ] Set up Supabase project and copy keys to `.env.local`
- [ ] Configure custom subdomain on Vercel (e.g., `app.yourdomain.com`)

### Database
- [ ] Initialise Prisma: `npx prisma init`
- [ ] Write Prisma schema for all Phase 1 tables (tenants, branches, users, clients, services, staff_profiles, staff_availability, appointments, invoices, invoice_items)
- [ ] Run first migration: `npx prisma migrate dev --name init`
- [ ] Enable RLS on all tables in Supabase dashboard
- [ ] Write RLS policy for `tenant_id` isolation on each table
- [ ] Seed database with Phase 1 seed data (see Phase 5 below)

### Auth
- [ ] Configure NextAuth with Supabase adapter
- [ ] Implement `middleware.ts` for subdomain-based tenant resolution
- [ ] Implement `permissions.ts` with role hierarchy
- [ ] Test login flow with seeded super_admin and tenant_owner accounts

### Phase 1 Module Order (build in this sequence)
- [ ] **M1 — Clients:** CRUD, search, profile page (simplest, no dependencies)
- [ ] **M4 — Staff:** Profiles, availability grid
- [ ] **M3 — Services:** Categories, service list, per-branch pricing
- [ ] **M1 — Appointments:** Availability checker, calendar, booking form, status flow
- [ ] **M2 — Billing/POS:** Invoice creation from appointment, payment modal, receipt email

### Integrations
- [ ] Set up Razorpay/Stripe test mode and verify webhook endpoint
- [ ] Set up Resend and test receipt email on invoice paid
- [ ] Set up Twilio WhatsApp sandbox and test appointment reminder trigger

### Before First Tenant Onboards
- [ ] Verify RLS policies prevent cross-tenant data access (write a test)
- [ ] Set up Vercel preview deployments for staging
- [ ] Configure error monitoring (Sentry free tier)
- [ ] Write a smoke test for: create appointment → complete → generate invoice → mark paid

---

*End of Blueprint — Phase 5: Seed Data follows below.*
