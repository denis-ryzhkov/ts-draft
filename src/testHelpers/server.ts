/**
 * Create an Apollo server for tests.
 */

import { ApolloServer } from "apollo-server";
import context from "@src/context";
import log from "@src/logger";
import { Role } from "@src/types/Role";
import { createSchema } from "@src/schema";
import { ApolloServerExpressConfig } from "apollo-server-express";

type CreateServerArgs = {
    authorization?: boolean;
    role?: Role;
    userId?: string;
    scope?: string;
    apolloConfig?: ApolloServerExpressConfig;
};

export async function createServer({
    authorization = true,
    role = "user",
    userId = "00000000-0000-0000-0000-000000000001",
    scope = "",
    apolloConfig = {},
}: CreateServerArgs = {}) {
    const schema = await createSchema();

    switch (role) {
        case "user":
            break;
        case "staff":
            userId = "00000000-0000-0000-0000-000000000002";
            break;
        case "m2m":
            userId = "";
            scope = "todo";
            break;
    }

    log.debug("createServer", { authorization, role, userId, scope });
    const headers = authorization ? { authorization: "Bearer TODO" } : {};

    return new ApolloServer({
        schema,
        context: context({ req: { headers } } as never),
        ...apolloConfig,
    });
}
