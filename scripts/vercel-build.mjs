import { execSync } from "node:child_process";

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit" });
}

const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.VERCEL_ENV === "production";

if (isVercel && isProduction) {
  if (!process.env.DIRECT_URL) {
    throw new Error(
      "DIRECT_URL wajib tersedia di Vercel Production agar Prisma migration dapat dijalankan.",
    );
  }

  console.log("Production deployment detected. Applying pending Prisma migrations...");
  run("npx prisma migrate deploy");
} else {
  console.log(
    `Skipping Prisma migrate deploy (VERCEL=${process.env.VERCEL ?? "unset"}, VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}).`,
  );
}

run("next build");
