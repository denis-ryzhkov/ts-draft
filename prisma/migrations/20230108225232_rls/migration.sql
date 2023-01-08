-- This migration defines access control using GRANT and RLS.

-- We want admin user to `BYPASSRLS`, so we don't `FORCE ROW LEVEL SECURITY`.

-- caller:
-- Unprivileged role for a caller of GraphQL request.
DO $$BEGIN
    -- Database roles are global across a database cluster installation,
    -- so once `CREATE ROLE "caller"` succeeds in local "test" DB migrations,
    -- it would fail in local "start" DB migrations.
    -- As `CREATE ROLE IF NOT EXISTS` syntax is not supported, the best way is:
    IF NOT EXISTS (SELECT FROM "pg_catalog"."pg_roles" WHERE "rolname" = 'caller') THEN
        CREATE ROLE "caller";
    END IF;
END$$;

-- NOTE:
-- `USING` is applied to old data: `SELECT`, `UPDATE`, `DELETE`.
-- `WITH CHECK` is applied to new data: `INSERT`, `UPDATE`.
-- So if you `GRANT DELETE` with RLS different from `SELECT`, then also:
-- `CREATE POLICY "DELETE" ON "..." AS RESTRICTIVE FOR DELETE TO "caller" USING (...);`
-- Details: https://www.postgresql.org/docs/current/ddl-rowsecurity.html

-- Item:
-- create: admin
-- read: if role=user then require item.type=normal else allow
-- update: custom mutations (as admin)
-- delete: admin

GRANT SELECT ON "Item" TO "caller";

ALTER TABLE "Item" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ALL" ON "Item" TO "caller"
    USING (
        current_setting('caller.role') IN ('staff', 'm2m') OR
        current_setting('caller.role') = 'user' AND "Item"."type" = 'normal'
    );

-- ItemType:
-- read: all
-- write: staff

GRANT INSERT, SELECT, UPDATE, DELETE ON "ItemType" TO "caller";
ALTER TABLE "ItemType" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ALL" ON "ItemType" TO "caller"
    USING (current_setting('caller.role') IN ('user', 'staff', 'm2m'))
    WITH CHECK (current_setting('caller.role') = 'staff');
