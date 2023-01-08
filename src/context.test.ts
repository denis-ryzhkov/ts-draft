import { PrismaClient } from "@prisma/client";
import getContext from "@src/context";
import { Context } from "@src/types/Context";

describe("`getContext` function", () => {
    it("should require correct `Bearer` token", () => {
        const bad = () => {
            getContext({ req: { headers: { authorization: "bear err" } } } as never);
        };

        expect(bad).toThrow(new Error("Authorization header invalid"));
    });

    it("should return a valid context", () => {
        const authorization = "Bearer TODO";
        const context = getContext({
            req: { headers: { authorization } },
        } as never) as Context;

        expect(context.role).toBe("user");
        expect(context.userId).toBe("00000000-0000-0000-0000-000000000001");
        expect(context.prisma).toBeInstanceOf(PrismaClient);
    });
});
