import { prisma } from "../lib/prisma";

async function main() {
  try {
    const tenant = await prisma.tenants.findFirst();
    console.log("--- DEVELOPMENT IDS ---");
    console.log("Tenant ID:", tenant?.id || "None found");
    
    if (tenant) {
      const branch = await prisma.branches.findFirst({
        where: { tenant_id: tenant.id }
      });
      console.log("Branch ID:", branch?.id || "None found");
    }
    console.log("-----------------------");
  } catch (error) {
    console.error("Error fetching IDs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
