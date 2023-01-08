import { Ctx, Query, Resolver } from "type-graphql";
import log from "@src/logger";
import { Context } from "@src/types/Context";
import { Health } from "@src/types/Health";

/**
 * Deep health check resolver.
 */
@Resolver()
export class HealthResolver {
    @Query(() => Health, { description: "Deep health check." })
    async health(@Ctx() context: Context): Promise<Health> {
        const item = await context.prisma.item.findFirst({ select: { id: true } });
        const dbIsEmpty = item === null;
        if (!dbIsEmpty && (item === undefined || typeof item.id !== "string")) {
            throw new Error(`Invalid structure of item: ${item}`);
        }
        log.info("Health OK", { role: context.role, dbIsEmpty });
        return { ok: true };
    }
}
