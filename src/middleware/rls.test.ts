import { expect, it, jest } from "@jest/globals";
import { rlsMiddleware, setCallerVar } from "@src/middleware/rls";
import { current } from "@src/types/Context";

describe("`setCallerVar` function", () => {
    it.each(["'", "\\"])("should ban %s in `value`", (dangerous) => {
        expect(() =>
            setCallerVar(null as never, "name", `some${dangerous}thing`),
        ).toThrow();
    });

    it("should execute expected SQL", () => {
        const prisma = { $executeRawUnsafe: jest.fn() };
        setCallerVar(prisma as never, "name", "value");
        const lastCall = prisma.$executeRawUnsafe.mock.lastCall;

        expect(lastCall).toEqual([`SET LOCAL "caller".name = 'value'`]);
    });
});

describe("`rlsMiddleware` function", () => {
    it("should detect Prisma fluent API", () => {
        const params = { dataPath: ["items", "something"] };
        const bad = async () => await rlsMiddleware(params as never, null as never);

        expect(bad).rejects.toThrow(
            new Error("Implement RLS support for Prisma fluent API!"),
        );
    });

    it("should execute expected SQL", async () => {
        const prisma = {
            $executeRawUnsafe: jest.fn((sql: string) => `PrismaPromise of ${sql}`),
            item: { findMany: jest.fn(() => "PrismaPromise of findMany") },
            $transaction: jest.fn(() => ["...", "Result of findMany"]),
        };

        current.context = {
            role: "user",
            userId: "00000000-0000-0000-0000-000000000001",
            prisma: prisma as never,
        } as never;

        const params = {
            runInTransaction: false,
            dataPath: [],
            model: "Item",
            action: "findMany",
            args: [],
        };

        const result = await rlsMiddleware(params as never, null as never);

        expect(prisma.$executeRawUnsafe.mock.calls).toEqual([
            [`SET LOCAL ROLE "caller"`],
            [`SET LOCAL "caller".role = 'user'`],
            [`SET LOCAL "caller"."userId" = '00000000-0000-0000-0000-000000000001'`],
        ]);

        expect(prisma.$transaction.mock.lastCall).toEqual([
            [
                `PrismaPromise of SET LOCAL ROLE "caller"`,
                `PrismaPromise of SET LOCAL "caller".role = 'user'`,
                `PrismaPromise of SET LOCAL "caller"."userId" = ` +
                    `'00000000-0000-0000-0000-000000000001'`,
                `PrismaPromise of findMany`,
            ],
        ]);

        expect(result).toBe("Result of findMany");
    });
});
