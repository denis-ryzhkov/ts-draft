import { Field, ObjectType } from "type-graphql";

/**
 * Deep health check response.
 */
@ObjectType({ description: "Deep health check response." })
export class Health {
    @Field({ description: "If health is OK." })
    ok: boolean;
}
