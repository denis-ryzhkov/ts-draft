/**
 * Entrypoint for local server invocations.
 */
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import getContext from "@src/context";
import log from "@src/logger";
import { createSchema } from "@src/schema";

const PORT = 4444;

async function main() {
    try {
        const schema = await createSchema({ emitSchemaFile: true });
        const server = new ApolloServer({
            schema,
            context: getContext,
            debug: process.env.LOG_LEVEL === "debug",
        });
        await server.listen(PORT);
        log.info(`Server has started: http://localhost:${PORT}`);
    } catch (error) {
        log.error("Setup failed", error);
        throw error;
    }
}

main();
