/**
 * Entrypoint for lambda invocations.
 */
import "reflect-metadata";
import { ApolloServer } from "apollo-server-lambda";
import {
    APIGatewayEvent,
    APIGatewayProxyCallback,
    Context as AwsLambdaContext,
    Handler,
} from "aws-lambda";
import { printSchema } from "graphql";
import { getLambdaContext } from "@src/context";
import log from "@src/logger";
import { createSchema } from "@src/schema";

// Cache a copy of the handler.
let _graphqlHandler: Handler;

export const graphqlHandler = async (
    event: APIGatewayEvent,
    context: AwsLambdaContext,
    callback: APIGatewayProxyCallback,
) => {
    if (!_graphqlHandler) {
        try {
            const schema = await createSchema();
            const server = new ApolloServer({
                schema,
                context: getLambdaContext,
                debug: process.env.LOG_LEVEL === "debug",
            });
            _graphqlHandler = server.createHandler();
            log.info("GraphQL handler is ready");
        } catch (error) {
            log.error("Setup failed", error);
            throw error;
        }
    }
    return _graphqlHandler(event, context, callback);
};

export const schemaHandler = async (
    event: APIGatewayEvent,
    context: AwsLambdaContext,
    callback: APIGatewayProxyCallback,
) => {
    const schema = await createSchema();
    callback(null, {
        body: printSchema(schema),
        headers: { "Content-Type": "text/plain" },
        statusCode: 200,
    });
};
