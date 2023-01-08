import healthQuery from "@src/resolvers/health/health.test.graphql";
import { createServer } from "@src/testHelpers/server";
import { ServiceResponse } from "@src/testHelpers/types";
import { Health } from "@src/types/Health";

describe("healthResolver", () => {
    it("should raise an error for user without Authorization header", async () => {
        const failsOnContext = async () => await createServer({ authorization: false });
        await expect(failsOnContext).rejects.toThrow("Authorization header invalid");
    });

    it("should return true for user with Authorization header", async () => {
        const server = await createServer();

        const response = (await server.executeOperation({
            query: healthQuery,
            variables: {},
        })) as ServiceResponse<"health", Health>;

        expect(response.errors).toBeUndefined();
        expect(response.data.health.ok).toBe(true);
    });
});
