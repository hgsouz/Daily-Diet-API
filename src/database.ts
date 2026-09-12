import knex, { type Knex } from "knex";

export const setupKnex = knex;

export const config: Knex.Config = {
  client: "sqlite",
  connection: "./db/app.db",
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knexDb = setupKnex(config);
