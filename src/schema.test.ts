import { GraphQLSchema } from "graphql";
import { createSchema } from "@src/schema";

describe("schema", () => {
    it("should be a schema", async () => {
        const schema = await createSchema();
        expect(schema).toBeInstanceOf(GraphQLSchema);
    });
});
