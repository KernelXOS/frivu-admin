import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin2025*", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@frivu.com" },
    update: {},
    create: {
      name: "Admin Frivu",
      email: "admin@frivu.com",
      password,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin creado:", admin.email);
  console.log("   Password: Admin2025*");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
