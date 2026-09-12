import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Creates a single, production-safe PrismaClient instance.
 * Validates that DATABASE_URL is provided in production without leaking connection secrets.
 */
function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.trim().length === 0) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL CONFIGURATION ERROR: DATABASE_URL environment variable is missing in production. " +
        "Please configure your Supabase PostgreSQL connection string in Vercel project settings."
      );
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

/**
 * Retrieves the cached singleton PrismaClient or creates it if not yet initialized.
 */
export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Lazy Proxy for PrismaClient.
 * Ensures Prisma is NOT instantiated during Next.js module evaluation or static page data collection,
 * but only when a database method is actually invoked during request execution.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
