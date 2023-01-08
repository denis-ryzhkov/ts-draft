import { GraphQLSchema } from "graphql";
import { buildSchema, BuildSchemaOptions } from "type-graphql";
import authChecker from "@src/authChecker";
import ErrorInterceptor from "@src/middleware/ErrorInterceptor";
import resolvers from "@src/resolvers";

/**
 * Create a GraphQL schema.
 */
export function createSchema(
    options: Omit<BuildSchemaOptions, "resolvers"> = {},
): Promise<GraphQLSchema> {
    return buildSchema({
        resolvers,
        authChecker,
        globalMiddlewares: [ErrorInterceptor],
        ...options,
    });
}
