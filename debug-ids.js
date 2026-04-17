const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.findFirst({
    select: { id: true, tenant_id: true, email: true }
  });
  console.log('--- FOUND IDS ---');
  console.log('USER_ID:', user.id);
  console.log('TENANT_ID:', user.tenant_id);
  console.log('EMAIL:', user.email);
  console.log('-----------------');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
