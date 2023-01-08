import { AuthChecker } from "type-graphql";
import { Context } from "@src/types/Context";

/**
 * Auth checker to validate roles required in `@Authorized(roles)`.
 */
const authChecker: AuthChecker<Context> = ({ context }, roles) => {
    // NOTE: Use RLS where possible. Add `@Authorized(roles)` where needed only.
    // To add `@Authorized` to generated resolvers, use:
    // https://prisma.typegraphql.com/docs/advanced/additional-decorators

    // If no `roles` are required in `@Authorized(roles)`, then allow access.
    if (roles.length === 0) {
        return true;
    }

    // If caller's `role` is in allowed `roles`, then allow access.
    if (roles.includes(context.role)) {
        return true;
    }

    // Otherwise, deny access.
    return false;
};

export default authChecker;
