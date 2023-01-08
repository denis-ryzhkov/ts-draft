import { strict as assert } from "node:assert";
import pgFormat from "pg-format";
import { Prisma, PrismaClient, PrismaPromise } from "@prisma/client";
import { current } from "@src/types/Context";

/**
 * Version of `prisma.$executeRawUnsafe(`SET LOCAL "caller".? = ?`)`
 * with some protection from SQL injections.
 */
export const setCallerVar = (prisma: PrismaClient, name: string, value: string) => {
    // `SET LOCAL` requires string values only, `NULL` is not allowed.

    // Defensive programming in case `pgFormat` has a bug:
    assert(!value.includes("'") && !value.includes("\\"));

    // Much safer now:
    const sql = pgFormat('SET LOCAL "caller".%I = %L', name, value);
    return prisma.$executeRawUnsafe(sql);
};

/**
 * RLS middleware.
 */

export const rlsMiddleware: Prisma.Middleware = async (params, next) => {
    if (current.isAdmin || params.runInTransaction) return await next(params);

    // TODO: Implement RLS support for Prisma fluent API
    // once we need it to e.g. `query { items { something { ...}}}`.
    // Once implemented, uncomment `relations` in `src/resolvers/index.ts`.
    if (params.dataPath.length) {
        throw new Error("Implement RLS support for Prisma fluent API!");
    }

    // Unpack current context.
    if (current.context === undefined) throw new Error("Current context is undefined!");
    const { prisma, role, userId } = current.context;

    // Get `prismaAction` function based on `params` of GraphQL API request.
    const pascalCased = String(params.model); // E.g. "Item".
    const camelCased = pascalCased.charAt(0).toLowerCase() + pascalCased.slice(1);
    const prismaModel = prisma[camelCased as keyof PrismaClient];
    const prismaAction: (args: unknown) => PrismaPromise<unknown> =
        prismaModel[params.action as keyof typeof prismaModel];

    // Wrap `prismaAction` to a transaction with few SQL variables set,
    // they will be checked by SQL RLS policies.
    const results = await prisma.$transaction([
        prisma.$executeRawUnsafe('SET LOCAL ROLE "caller"'),
        setCallerVar(prisma, "role", role),
        setCallerVar(prisma, "userId", userId || "N/A"), // N/A for machine-to-machine.
        prismaAction(params.args),
    ]);

    // Return the result of `prismaAction`.
    return results[results.length - 1];
};
