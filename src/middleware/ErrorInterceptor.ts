import { ApolloError } from "apollo-server";
import { GraphQLError } from "graphql";
import { MiddlewareFn } from "type-graphql";
import log from "@src/logger";

/**
 * Middleware that intercepts all errors in requests handled by `ApolloServer`
 * and decides how to process them.
 */
const ErrorInterceptor: MiddlewareFn<unknown> = async (params, next) => {
    try {
        return await next();
    } catch (error) {
        // Convert expected RLS errors to `GraphQLError`.
        if (
            [
                "row-level security",
                "Record to update not found",
                "Record to delete does not exist",
            ].some((part) => error instanceof Error && error.message.includes(part))
        ) {
            throw new GraphQLError("Not available"); // Either "Forbidden" or "Not found".
        }

        // If this is a `GraphQLError`, then forward it to the client.
        if (error instanceof GraphQLError) {
            throw error;
        }

        // Otherwise log it, which will also notify developers,
        // and return a generic 500.
        log.error("Resolver threw error", error);
        throw new ApolloError("500 - API request failed");
    }
};

export default ErrorInterceptor;
