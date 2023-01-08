import { GraphQLResponse } from "apollo-server-types";

export type ServiceResponse<
    ResolverName extends string,
    ResolverReturnType,
> = GraphQLResponse & {
    data: { [PropertyName in ResolverName]: ResolverReturnType };
};
