/**
 * Tests of `ErrorInterceptor` middleware.
 */

import { ApolloError } from "apollo-server";
import { GraphQLError } from "graphql";
import { expect, jest } from "@jest/globals";
import { ResolverData } from "type-graphql";
import ErrorInterceptor from "@src/middleware/ErrorInterceptor";
import log from "@src/logger";

jest.mock("@src/logger");

describe("`ErrorInterceptor` middleware", () => {
    const params = {} as ResolverData<unknown>;

    it.each([
        "something... row-level security ...something",
        "something... Record to update not found ...something",
        "something... Record to delete does not exist ...something",
    ])(
        'should convert expected RLS error like "%s" to `GraphQLError` "Not available"',
        async (message: string) => {
            const next = async () => {
                throw new Error(message);
            };

            const middleware = async () => {
                await ErrorInterceptor(params, next);
            };

            await expect(middleware).rejects.toThrow(new GraphQLError("Not available"));
        },
    );

    it("should forward `GraphQLError` to the client", async () => {
        const next = async () => {
            throw new GraphQLError("Invalid");
        };

        const middleware = async () => {
            await ErrorInterceptor(params, next);
        };

        await expect(middleware).rejects.toThrow(new GraphQLError("Invalid"));
    });

    it("should log and convert other errors to a generic 500", async () => {
        const error = new Error("Unexpected");

        const next = async () => {
            throw error;
        };

        const middleware = async () => {
            await ErrorInterceptor(params, next);
        };

        await expect(middleware).rejects.toThrow(
            new ApolloError("500 - API request failed"),
        );

        expect(jest.mocked(log.error).mock.lastCall).toEqual([
            "Resolver threw error",
            error,
        ]);
    });

    it("should return a value from the next function when it doesn't throw an error", async () => {
        const next = async () => 42;
        const result = await ErrorInterceptor(params, next);

        await expect(result).toBe(42);
    });
});
