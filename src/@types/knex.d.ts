import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    food_description: {
      id: string;
      name: string;
      description: string;
      date: string;
      time: string;
      inOutDiet: string;
    };

    user: {
      id: string;
      name: string;
      email: string;
      password_hash: string;
      created_at: string;
    };
  }
}
