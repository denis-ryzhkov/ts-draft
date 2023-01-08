/**
 * Shortcut role used in RLS.
 * Please see `prisma/migrations/*rls*`
 */
export type Role = "user" | "staff" | "m2m";

/**
 * TODO: Calculate `Role` from JWT.
 */
export const getRole = (): Role => {
    return "user";
};
