import TTLCache from "@isaacs/ttlcache";

export const cache = new TTLCache();

// TODO: After review submit the code below to https://github.com/isaacs/ttlcache

type GetValue<T> = () => T;
type AsyncGetValue<T> = () => Promise<T>;

/**
 * Produces function returning a value cached for given `seconds`.
 * `Infinity` is a valid `seconds` value.
 * Usage:
 *      const getFoo = cached("foo", Infinity, (): Foo => makeFoo());
 */
export const cached =
    <T>(key: string, seconds: number, getValue: GetValue<T>): GetValue<T> =>
    () => {
        let value: T | undefined = cache.get(key);

        if (value === undefined) {
            value = getValue();
            cache.set(key, value, { ttl: seconds * 1000 });
        }

        return value;
    };

/**
 * Produces async function returning a value cached for given `seconds`.
 * `Infinity` is a valid `seconds` value.
 * Usage:
 *      const getFoo = acached("foo", Infinity,
 *          async (): Promise<Foo> => await makeFoo());
 */
export const acached =
    <T>(key: string, seconds: number, getValue: AsyncGetValue<T>): AsyncGetValue<T> =>
    async () => {
        let value: T | undefined = cache.get(key);

        if (value === undefined) {
            value = await getValue();
            cache.set(key, value, { ttl: seconds * 1000 });
        }

        return value;
    };
