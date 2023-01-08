/**
 * Test data for `Item` type.
 */

import { Item } from "@prisma/client";
import { current, getPrisma } from "@src/types/Context";

const prisma = getPrisma();

export const createItem = async (): Promise<Item> => {
    try {
        current.isAdmin = true;

        // https://www.prisma.io/docs/concepts/components/prisma-client/crud
        return await prisma.item.create({
            data: {
                id: "TEST-item-id",
                type: "normal",
                name: "TEST-staff-only-item",
            },
        });
    } finally {
        current.isAdmin = false;
    }
};

export const deleteTestItems = async () => {
    // If tests are run against prod DB due to an error,
    // then at least we will not delete real items.
    try {
        current.isAdmin = true;
        await prisma.item.deleteMany({ where: { name: { startsWith: "TEST-" } } });
    } finally {
        current.isAdmin = false;
    }
};
