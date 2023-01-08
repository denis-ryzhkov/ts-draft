# TODO

TODO.

## Install

* Run and add to your shell config file: `PATH=$PATH:./node_modules/.bin`  
  or use `npx prisma` instead of just `prisma`, etc.
* Run:

```shell
nvm i
npm i
npm run db # (Re)create local DBs if needed.
```

* To update generated resolvers and schema without `npm run db`, please `npm run build`.
* If you use `npm i --save REDACTED` to install new packages,
  it deletes generated resolvers, so please `npm run build` to fix it.

## Check

```
npm run lint
npm t
```

* We [serialize](https://stackoverflow.com/a/60819664/350937) `npm t`
  by using `jest --runInBand` to avoid race conditions, it had no performance impact.

## Start

* Either (re)create local DBs with `npm run db`  
  or `npm run db:reuse` to reuse existing local DBs.
* Run: `npm start`

## Use

- Either [GraphQL sandbox](https://studio.apollographql.com/sandbox/explorer)
- Or `curl`:

```
# Request:
curl http://localhost:4444 \
    -H "authorization: Bearer TODO" \
    -H "content-type: application/json" \
    -d '{"query": "query {health {ok}}"}'

# Response:
{"data":{"health":{"ok":true}}}

# Logs:
{"dbIsEmpty":false,"level":"info","message":"Health OK","role":"user"}
```

## How to create DB migration

* Update `prisma/schema.prisma` file.
* Run `npm run db` to (re)create local DBs to ensure clean baseline for new migration.
* Run `npm run mig:new MIGRATION_NAME` to create new migration.
* Either `npm run db` again
  to recreate both local "start" and "test" DBs from the latest migration history,
  or run `npm run mig:start && npm run mig:test` to apply just the latest migration.

## How to squash DB migrations

* Never squash migrations which are deployed or used by other developers already.
* In other cases, if you need it, merge multiple auto-generated migration files to one file.
* Run `npm run db` to recreate both local "start" and "test" DBs from the latest migration history.

## How to access local "start" DB

```
npm start
npm run psql
\d
\d "Item"
SELECT * FROM "Item" LIMIT 10;
```

* If you need custom data in "start" DB:
  * `cp prisma/start.sql custom.sql`
  * Update `custom.sql` as you need.
  * Apply it using `npm run psql:data < custom.sql`
  * Consider adding some parts to `prisma/start.sql`
  * `rm custom.sql`
