import { parseEnv } from "@neon/env";
import config from "../../neon";

/**
 * Typed Neon env — validates pooled DATABASE_URL is present.
 * Prisma still reads process.env; this fails fast if Neon deploy/env pull was skipped.
 */
export function getNeonEnv() {
  return parseEnv(config, ["DATABASE_URL"] as const);
}

export function assertDatabaseConfigured() {
  const { postgres } = getNeonEnv();
  if (!postgres.databaseUrl) {
    throw new Error("DATABASE_URL is missing. Run `npx neon@latest deploy` or set it in .env.");
  }
  return postgres;
}
