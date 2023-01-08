import { ContextFunction } from "apollo-server-core/src/types";
import { Context as AwsLambdaContext, APIGatewayEvent } from "aws-lambda";
import express from "express";
import log from "@src/logger";
import { current, Context, getPrisma } from "@src/types/Context";
import { Role } from "@src/types/Role";

type Express = { req: express.Request; res: express.Response };

/**
 * Get GraphQL context from express request.
 */
export const getContext: ContextFunction<Express, Context> = ({ req }) => {
    // Require "Authorization: Bearer JWT".
    if (
        typeof req.headers.authorization !== "string" ||
        !req.headers.authorization.startsWith("Bearer ")
    ) {
        throw new Error("Authorization header invalid");
    }

    // TODO: Parse JWT, import and use `getRole`.
    const role: Role = "user";
    const userId = "00000000-0000-0000-0000-000000000001";

    // Start composing the context of current request.
    const contextDraft = { role, userId };
    log.info("Context", contextDraft);

    // Get or create cached `prisma` client.
    const prisma = getPrisma();

    // Finish composing the context of current request.
    current.context = { prisma, ...contextDraft };
    return current.context;
};

export default getContext;

/**
 * Get GraphQL context from Lambda request.
 */
export const getLambdaContext: ContextFunction<
    { event: APIGatewayEvent; context: AwsLambdaContext; express: Express },
    Context
> = ({ express }) => getContext(express);
