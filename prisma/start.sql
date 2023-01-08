-- Test data to populate "start" DB.

DELETE FROM "Item" WHERE "name" LIKE 'TEST-%';
-- Rows in related tables (if any) will be deleted by `ON DELETE CASCADE`.

INSERT INTO "Item" (
    "id",
    "createdAt",
    "updatedAt",
    "type",
    "name"
) VALUES (
    'TEST-item-id',
    NOW(),
    NOW(),
    'normal',
    'TEST-staff-only-item'
);
