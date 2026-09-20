import knex, { type Knex } from "knex";
import { env } from "../src/env/index.js";

export const setupKnex = knex;

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? {
          filename: env.DATABASE_URL,
        }
      : {
          connectionString: env.DATABASE_URL,
          ssl:
            env.NODE_ENV === "production"
              ? { rejectUnauthorized: false }
              : false,
        },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knexDb = setupKnex(config);
