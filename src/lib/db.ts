import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 talks to the database through a driver adapter. PrismaNeon uses
 * Neon's serverless driver, which suits Vercel's short-lived functions far
 * better than a long-lived TCP pool.
 *
 * The singleton matters in dev: hot reload would otherwise open a new pool on
 * every save and exhaust Neon's connection limit.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
