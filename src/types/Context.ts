import { PrismaClient } from "@prisma/client";
import { cached } from "@src/lib/cache";
import { rlsMiddleware } from "@src/middleware/rls";
import { Role } from "@src/types/Role";

/**
 * Type of our global current state.
 */
type Current = {
    context: Context | undefined;
    isAdmin: boolean;
};

/**
 * Type of GraphQL context state.
 */
export type Context = {
    role: Role;
    userId: string | null; // `null` in M2M case when caller is another service.
    prisma: PrismaClient;
};

/**
 * GraphQL context state of current request.
 */
// Lambdas are single-threaded, so we use global state to pass context of current request.
export const current: Current = {
    context: undefined,
    isAdmin: false,
};

/**
 * Get Prisma client, use cache to avoid multiple connections to DB from the same Lambda.
 */
export const getPrisma = cached("prisma", Infinity, (): PrismaClient => {
    const prisma = new PrismaClient({
        datasources: { db: { url: process.env.DATABASE_URL } },
        // log: ["query", "info", "warn", "error"],
    });

    prisma.$use(rlsMiddleware);
    return prisma;
});
