/**
 * MOCK SESSION HELPERS
 * During development phase, we use a fixed tenant and user context.
 * These will be replaced with proper Supabase Auth/JWT resolution in the next phase.
 */

export const MOCK_TENANT_ID = "a1b2c3d4-0001-0001-0001-000000000001"; // Lumina Beauty Studio
export const MOCK_USER_ID = "u1000000-0001-0001-0001-000000000002";   // Priya Sharma (Owner)

export async function getCurrentTenantId(): Promise<string> {
  return MOCK_TENANT_ID;
}

export async function getCurrentUser() {
  return {
    id: MOCK_USER_ID,
    tenant_id: MOCK_TENANT_ID,
    role: 'tenant_owner'
  };
}
