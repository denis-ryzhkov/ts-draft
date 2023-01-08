import { ResolverData } from "type-graphql";
import authChecker from "@src/authChecker";
import { Context } from "@src/types/Context";
import { Role } from "@src/types/Role";

describe("authChecker", () => {
    const createResolverData = (role: Role): ResolverData<Context> => {
        return { context: { role } } as unknown as ResolverData<Context>;
    };

    it("should return true if no roles are provided", () => {
        expect(authChecker(createResolverData("user"), [])).toEqual(true);
    });

    it("should return true if caller's role is in the allowed roles", () => {
        expect(authChecker(createResolverData("user"), ["user", "staff"])).toEqual(
            true,
        );
    });

    it("should return false if caller's role is not in the allowed roles", () => {
        expect(authChecker(createResolverData("user"), ["staff"])).toEqual(false);
    });
});
