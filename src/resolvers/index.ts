/**
 * Generated resolvers.
 */
import {
    /*
        We import minimal required set of generated resolvers only.
        Please see the directories below to find 14 resolvers available for each table:

        C: CreateMany, CreateOne.
        R: FindFirst[OrThrow], FindMany, FindUnique[OrThrow], Aggregate, GroupBy.
        U: UpdateMany, UpdateOne, UpsertOne.
        D: DeleteMany, DeleteOne.

        NOTE: `DeleteOne` makes `row = SELECT ...; DELETE ...; return row;`
        In RLS case the number of rows deleted can be zero without any errors thrown.
        So to find out if the row was deleted or not we will have to do additional query.
        Hence we use `DeleteMany` which instantly returns the number of rows deleted.
    */

    // node_modules/@generated/type-graphql/resolvers/crud/Item
    FindManyItemResolver, // `items(where: {anything`
    FindUniqueItemResolver, // `item(where: {id`, or other unique key.

    // node_modules/@generated/type-graphql/resolvers/crud/ItemType
    // TODO

    // node_modules/@generated/type-graphql/resolvers/relations/resolvers.index.ts
    /*
        TODO: Implement RLS support for Prisma fluent API in `src/context.ts: rlsMiddleware`
        once we need it to e.g. `query { items { something { ...}}}`.
        Once implemented, import the relations.
    */
} from "@generated/type-graphql";

/**
 * Custom resolvers.
 * https://prisma.typegraphql.com/docs/advanced/custom-operations
 */
import { HealthResolver } from "@src/resolvers/health";

/**
 * Default export as one _array_, GraphQL schema is built from.
 * `export {...} from "...";` requires type-killer we'd better avoid:
 * `const resolvers = Object.values(resolversNamespace) as unknown as NonEmptyArray<Function>;`
 */
export default [
    // Item:
    FindManyItemResolver,
    FindUniqueItemResolver,

    // ItemType:
    // TODO

    // Custom:
    HealthResolver,
] as const;
